import os
import sys
import math
import base64
import numpy as np
from PIL import Image

def get_luminance(arr):
    # arr: H x W x 3 or H x W x 4 (RGB/RGBA)
    r = arr[:, :, 0].astype(np.float32)
    g = arr[:, :, 1].astype(np.float32)
    b = arr[:, :, 2].astype(np.float32)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def fit_polynomial_bg(lum, deg=4, iters=6, subsample=6):
    H, W = lum.shape
    # create normalized coordinates [-1, 1]
    y_coords, x_coords = np.mgrid[0:H:subsample, 0:W:subsample]
    y_norm = (y_coords.astype(np.float32) / (H - 1)) * 2 - 1
    x_norm = (x_coords.astype(np.float32) / (W - 1)) * 2 - 1
    
    sub_lum = lum[0:H:subsample, 0:W:subsample].astype(np.float32)
    
    # Polynomial terms for degree 4
    terms = []
    for d in range(deg + 1):
        for i in range(d + 1):
            j = d - i
            terms.append((x_norm**i * y_norm**j).flatten())
    A = np.column_stack(terms) # N_samples x N_terms
    
    # Iterative robust polynomial fit
    # Mask out pixels where foreground is dark (residual bg - lum is large)
    flat_lum = sub_lum.flatten()
    mask = np.ones(len(flat_lum), dtype=bool)
    
    for it in range(iters):
        # Solve least squares on masked pixels
        A_masked = A[mask]
        lum_masked = flat_lum[mask]
        coeffs, _, _, _ = np.linalg.lstsq(A_masked, lum_masked, rcond=None)
        
        # Evaluate current background estimate
        bg_est = A @ coeffs
        residuals = bg_est - flat_lum # positive where foreground lines are darker than paper
        
        sd = np.std(residuals[mask])
        threshold = max(6.0, 1.6 * sd)
        # Keep pixels where bg - l < threshold (i.e. not dark foreground lines)
        mask = residuals < threshold
        # also ignore extreme bottom outliers if any
        mask &= (flat_lum - bg_est) < threshold
    
    # Evaluate full resolution bg
    full_y, full_x = np.mgrid[0:H, 0:W]
    full_y_norm = (full_y.astype(np.float32) / (H - 1)) * 2 - 1
    full_x_norm = (full_x.astype(np.float32) / (W - 1)) * 2 - 1
    
    full_terms = []
    for d in range(deg + 1):
        for i in range(d + 1):
            j = d - i
            full_terms.append((full_x_norm**i * full_y_norm**j).flatten())
    full_A = np.column_stack(full_terms)
    full_bg = (full_A @ coeffs).reshape(H, W)
    return full_bg

def quantile_crop(alpha_mask, q_low=0.002, q_high=0.998):
    # Find bounding box based on coordinates where alpha > 0
    ys, xs = np.where(alpha_mask > 0.01)
    if len(xs) == 0:
        return 0, alpha_mask.shape[1], 0, alpha_mask.shape[0]
    
    x_min = int(np.quantile(xs, q_low))
    x_max = int(np.quantile(xs, q_high))
    y_min = int(np.quantile(ys, q_low))
    y_max = int(np.quantile(ys, q_high))
    
    # Bounds check
    H, W = alpha_mask.shape
    x_min = max(0, min(W - 2, x_min))
    x_max = max(x_min + 1, min(W, x_max))
    y_min = max(0, min(H - 2, y_min))
    y_max = max(y_min + 1, min(H, y_max))
    return x_min, x_max, y_min, y_max

def sample_point_cloud(alpha_img, target_aspect, M=11000):
    # alpha_img is H x W float array [0, 1]
    H, W = alpha_img.shape
    # Probability proportional to alpha
    probs = alpha_img.flatten()
    s = probs.sum()
    if s == 0:
        probs = np.ones_like(probs) / len(probs)
    else:
        probs = probs / s
    
    # Deterministic sampling
    rng = np.random.default_rng(20261014)
    indices = rng.choice(len(probs), size=M, p=probs, replace=True)
    
    ys = (indices // W).astype(np.float32) + rng.uniform(-0.5, 0.5, size=M)
    xs = (indices % W).astype(np.float32) + rng.uniform(-0.5, 0.5, size=M)
    
    # Normalise u, v to [0, 65535]
    u = np.clip((xs / (W - 1)) * 65535, 0, 65535).astype(np.uint16)
    v = np.clip((ys / (H - 1)) * 65535, 0, 65535).astype(np.uint16)
    
    # Tone sampled from alpha
    int_ys = np.clip(np.round(ys).astype(int), 0, H - 1)
    int_xs = np.clip(np.round(xs).astype(int), 0, W - 1)
    tones = (alpha_img[int_ys, int_xs] * 255).clip(0, 255).astype(np.uint8)
    
    # Store binary buffer: uint16 u (2*M bytes), uint16 v (2*M bytes), uint8 tone (M bytes)
    buffer = bytearray(2 * M + 2 * M + M)
    buffer[0 : 2 * M] = u.tobytes()
    buffer[2 * M : 4 * M] = v.tobytes()
    buffer[4 * M : 5 * M] = tones.tobytes()
    
    b64 = base64.b64encode(buffer).decode('ascii')
    return b64

def process_pipeline():
    base_dir = "public/assets"
    out_dir = "public/assets/cutouts"
    os.makedirs(out_dir, exist_ok=True)
    
    print("=== Processing Scene 01: Skyline ===")
    sky_path = os.path.join(base_dir, "scene-01-skyline.png")
    sky_img = Image.open(sky_path).convert("RGBA")
    sky_arr = np.array(sky_img)
    lum_sky = get_luminance(sky_arr)
    
    # Formula: alpha = clip((228 - l)/168, 0, 1); alpha = 0 where l >= 222. Width 1200, gain 1.15.
    alpha_sky = np.clip((228.0 - lum_sky) / 168.0, 0.0, 1.0)
    alpha_sky[lum_sky >= 222.0] = 0.0
    alpha_sky = np.clip(alpha_sky * 1.15, 0.0, 1.0) ** 0.85
    
    x1, x2, y1, y2 = quantile_crop(alpha_sky)
    cropped_alpha = alpha_sky[y1:y2, x1:x2]
    crop_h, crop_w = cropped_alpha.shape
    target_w = 1200
    target_h = int(round(target_w / 1.226))
    
    # Resize alpha to target dimensions with LANCZOS
    pil_alpha = Image.fromarray((cropped_alpha * 255).astype(np.uint8), mode='L')
    pil_alpha = pil_alpha.resize((target_w, target_h), Image.Resampling.LANCZOS)
    alpha_sky_final = np.array(pil_alpha).astype(np.float32) / 255.0
    
    # Cutout: Alpha only, RGB 0, lossless webp
    rgba_sky = np.zeros((target_h, target_w, 4), dtype=np.uint8)
    rgba_sky[:, :, 3] = (alpha_sky_final * 255).clip(0, 255).astype(np.uint8)
    sky_cutout = Image.fromarray(rgba_sky, mode='RGBA')
    sky_cutout.save(os.path.join(out_dir, "skyline.webp"), "WEBP", lossless=True)
    print("Saved skyline.webp, size:", target_w, "x", target_h)
    
    sky_b64 = sample_point_cloud(alpha_sky_final, 1.226)
    
    print("=== Processing Scene 02: Circuit ===")
    circ_path = os.path.join(base_dir, "scene-02-circuit.png")
    circ_img = Image.open(circ_path).convert("RGBA")
    circ_arr = np.array(circ_img)
    lum_circ = get_luminance(circ_arr)
    
    # Formula: fit degree-4 polynomial; d = bg - l; alpha = clip((d - 110)/60, 0, 1); alpha = 0 where d < 110. Width 1300, gain 1.5.
    print("Fitting degree-4 polynomial on circuit paper background...")
    bg_circ = fit_polynomial_bg(lum_circ, deg=4, iters=6, subsample=6)
    d_circ = bg_circ - lum_circ
    alpha_circ = np.clip((d_circ - 110.0) / 60.0, 0.0, 1.0)
    alpha_circ[d_circ < 110.0] = 0.0
    alpha_circ = np.clip(alpha_circ * 1.5, 0.0, 1.0) ** 0.85
    
    cx1, cx2, cy1, cy2 = quantile_crop(alpha_circ)
    cropped_circ = alpha_circ[cy1:cy2, cx1:cx2]
    target_cw = 1300
    target_ch = int(round(target_cw / 1.1557))
    
    pil_circ_alpha = Image.fromarray((cropped_circ * 255).astype(np.uint8), mode='L')
    pil_circ_alpha = pil_circ_alpha.resize((target_cw, target_ch), Image.Resampling.LANCZOS)
    alpha_circ_final = np.array(pil_circ_alpha).astype(np.float32) / 255.0
    
    rgba_circ = np.zeros((target_ch, target_cw, 4), dtype=np.uint8)
    rgba_circ[:, :, 3] = (alpha_circ_final * 255).clip(0, 255).astype(np.uint8)
    circ_cutout = Image.fromarray(rgba_circ, mode='RGBA')
    circ_cutout.save(os.path.join(out_dir, "circuit.webp"), "WEBP", lossless=True)
    print("Saved circuit.webp, size:", target_cw, "x", target_ch)
    
    circ_b64 = sample_point_cloud(alpha_circ_final, 1.1557)
    
    print("=== Processing Scene 03: Face and Hand ===")
    face_path = os.path.join(base_dir, "scene-03-face.png")
    face_img = Image.open(face_path).convert("RGBA")
    face_arr = np.array(face_img)
    lum_face = get_luminance(face_arr)
    
    # Formula: same polynomial fit; alpha = clip((d - 7)/175, 0, 1)^0.6; store luminance + alpha. Aspect 0.8959.
    print("Fitting polynomial on face background...")
    bg_face = fit_polynomial_bg(lum_face, deg=4, iters=6, subsample=6)
    d_face = bg_face - lum_face
    alpha_face = np.clip((d_face - 7.0) / 175.0, 0.0, 1.0) ** 0.6
    
    fx1, fx2, fy1, fy2 = quantile_crop(alpha_face)
    cropped_face_alpha = alpha_face[fy1:fy2, fx1:fx2]
    cropped_face_lum = lum_face[fy1:fy2, fx1:fx2]
    
    target_fw = 1000
    target_fh = int(round(target_fw / 0.8959))
    
    pil_face_a = Image.fromarray((cropped_face_alpha * 255).astype(np.uint8), mode='L').resize((target_fw, target_fh), Image.Resampling.LANCZOS)
    pil_face_l = Image.fromarray(cropped_face_lum.clip(0, 255).astype(np.uint8), mode='L').resize((target_fw, target_fh), Image.Resampling.LANCZOS)
    
    alpha_face_final = np.array(pil_face_a).astype(np.float32) / 255.0
    lum_face_final = np.array(pil_face_l).astype(np.uint8)
    
    rgba_face = np.zeros((target_fh, target_fw, 4), dtype=np.uint8)
    rgba_face[:, :, 0] = lum_face_final
    rgba_face[:, :, 1] = lum_face_final
    rgba_face[:, :, 2] = lum_face_final
    rgba_face[:, :, 3] = (alpha_face_final * 255).clip(0, 255).astype(np.uint8)
    
    face_cutout = Image.fromarray(rgba_face, mode='RGBA')
    face_cutout.save(os.path.join(out_dir, "face.webp"), "WEBP", lossless=True)
    print("Saved face.webp, size:", target_fw, "x", target_fh)
    
    face_b64 = sample_point_cloud(alpha_face_final, 0.8959)
    
    print("=== Processing Scene 04: Logo Mark ===")
    mark_path = os.path.join(base_dir, "logo-mark.png")
    mark_img = Image.open(mark_path).convert("RGBA")
    mark_arr = np.array(mark_img)
    # Check if mark already has alpha or white background
    if np.any(mark_arr[:, :, 3] < 250):
        alpha_mark = mark_arr[:, :, 3].astype(np.float32) / 255.0
    else:
        lum_mark = get_luminance(mark_arr)
        alpha_mark = np.clip((250.0 - lum_mark) / 200.0, 0.0, 1.0)
    
    mx1, mx2, my1, my2 = quantile_crop(alpha_mark)
    cropped_mark = alpha_mark[my1:my2, mx1:mx2]
    target_mw = 1000
    target_mh = int(round(target_mw / 1.0767))
    
    pil_mark_a = Image.fromarray((cropped_mark * 255).astype(np.uint8), mode='L').resize((target_mw, target_mh), Image.Resampling.LANCZOS)
    alpha_mark_final = np.array(pil_mark_a).astype(np.float32) / 255.0
    
    rgba_mark = np.zeros((target_mh, target_mw, 4), dtype=np.uint8)
    rgba_mark[:, :, 3] = (alpha_mark_final * 255).clip(0, 255).astype(np.uint8)
    mark_cutout = Image.fromarray(rgba_mark, mode='RGBA')
    mark_cutout.save(os.path.join(out_dir, "mark.webp"), "WEBP", lossless=True)
    print("Saved mark.webp, size:", target_mw, "x", target_mh)
    
    mark_b64 = sample_point_cloud(alpha_mark_final, 1.0767)
    
    # Save datasets to TypeScript file
    ts_code = f"""// Generated by scripts/art.py - Cyrolabz Transformation Story
export const STORY_META = {{
  aspect: [1.226, 1.1557, 0.8959, 1.0767],
  M: 11000,
}};

export const STORY_DATA: string[] = [
  "{sky_b64}",
  "{circ_b64}",
  "{face_b64}",
  "{mark_b64}",
];
"""
    os.makedirs("src/features/story", exist_ok=True)
    with open("src/features/story/storyData.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)
    print("Saved src/features/story/storyData.ts with all 4 datasets!")

if __name__ == "__main__":
    process_pipeline()

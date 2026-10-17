import os
import sys
import base64
import numpy as np
from PIL import Image

def get_grayscale(img: Image.Image) -> np.ndarray:
    # Convert to grayscale
    gray = img.convert("L")
    return np.array(gray, dtype=np.float32)

def fit_polynomial_bg(lum: np.ndarray, deg: int = 4, iters: int = 6, subsample: int = 4):
    H, W = lum.shape
    # Fit on every 4th pixel
    y_coords, x_coords = np.mgrid[0:H:subsample, 0:W:subsample]
    y_norm = (y_coords.astype(np.float32) / (H - 1)) * 2 - 1
    x_norm = (x_coords.astype(np.float32) / (W - 1)) * 2 - 1

    sub_lum = lum[0:H:subsample, 0:W:subsample].astype(np.float32)

    terms = []
    poly_powers = []
    for d in range(deg + 1):
        for i in range(d + 1):
            j = d - i
            poly_powers.append((i, j))
            terms.append((x_norm**i * y_norm**j).flatten())
    A = np.column_stack(terms)

    flat_lum = sub_lum.flatten()
    mask = np.ones(len(flat_lum), dtype=bool)

    for it in range(iters):
        A_masked = A[mask]
        lum_masked = flat_lum[mask]
        coeffs, _, _, _ = np.linalg.lstsq(A_masked, lum_masked, rcond=None)

        bg_est = A @ coeffs
        residuals = bg_est - flat_lum  # background minus luminance
        sd = np.std(residuals[mask])
        threshold = max(5.0, 1.6 * sd)
        mask = residuals < threshold

    # Evaluate full resolution bg using powers
    full_y, full_x = np.mgrid[0:H, 0:W]
    full_y_norm = (full_y.astype(np.float32) / (H - 1)) * 2 - 1
    full_x_norm = (full_x.astype(np.float32) / (W - 1)) * 2 - 1

    full_bg = np.zeros((H, W), dtype=np.float32)
    for idx, (i, j) in enumerate(poly_powers):
        c = coeffs[idx]
        if i == 0 and j == 0:
            full_bg += c
        elif i == 0:
            full_bg += c * (full_y_norm ** j)
        elif j == 0:
            full_bg += c * (full_x_norm ** i)
        else:
            full_bg += c * (full_x_norm ** i) * (full_y_norm ** j)

    return full_bg

def process_all_services_art():
    assets_dir = "assets"
    cutouts_dir = "public/assets/cutouts"
    os.makedirs(cutouts_dir, exist_ok=True)

    configs = [
        {
            "id": 1,
            "filename": "services-bg-1.png",
            "t0": 22.0,
            "t1": 120.0,
            "floor_trim": 0.85,
            "gain": 1.3,
            "target_w": 1600,
            "aspect": 1.7768,
            "name": "mesh ribbon",
        },
        {
            "id": 2,
            "filename": "services-bg-2.png",
            "t0": 22.0,
            "t1": 120.0,
            "floor_trim": None,
            "gain": 1.3,
            "target_w": 1600,
            "aspect": 1.7768,
            "name": "globe with network wave",
        },
        {
            "id": 3,
            "filename": "services-bg-3.png",
            "t0": 22.0,
            "t1": 120.0,
            "floor_trim": 0.885,
            "gain": 1.3,
            "target_w": 1600,
            "aspect": 1.7787,
            "name": "ribbon with scattered particles",
        },
        {
            "id": 4,
            "filename": "services-bg-4.png",
            "t0": 16.0,
            "t1": 120.0,
            "floor_trim": None,
            "gain": 1.2,
            "target_w": 800,
            "aspect": 1.0,
            "name": "smoke ring",
        },
    ]

    base64_results = []
    aspect_list = []

    for cfg in configs:
        in_path = os.path.join(assets_dir, cfg["filename"])
        print(f"\n=== Processing Image {cfg['id']}: {cfg['name']} ({in_path}) ===")
        img = Image.open(in_path)

        # Grayscale conversion. If width > 1800, resize to 1800px wide (LANCZOS)
        if img.width > 1800:
            new_h = int(round(img.height * (1800.0 / img.width)))
            img = img.resize((1800, new_h), Image.Resampling.LANCZOS)
            print(f"Resized input to 1800x{new_h}")

        lum = get_grayscale(img)
        H, W = lum.shape
        print(f"Image dimension: {W}x{H}")

        # Polynomial paper background estimation
        print(f"Fitting degree-4 polynomial background (subsample=4, 6 iters)...")
        bg = fit_polynomial_bg(lum, deg=4, iters=6, subsample=4)

        d = bg - lum
        t0 = cfg["t0"]
        t1 = cfg["t1"]
        alpha = np.clip((d - t0) / (t1 - t0), 0.0, 1.0)
        alpha[d < t0] = 0.0

        # Floor shadow streak removal
        if cfg["floor_trim"] is not None:
            trim_row = int(round(H * cfg["floor_trim"]))
            alpha[trim_row:, :] = 0.0
            print(f"Trimmed floor shadow streak below row {trim_row} ({cfg['floor_trim']*100:.1f}%)")

        # Point cloud: sample exactly 11,000 points with probability proportional to alpha over the WHOLE frame
        M = 11000
        probs = alpha.flatten()
        prob_sum = probs.sum()
        if prob_sum <= 0:
            probs = np.ones_like(probs) / len(probs)
        else:
            probs = probs / prob_sum

        rng = np.random.default_rng(20261017 + cfg["id"])
        indices = rng.choice(len(probs), size=M, p=probs, replace=True)

        jitter_y = rng.uniform(-0.5, 0.5, size=M).astype(np.float32)
        jitter_x = rng.uniform(-0.5, 0.5, size=M).astype(np.float32)

        sampled_y = (indices // W).astype(np.float32) + jitter_y
        sampled_x = (indices % W).astype(np.float32) + jitter_x

        # u = x / width and v = y / height
        u = np.clip(sampled_x / W, 0.0, 1.0)
        v = np.clip(sampled_y / H, 0.0, 1.0)

        # Tone = alpha at the sampled pixel
        int_y = np.clip(indices // W, 0, H - 1)
        int_x = np.clip(indices % W, 0, W - 1)
        tone_vals = np.clip(np.round(alpha[int_y, int_x] * 255.0), 0, 255).astype(np.uint8)

        # Store as base64 of: uint16 little-endian u (x65535), uint16 v (x65535), uint8 tone (x255)
        u_u16 = np.clip(np.round(u * 65535.0), 0, 65535).astype('<u2')
        v_u16 = np.clip(np.round(v * 65535.0), 0, 65535).astype('<u2')

        buffer = bytearray(2 * M + 2 * M + M)
        buffer[0 : 2 * M] = u_u16.tobytes()
        buffer[2 * M : 4 * M] = v_u16.tobytes()
        buffer[4 * M : 5 * M] = tone_vals.tobytes()

        b64 = base64.b64encode(buffer).decode('ascii')
        base64_results.append(b64)
        aspect_list.append(cfg["aspect"])
        print(f"Sampled 11,000 points. Encoded b64 length: {len(b64)} chars.")

        # Crisp cut-out: alpha only, RGB black, saved as lossless WebP
        # Width 1600 for images 1-3, 800 for image 4
        target_w = cfg["target_w"]
        target_h = int(round(target_w / cfg["aspect"]))

        # Apply a = clip(a * gain, 0, 1) ^ 0.85
        a_proc = np.clip(alpha * cfg["gain"], 0.0, 1.0) ** 0.85

        # Resize alpha to target dimensions with LANCZOS
        pil_a = Image.fromarray((a_proc * 255.0).astype(np.uint8), mode='L')
        pil_a = pil_a.resize((target_w, target_h), Image.Resampling.LANCZOS)
        final_alpha = np.array(pil_a)

        rgba = np.zeros((target_h, target_w, 4), dtype=np.uint8)
        rgba[:, :, 0] = 0
        rgba[:, :, 1] = 0
        rgba[:, :, 2] = 0
        rgba[:, :, 3] = final_alpha

        cutout_img = Image.fromarray(rgba, mode='RGBA')
        out_webp = os.path.join(cutouts_dir, f"services-{cfg['id']}.webp")
        cutout_img.save(out_webp, "WEBP", lossless=True)
        file_size = os.path.getsize(out_webp)
        print(f"Saved lossless WebP {out_webp} ({target_w}x{target_h}), size: {file_size / 1024:.1f} KB")

        # If file is over 420 KB, save it as lossy WebP quality 78 with alpha quality 90
        if file_size > 420 * 1024:
            cutout_img.save(out_webp, "WEBP", quality=78, alpha_quality=90)
            file_size2 = os.path.getsize(out_webp)
            print(f"File was over 420KB; re-saved lossy WebP (q=78, aq=90): {file_size2 / 1024:.1f} KB")

    # Output TypeScript data module
    ts_code = f"""// Generated by scripts/process-services-art.py - Cyrolabz Services Background Art
export const SERVICES_ART_META = {{
  aspect: {aspect_list},
  M: 11000,
}};

export const SERVICES_ART_DATA: string[] = [
  "{base64_results[0]}",
  "{base64_results[1]}",
  "{base64_results[2]}",
  "{base64_results[3]}",
];
"""
    out_ts = "src/features/services/servicesArtData.ts"
    os.makedirs(os.path.dirname(out_ts), exist_ok=True)
    with open(out_ts, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print(f"\nWrote {out_ts} with all 4 services artwork point clouds successfully!")

if __name__ == "__main__":
    process_all_services_art()

import os
import numpy as np
from PIL import Image

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def tint_alpha_only(cutout_img, ink_rgb):
    # Cutout is RGBA where alpha contains the shape
    arr = np.array(cutout_img)
    alpha = arr[:, :, 3].astype(np.float32) / 255.0
    H, W = alpha.shape
    out = np.zeros((H, W, 4), dtype=np.uint8)
    out[:, :, 0] = ink_rgb[0]
    out[:, :, 1] = ink_rgb[1]
    out[:, :, 2] = ink_rgb[2]
    out[:, :, 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, mode='RGBA')

def tint_face(face_img, ink_rgb, bg_rgb):
    # Face has luminance in RGB and alpha in A
    arr = np.array(face_img)
    lum = arr[:, :, 0].astype(np.float32) / 255.0 # 0 (dark lines) to 1 (light skin)
    alpha = arr[:, :, 3].astype(np.float32) / 255.0
    H, W = alpha.shape
    out = np.zeros((H, W, 4), dtype=np.uint8)
    
    # Remap luminance between ink (dark features) and bg (light features)
    for c in range(3):
        # d = ink + (bg - ink) * lum
        val = ink_rgb[c] + (bg_rgb[c] - ink_rgb[c]) * lum
        out[:, :, c] = np.clip(val, 0, 255).astype(np.uint8)
    out[:, :, 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, mode='RGBA')

def composite_on_bg(fg_img, bg_rgb, target_size=(500, 420)):
    # Create canvas with bg_rgb
    canvas = Image.new("RGBA", target_size, bg_rgb + (255,))
    # Scale fg to fit within target_size keeping aspect
    fg_w, fg_h = fg_img.size
    scale = min((target_size[0] - 40) / fg_w, (target_size[1] - 40) / fg_h)
    new_w = int(fg_w * scale)
    new_h = int(fg_h * scale)
    fg_resized = fg_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    pos_x = (target_size[0] - new_w) // 2
    pos_y = (target_size[1] - new_h) // 2
    canvas.paste(fg_resized, (pos_x, pos_y), fg_resized)
    return canvas

def generate_preview():
    light_bg = hex_to_rgb("#F4F5F7")
    light_ink = hex_to_rgb("#0B0C0E")
    
    dark_bg = hex_to_rgb("#0A0B0D")
    dark_ink = hex_to_rgb("#EEF0F3")
    
    skyline = Image.open("public/assets/cutouts/skyline.webp")
    circuit = Image.open("public/assets/cutouts/circuit.webp")
    face = Image.open("public/assets/cutouts/face.webp")
    mark = Image.open("public/assets/cutouts/mark.webp")
    
    # Light theme versions
    sky_light = composite_on_bg(tint_alpha_only(skyline, light_ink), light_bg)
    circ_light = composite_on_bg(tint_alpha_only(circuit, light_ink), light_bg)
    face_light = composite_on_bg(tint_face(face, light_ink, light_bg), light_bg)
    mark_light = composite_on_bg(tint_alpha_only(mark, light_ink), light_bg)
    
    # Dark theme versions
    sky_dark = composite_on_bg(tint_alpha_only(skyline, dark_ink), dark_bg)
    circ_dark = composite_on_bg(tint_alpha_only(circuit, dark_ink), dark_bg)
    face_dark = composite_on_bg(tint_face(face, dark_ink, dark_bg), dark_bg)
    mark_dark = composite_on_bg(tint_alpha_only(mark, dark_ink), dark_bg)
    
    # Create grid of 4 columns, 2 rows (Light on top, Dark on bottom)
    card_w, card_h = 500, 420
    grid = Image.new("RGBA", (card_w * 4, card_h * 2), (20, 20, 20, 255))
    
    grid.paste(sky_light, (0, 0))
    grid.paste(circ_light, (card_w, 0))
    grid.paste(face_light, (card_w * 2, 0))
    grid.paste(mark_light, (card_w * 3, 0))
    
    grid.paste(sky_dark, (0, card_h))
    grid.paste(circ_dark, (card_w, card_h))
    grid.paste(face_dark, (card_w * 2, card_h))
    grid.paste(mark_dark, (card_w * 3, card_h))
    
    os.makedirs("public/assets/preview", exist_ok=True)
    grid.save("public/assets/preview/cutouts_comparison.png", "PNG")
    print("Comparison preview saved to public/assets/preview/cutouts_comparison.png")

if __name__ == "__main__":
    generate_preview()

#!/usr/bin/env python3
"""
Analyze the certificate PDF to extract:
- All text blocks with exact positions, fonts, sizes, colors
- All images with positions and dimensions
- Page dimensions
- Drawing paths/lines
"""
import pymupdf
import json
import os

PDF_PATH = "/home/z/my-project/upload/SUNNY Certificate.pdf"
OUTPUT_DIR = "/home/z/my-project/upload/cert_analysis"

os.makedirs(OUTPUT_DIR, exist_ok=True)

doc = pymupdf.open(PDF_PATH)
page = doc[0]

print(f"Page size: {page.rect.width} x {page.rect.height} pts")
print(f"Page size inches: {page.rect.width/72:.2f} x {page.rect.height/72:.2f}")
print(f"Rotation: {page.rotation}")

# ── Extract text blocks with position info ──
print("\n" + "="*80)
print("TEXT BLOCKS (sorted by Y then X)")
print("="*80)

text_blocks = []
blocks = page.get_text("dict", flags=11)["blocks"]

for block in blocks:
    if block["type"] == 0:  # text block
        for line in block["lines"]:
            for span in line["spans"]:
                text = span["text"].strip()
                if not text:
                    continue
                bbox = span["bbox"]
                text_blocks.append({
                    "text": text,
                    "x": round(bbox[0], 2),
                    "y": round(bbox[1], 2),
                    "x1": round(bbox[2], 2),
                    "y1": round(bbox[3], 2),
                    "font": span["font"],
                    "size": round(span["size"], 2),
                    "color": f"#{span['color']:06x}",
                    "flags": span["flags"],
                    "origin": span.get("origin", []),
                })

# Sort by Y then X
text_blocks.sort(key=lambda b: (b["y"], b["x"]))

# Print all text blocks
for i, tb in enumerate(text_blocks):
    width = tb["x1"] - tb["x"]
    print(f"[{i:3d}] ({tb['x']:7.1f},{tb['y']:7.1f}) w={width:6.1f} | "
          f"font={tb['font'][:30]:30s} size={tb['size']:5.1f} color={tb['color']} | "
          f"text={tb['text'][:80]}")

# Save to JSON
with open(os.path.join(OUTPUT_DIR, "text_blocks.json"), "w") as f:
    json.dump(text_blocks, f, indent=2, ensure_ascii=False)

# ── Extract images ──
print("\n" + "="*80)
print("IMAGES")
print("="*80)

images = page.get_images(full=True)
print(f"Total images: {len(images)}")

for img_index, img in enumerate(images):
    xref = img[0]
    base_image = doc.extract_image(xref)
    image_info = {
        "xref": xref,
        "width": base_image.get("width"),
        "height": base_image.get("height"),
        "colorspace": base_image.get("colorspace"),
        "bpc": base_image.get("bpc"),
        "ext": base_image.get("ext"),
        "size_bytes": len(base_image.get("image", b"")),
    }
    print(f"  Image {img_index}: xref={xref} {image_info['width']}x{image_info['height']} "
          f"cs={image_info['colorspace']} ext={image_info['ext']} size={image_info['size_bytes']}")

    # Save each image
    img_filename = f"img_{img_index}_{xref}.{base_image['ext']}"
    img_path = os.path.join(OUTPUT_DIR, img_filename)
    with open(img_path, "wb") as f:
        f.write(base_image["image"])
    print(f"    Saved to: {img_path}")

# ── Extract image positions on page ──
print("\n" + "="*80)
print("IMAGE POSITIONS ON PAGE")
print("="*80)

for item in page.get_images(full=True):
    xref = item[0]
    
# Get image rects
img_rects = {}
for i, info in enumerate(page.get_image_info(xrefs=True)):
    print(f"  Image rect {i}: {info}")

# ── Extract drawings/paths ──
print("\n" + "="*80)
print("DRAWING PATHS (first 50)")
print("="*80)

drawings = page.get_drawings()
print(f"Total drawing operations: {len(drawings)}")

for i, d in enumerate(drawings[:50]):
    print(f"  Drawing {i}: type={d.get('type','?')} color={d.get('color')} fill={d.get('fill')} "
          f"width={d.get('width')} rect={d.get('rect')} items={len(d.get('items',[]))}")

# ── Extract all fonts used ──
print("\n" + "="*80)
print("FONTS USED")
print("="*80)

fonts = set()
for tb in text_blocks:
    fonts.add((tb["font"], tb["size"], tb["color"]))

for font, size, color in sorted(fonts, key=lambda x: (x[0], x[1])):
    print(f"  {font:40s} size={size:6.1f} color={color}")

print("\n" + "="*80)
print("ANALYSIS COMPLETE")
print("="*80)

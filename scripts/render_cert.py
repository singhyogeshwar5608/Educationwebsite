#!/usr/bin/env python3
"""
Render the certificate PDF to a high-res PNG for visual reference,
and also extract each image with its position info for template building.
"""
import pymupdf
import os

PDF_PATH = "/home/z/my-project/upload/SUNNY Certificate.pdf"
OUTPUT_DIR = "/home/z/my-project/upload/cert_analysis"

doc = pymupdf.open(PDF_PATH)
page = doc[0]

# Render to high-res PNG (300 DPI)
mat = pymupdf.Matrix(300/72, 300/72)
pix = page.get_pixmap(matrix=mat)
png_path = os.path.join(OUTPUT_DIR, "cert_300dpi.png")
pix.save(png_path)
print(f"Saved 300dpi render: {png_path} ({pix.width}x{pix.height})")

# Also render at 150 DPI for web preview
mat2 = pymupdf.Matrix(150/72, 150/72)
pix2 = page.get_pixmap(matrix=mat2)
png_path2 = os.path.join(OUTPUT_DIR, "cert_150dpi.png")
pix2.save(png_path2)
print(f"Saved 150dpi render: {png_path2} ({pix2.width}x{pix2.height})")

# Copy the background image to public dir for web use
import shutil
PUBLIC_DIR = "/home/z/my-project/public/cert"
os.makedirs(PUBLIC_DIR, exist_ok=True)

bg_src = os.path.join(OUTPUT_DIR, "img_0_16.jpeg")
bg_dst = os.path.join(PUBLIC_DIR, "certificate_bg.jpg")
shutil.copy2(bg_src, bg_dst)
print(f"Copied background to: {bg_dst}")

# Copy student photo placeholder
photo_src = os.path.join(OUTPUT_DIR, "img_3_20.jpeg")
photo_dst = os.path.join(PUBLIC_DIR, "student_photo_placeholder.jpg")
shutil.copy2(photo_src, photo_dst)
print(f"Copied student photo to: {photo_dst}")

# Copy QR images
qr1_src = os.path.join(OUTPUT_DIR, "img_1_18.png")
qr2_src = os.path.join(OUTPUT_DIR, "img_2_19.png")
qr1_dst = os.path.join(PUBLIC_DIR, "qr_border.png")
qr2_dst = os.path.join(PUBLIC_DIR, "qr_inner.png")
shutil.copy2(qr1_src, qr1_dst)
shutil.copy2(qr2_src, qr2_dst)
print(f"Copied QR images to: {qr1_dst}, {qr2_dst}")

doc.close()
print("Done!")

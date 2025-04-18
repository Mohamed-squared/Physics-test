import fitz  # PyMuPDF
import cv2
import numpy as np
from pix2tex.cli import LatexOCR
import json
import os

# Initialize pix2tex model
model = LatexOCR()

def preprocess_image(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Enhance contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    return enhanced

def extract_images_from_pdf(pdf_path, output_dir="images"):
    # Create output directory
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Open PDF
    doc = fitz.open(pdf_path)
    image_data = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_images(full=True)
        
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Save image
            image_path = os.path.join(output_dir, f"page_{page_num+1}_img_{img_index}.{image_ext}")
            with open(image_path, "wb") as f:
                f.write(image_bytes)
            
            # Preprocess image
            image = cv2.imread(image_path)
            if image is None:
                continue
            processed_image = preprocess_image(image)
            
            # Convert to LaTeX
            try:
                latex_code = model(processed_image)
            except Exception as e:
                print(f"Error converting image {image_path}: {e}")
                latex_code = ""
            
            # Store metadata
            image_data.append({
                "page": page_num + 1,
                "image_index": img_index,
                "image_path": image_path,
                "latex": latex_code,
                "chapter": None,  # To be set manually or via text analysis
                "problem_number": None  # To be set manually or via text analysis
            })
    
    doc.close()
    return image_data

def save_to_json(image_data, output_file="problems.json"):
    with open(output_file, "w") as f:
        json.dump(image_data, f, indent=2)

def main(pdf_path):
    print(f"Processing PDF: {pdf_path}")
    image_data = extract_images_from_pdf(pdf_path)
    save_to_json(image_data)
    print(f"Extracted {len(image_data)} problems to problems.json")

if __name__ == "__main__":
    pdf_path = r"C:\Users\pc\Desktop\scripts\pdf splitter\introduction-to-linear-algebra-fifth-edition-5nbsped-0980232775-9780980232776_compress-19-21.pdf"  # Replace with your PDF path
    main(pdf_path)
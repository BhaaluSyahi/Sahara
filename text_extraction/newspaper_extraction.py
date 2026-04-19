import cv2
import numpy as np
import pytesseract


def extract_text_from_image(image_path: str) -> str:

    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Could not read image: {image_path}")

    
    image_resized = cv2.resize(image, (500, 600))
    gray = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)

  
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 11, 5
    )

  
    kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 1))
    dilated = cv2.dilate(thresh, kernel_h, iterations=1)

 
    kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 5))
    dilated = cv2.dilate(dilated, kernel_v, iterations=2)


    kernel_erode = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated = cv2.erode(dilated, kernel_erode, iterations=1)

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

   
    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[1])

    extracted_text = ""
    for contour in contours:
        area = cv2.contourArea(contour)
        if area < 500:  # Skip noise / tiny blobs
            continue

        x, y, w, h = cv2.boundingRect(contour)

       
        if w < 20 or h < 10:
            continue

        
        pad = 4
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(image_resized.shape[1], x + w + pad)
        y2 = min(image_resized.shape[0], y + h + pad)
        crop = image_resized[y1:y2, x1:x2]

     
        block_text = pytesseract.image_to_string(crop, config="--psm 6")
        block_text = block_text.strip()
        if block_text:
            extracted_text += block_text + "\n\n"

    if not extracted_text.strip():
        raise ValueError(f"No text could be extracted from image: {image_path}")

    return extracted_text.strip()

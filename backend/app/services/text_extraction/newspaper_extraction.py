from PIL import Image
import pytesseract
import io


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from image file using Tesseract OCR
    Supports PNG, JPG, JPEG, TIFF, BMP formats
    """
    try:
        # Open image file
        if isinstance(image_path, str):
            img = Image.open(image_path)
        else:
            # Handle bytes data
            img = Image.open(io.BytesIO(image_path))
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(img)
        
        return text.strip()
    
    except Exception as e:
        print(f"Image OCR failed: {e}")
        return ""

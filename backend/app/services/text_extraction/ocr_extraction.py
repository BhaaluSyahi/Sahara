import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io
import os


def extract_text_from_pdf(pdf_path: str, poppler_path: str = None) -> str:
    """
    Extract text from PDF file using PyMuPDF (fitz)
    Falls back to OCR if text extraction fails
    """
    try:
        # Try direct text extraction first
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        
        doc.close()
        
        # If extracted text is too short, try OCR
        if len(text.strip()) < 50:
            return _ocr_pdf(pdf_path)
        
        return text.strip()
    
    except Exception as e:
        print(f"Direct PDF text extraction failed: {e}")
        return _ocr_pdf(pdf_path)


def _ocr_pdf(pdf_path: str) -> str:
    """
    OCR each page of PDF using Tesseract
    """
    try:
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Convert page to image
            pix = page.get_pixmap()
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            
            # OCR the image
            page_text = pytesseract.image_to_string(img)
            text += page_text + "\n"
        
        doc.close()
        return text.strip()
    
    except Exception as e:
        print(f"PDF OCR failed: {e}")
        return ""

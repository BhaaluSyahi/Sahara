import pytesseract
from pdf2image import convert_from_path
import platform


def extract_text_from_pdf(pdf_path, batch_size=3, poppler_path=None):
    text = ""
    page_number = 1
    
    kwargs = {}
    if platform.system() == 'Windows' and poppler_path:
        kwargs['poppler_path'] = poppler_path

    while True:
        try:
            images = convert_from_path(
                pdf_path, 
                dpi=300,
                grayscale=True,
                first_page=page_number, 
                last_page=page_number + batch_size - 1,
                **kwargs
            )
            
            if not images:
                break
                
            for image in images:
                extracted = pytesseract.image_to_string(image)
                clean_page = "\n".join([line.strip() for line in extracted.splitlines() if line.strip()])
                text += clean_page + "\n\n"
            
            page_number += batch_size
            
        except Exception as e:
            print(f"Error processing batch starting at page {page_number}: {e}")
            break
            
    return text

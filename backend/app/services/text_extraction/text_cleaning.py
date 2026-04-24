import re


def process_text(text: str) -> str:
    """
    Clean and preprocess text for better NER and AI processing
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep important punctuation
    text = re.sub(r'[^\w\s\.,;:!?()-]', '', text)
    
    # Fix spacing around punctuation
    text = re.sub(r'\s+([.,;:!?])', r'\1', text)
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    return text

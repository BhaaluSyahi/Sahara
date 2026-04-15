import contractions
import re


def normalize_data(text):
    # Preserve paragraph breaks before collapsing single newlines
    text = re.sub(r'\n{2,}', ' <PARA> ', text)
    text = text.replace('\n', ' ')
    text = contractions.fix(text)
    text = text.replace(' <PARA> ', '\n\n')
    return text


def process_text(text):
    return normalize_data(text)

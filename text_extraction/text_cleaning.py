import contractions
import spacy
import re
from spellchecker import SpellChecker

nlp = spacy.load('en_core_web_sm')
spell = SpellChecker()

def normalize_data(text):
    text = text.lower()
    text = text.replace('\n', ' ')
    text = contractions.fix(text)
    return text

def clean_ocr_noise(text):
    text = re.sub(r'[^a-zA-Z0-9\s.,!?]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def handle_spelling(text):
    words = text.split()
    corrected_words = []
    
    for word in words:
        clean_word = re.sub(r'[^a-zA-Z]', '', word)
        
        if clean_word and clean_word not in spell:
            corrected_words.append(spell.correction(clean_word))
        else:
            corrected_words.append(word)
    
    return " ".join(corrected_words)

def process_text(text):
    text = normalize_data(text)
    text = clean_ocr_noise(text)
    text = handle_spelling(text)
    
    doc = nlp(text)
    
    tokens = [
        token.lemma_ if token.lemma_ != '-PRON-' else token.text
        for token in doc
        if not token.is_stop 
        and not token.is_punct 
        and not token.is_space
    ]
    
    return " ".join(tokens)
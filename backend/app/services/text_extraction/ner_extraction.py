import spacy
import re

nlp = spacy.load("en_core_web_sm")


COMPLAINT_CATEGORIES = {
    "electricity": [
        "power cut", "power outage", "electricity", "electric", "voltage",
        "transformer", "wire", "cable", "short circuit", "blackout", "load shedding",
        "meter", "streetlight", "pole", "sparking", "tripping", "powercut", "power-cut",
    ],
    "water": [
        "water supply", "water shortage", "pipe", "pipeline", "leakage", "leak",
        "drainage", "sewage", "flood", "waterlogging", "contamination", "tap",
        "borewell", "tanker",
    ],
    "disaster": [
        "flood", "earthquake", "landslide", "cyclone", "storm", "fire", "collapse",
        "building collapse", "accident", "gas leak", "explosion", "rescue",
        "relief", "evacuation", "disaster",
    ],
    "road": [
        "pothole", "road damage", "road broken", "road repair", "traffic",
        "signal", "divider", "footpath", "pavement", "construction",
    ],
    "sanitation": [
        "garbage", "waste", "dustbin", "sweeping", "cleaning", "drain",
        "open defecation", "toilet", "sewage", "smell", "stench",
    ],
    "public_safety": [
        "crime", "theft", "harassment", "assault", "illegal", "encroachment",
        "noise", "pollution", "dog", "stray", "accident",
    ],
}

SEVERITY_KEYWORDS = {
    "high":   ["urgent", "emergency", "immediately", "critical", "dangerous", "life-threatening",
               "collapsed", "fire", "explosion", "rescue", "death", "injured", "severe"],
    "medium": ["broken", "damaged", "not working", "issue", "problem", "complaint",
               "repair", "fix", "leaking", "shortage"],
    "low":    ["minor", "small", "request", "suggestion", "inconvenience"],
}


def extract_phone_numbers(text):
    pattern = r'(?:\+91[\s-]?)?[6-9]\d{9}'
    return re.findall(pattern, text)


def extract_pin_codes(text):
    return re.findall(r'\b[1-9][0-9]{5}\b', text)


def extract_dates(doc):
    return [ent.text for ent in doc.ents if ent.label_ in ("DATE", "TIME")]


def extract_locations(doc):
    return list({ent.text for ent in doc.ents if ent.label_ in ("GPE", "LOC", "FAC", "ORG")})


def extract_persons(doc):
    return list({ent.text for ent in doc.ents if ent.label_ == "PERSON"})


def detect_category(text):
    text_lower = text.lower()
    scores = {}
    for category, keywords in COMPLAINT_CATEGORIES.items():
        scores[category] = sum(1 for kw in keywords if kw in text_lower)

    max_score = max(scores.values())
    if max_score == 0:
        return "general"

    best_categories = [cat for cat, score in scores.items() if score == max_score]
    return best_categories[0]


def detect_severity(text):
    text_lower = text.lower()
    for level in ("high", "medium", "low"):
        if any(kw in text_lower for kw in SEVERITY_KEYWORDS[level]):
            return level
    return "unknown"


def extract_complaint_fields(text: str) -> dict:
    doc = nlp(text)

    return {
        "locations":     extract_locations(doc),
        "persons":       extract_persons(doc),
        "dates_times":   extract_dates(doc),
        "phone_numbers": extract_phone_numbers(text),
        "pin_codes":     extract_pin_codes(text),
        "category":      detect_category(text),
        "severity":      detect_severity(text),
        "raw_entities":  [{"text": ent.text, "label": ent.label_} for ent in doc.ents],
    }

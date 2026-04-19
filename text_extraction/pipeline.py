import json
import os
import re
import time
import google.generativeai as genai

from ocr_extraction import extract_text_from_pdf
from newspaper_extraction import extract_text_from_image
from text_cleaning import process_text
from ner_extraction import extract_complaint_fields


def _get_gemini_model():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY environment variable is not set. "
            "Export it before running: export GEMINI_API_KEY=your_key"
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")


GEMINI_SYSTEM_PROMPT = """You are an expert Data Extraction Engine specialized in civic issues, public grievances, and news analysis. Your task is to process raw text (which may be a user complaint, a newspaper snippet, or a PDF excerpt) alongside provided Named Entity Recognition (NER) tokens.

You must analyze the text to understand the core grievance, its impact on the community, and the specific logistics involved.

Extract and structure the following information into a clean JSON object. If a field is not findable, return null.

- Core_Problem_Brief: A concise (1-2 sentence) summary of exactly what is wrong.
- Severity_Rating: Rate from 1-5. (1: Minor inconvenience. 5: Immediate danger to life/property or total infrastructure collapse.)
- Severity_Justification: A brief explanation of why you gave that rating.
- Location_Data: Extract the most specific location possible (Street, Landmark, Ward, or City).
- Primary_Tag: A single-word category (e.g., Sanitation, Road, Electricity, Water, Safety).
- Secondary_Tags: An array of related keywords (e.g., ["pothole", "monsoon", "traffic_hazard"]).
- Target_Authority: Who is responsible? (e.g., Municipal Corporation, Power Grid, Traffic Police).
- Sentiment_Analysis: The emotional tone of the text (e.g., Frustrated, Urgent, Informational, Desperate).
- Affected_Demographic: Who is most impacted? (e.g., Commuters, Elderly, Residents of X colony).
- Actionable_Summary: A "To-Do" for a field officer investigating this report.

json format:
{
  "problem_brief": "",
  "severity": {
    "score": 0,
    "reasoning": ""
  },
  "location": {
    "specific_area": "",
    "city": "",
    "context_markers": []
  },
  "classification": {
    "primary": "",
    "secondary": []
  },
  "meta": {
    "authority_responsible": "",
    "sentiment": "",
    "affected_group": ""
  },
  "field_instructions": ""
}

Return ONLY a valid JSON object with these fields. No markdown, no explanation, no code fences."""


def build_user_prompt(raw_text: str, ner_tokens: dict) -> str:
    return f"""RAW TEXT:
> {raw_text}

NER TOKENS:
> {json.dumps(ner_tokens, indent=2)}"""


def _parse_gemini_response(response_text: str) -> dict:
    text = response_text.strip()

   
    fence_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text, re.IGNORECASE)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON. Parse error: {e}\n"
            f"Raw response was:\n{response_text}"
        )


def call_gemini(raw_text: str, ner_tokens: dict, model=None, retries: int = 3, backoff: float = 2.0) -> dict:
    if model is None:
        model = _get_gemini_model()

    user_prompt = build_user_prompt(raw_text, ner_tokens)
    full_prompt = f"{GEMINI_SYSTEM_PROMPT}\n\n{user_prompt}"

    last_error = None
    for attempt in range(1, retries + 1):
        try:
            response = model.generate_content(full_prompt)
            return _parse_gemini_response(response.text)
        except Exception as e:
            last_error = e
            if attempt < retries:
                wait = backoff * attempt
                print(f"[Gemini] Attempt {attempt} failed: {e}. Retrying in {wait}s...")
                time.sleep(wait)

    raise RuntimeError(f"Gemini failed after {retries} attempts. Last error: {last_error}")


def run_pipeline(source: str, poppler_path: str = None) -> dict:

    if os.path.isfile(source):
        ext = os.path.splitext(source)[1].lower()
        if ext == ".pdf":
            print(f"[1/4] Running OCR on PDF: {source}")
            raw_text = extract_text_from_pdf(source, poppler_path=poppler_path)
        elif ext in (".png", ".jpg", ".jpeg", ".tiff", ".bmp"):
            print(f"[1/4] Running OCR on image: {source}")
            raw_text = extract_text_from_image(source)
        else:
            print(f"[1/4] Reading text file: {source}")
            with open(source, "r", encoding="utf-8") as f:
                raw_text = f.read()
    else:
        # Treat as raw text string directly
        print("[1/4] Using provided raw text string.")
        raw_text = source

    print("[2/4] Cleaning text...")
    cleaned_text = process_text(raw_text)

    print("[3/4] Extracting NER tokens...")
    ner_tokens = extract_complaint_fields(cleaned_text)

    print("[4/4] Calling Gemini API...")
    result = call_gemini(cleaned_text, ner_tokens)

    return result


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <pdf_or_image_or_text_file> [poppler_path]")
        print("       python pipeline.py \"raw complaint text here\"")
        sys.exit(1)

    source = sys.argv[1]
    poppler = sys.argv[2] if len(sys.argv) > 2 else None

    output = run_pipeline(source, poppler_path=poppler)
    print("\n--- Structured Output ---")
    print(json.dumps(output, indent=2))

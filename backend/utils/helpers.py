"""
utils/helpers.py — Utility and Helper Functions
"""

import re


def sanitize_input(text: str) -> str:
    """
    Clean and sanitize user input before sending to the RAG pipeline.
    Removes extra whitespace and enforces a maximum length.
    """
    if not text:
        return ""

    # Remove leading and trailing whitespace
    text = text.strip()

    # Collapse multiple spaces into one
    text = re.sub(r' +', ' ', text)

    # Collapse more than two newlines into two
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Enforce maximum length
    if len(text) > 1000:
        text = text[:1000] + "..."

    return text


def is_safe_query(text: str) -> tuple[bool, str]:
    """
    Basic safety check for incoming queries.
    Returns (is_safe, reason).
    If a crisis keyword is detected, returns (False, "crisis").
    """
    if not text or len(text.strip()) < 3:
        return False, "Query is too short."

    crisis_keywords = [
        "kill myself", "end my life", "suicide", "want to die",
        "hurt myself", "self harm", "overdose"
    ]

    text_lower = text.lower()
    for keyword in crisis_keywords:
        if keyword in text_lower:
            return False, "crisis"

    return True, "ok"


# Crisis response shown when a crisis keyword is detected
CRISIS_RESPONSE = """
I can hear that you're going through an incredibly difficult time.
Please reach out to someone who can help right now:

📞 Crisis Text Line: Text HOME to 741741
📞 988 Suicide & Crisis Lifeline: Call or text 988
📞 International resources: https://www.iasp.info/resources/Crisis_Centres/

You don't have to face this alone. Trained counselors are available 24/7, free of charge.
"""
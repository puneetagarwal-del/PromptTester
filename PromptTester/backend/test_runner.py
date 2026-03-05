import json
import re
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def run_prompt(prompt_template: str, test_input: str) -> str:
    """Run a prompt with OpenAI API"""
    try:
        full_prompt = prompt_template.replace("{input}", test_input)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=1000,
            messages=[{"role": "user", "content": full_prompt}]
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"


def calculate_similarity(expected: str, actual: str) -> dict:
    """Score similarity between expected and actual output using Claude-like approach"""
    try:
        prompt = f"""You are evaluating if two outputs are semantically similar.

Expected output:
{expected}

Actual output:
{actual}

Rate similarity on a scale of 0-1 where:
- 1.0 = Same meaning/intent
- 0.7 = Similar meaning, minor differences acceptable
- 0.5 = Somewhat related
- 0.0 = Completely different

Also explain briefly why (1-2 sentences).

Respond ONLY with JSON (no markdown):
{{
    "similarity_score": <0-1>,
    "reasoning": "<brief explanation>"
}}"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = response.choices[0].message.content.strip()
        
        try:
            result = json.loads(response_text)
            return {
                "similarity_score": float(result.get("similarity_score", 0.5)),
                "reasoning": result.get("reasoning", "")
            }
        except:
            # Fallback parsing
            score_match = re.search(r'"similarity_score":\s*([\d.]+)', response_text)
            score = float(score_match.group(1)) if score_match else 0.5
            return {
                "similarity_score": score,
                "reasoning": response_text[:100]
            }
    except Exception as e:
        return {
            "similarity_score": 0.5,
            "reasoning": f"Error: {str(e)}"
        }


def evaluate_test(expected: str, actual: str, threshold: float = 0.7) -> dict:
    """Evaluate if test passed"""
    similarity_data = calculate_similarity(expected, actual)
    
    passed = similarity_data["similarity_score"] >= threshold
    
    return {
        "passed": passed,
        "similarity_score": similarity_data["similarity_score"],
        "reasoning": similarity_data["reasoning"]
    }

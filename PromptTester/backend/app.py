from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database models and session
from database import init_db, get_db, SessionLocal, Prompt, TestCase, TestRun, TestResult

# Import test runner
from test_runner import run_prompt, evaluate_test

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# ===== HELPER FUNCTIONS =====

def get_db_session():
    """Get database session"""
    return SessionLocal()


def get_latest_run_for_prompt(db, prompt_id):
    """Get the most recent test run for a prompt"""
    run = db.query(TestRun).filter(TestRun.prompt_id == prompt_id).order_by(TestRun.created_at.desc()).first()
    return run


# ===== HEALTH CHECK =====

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200


# ===== PROMPT ENDPOINTS =====

@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    """Get all prompts"""
    try:
        db = get_db_session()
        prompts = db.query(Prompt).all()
        
        prompt_list = []
        for prompt in prompts:
            prompt_dict = prompt.to_dict()
            
            # Get latest test run
            latest_run = get_latest_run_for_prompt(db, prompt.id)
            if latest_run:
                prompt_dict["last_run"] = {
                    "pass_rate": latest_run.pass_rate,
                    "passed": latest_run.passed,
                    "failed": latest_run.failed,
                    "total": latest_run.total_tests,
                    "created_at": latest_run.created_at.isoformat()
                }
            else:
                prompt_dict["last_run"] = None
            
            prompt_list.append(prompt_dict)
        
        db.close()
        return jsonify({"prompts": prompt_list, "total": len(prompt_list)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/prompts', methods=['POST'])
def create_prompt():
    """Create a new prompt"""
    try:
        data = request.json
        name = data.get("name", "").strip()
        content = data.get("content", "").strip()
        
        if not name or not content:
            return jsonify({"error": "Name and content are required"}), 400
        
        if "{input}" not in content:
            return jsonify({"error": "Prompt must contain {input} placeholder"}), 400
        
        db = get_db_session()
        
        # Check if name already exists
        existing = db.query(Prompt).filter(Prompt.name == name).first()
        if existing:
            db.close()
            return jsonify({"error": "Prompt name already exists"}), 400
        
        # Create new prompt
        prompt = Prompt(name=name, content=content)
        db.add(prompt)
        db.commit()
        
        result = prompt.to_dict()
        db.close()
        
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/prompts/<int:prompt_id>', methods=['GET'])
def get_prompt(prompt_id):
    """Get a specific prompt with all its test results"""
    try:
        db = get_db_session()
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        
        if not prompt:
            db.close()
            return jsonify({"error": "Prompt not found"}), 404
        
        prompt_dict = prompt.to_dict()
        
        # Get all test runs for this prompt
        runs = db.query(TestRun).filter(TestRun.prompt_id == prompt_id).order_by(TestRun.created_at.desc()).all()
        
        runs_list = []
        for run in runs:
            run_dict = run.to_dict()
            
            # Get results for this run
            results = db.query(TestResult).filter(TestResult.test_run_id == run.id).all()
            run_dict["results"] = [result.to_dict() for result in results]
            
            runs_list.append(run_dict)
        
        prompt_dict["test_runs"] = runs_list
        
        db.close()
        return jsonify(prompt_dict), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Delete a prompt"""
    try:
        db = get_db_session()
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        
        if not prompt:
            db.close()
            return jsonify({"error": "Prompt not found"}), 404
        
        # Delete all test runs and results for this prompt
        runs = db.query(TestRun).filter(TestRun.prompt_id == prompt_id).all()
        for run in runs:
            db.query(TestResult).filter(TestResult.test_run_id == run.id).delete()
            db.delete(run)
        
        db.delete(prompt)
        db.commit()
        db.close()
        
        return jsonify({"message": "Prompt deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== TEST CASE ENDPOINTS =====

@app.route('/api/test-cases', methods=['GET'])
def get_test_cases():
    """Get all test cases"""
    try:
        db = get_db_session()
        test_cases = db.query(TestCase).all()
        
        test_case_list = [tc.to_dict() for tc in test_cases]
        
        db.close()
        return jsonify({"test_cases": test_case_list, "total": len(test_case_list)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/test-cases', methods=['POST'])
def create_test_case():
    """Create a new test case"""
    try:
        data = request.json
        test_id = data.get("test_id", "").strip()
        input_text = data.get("input", "").strip()
        expected_output = data.get("expected_output", "").strip()
        
        if not test_id or not input_text or not expected_output:
            return jsonify({"error": "test_id, input, and expected_output are required"}), 400
        
        db = get_db_session()
        
        # Check if test_id already exists
        existing = db.query(TestCase).filter(TestCase.test_id == test_id).first()
        if existing:
            db.close()
            return jsonify({"error": "Test case ID already exists"}), 400
        
        # Create new test case
        test_case = TestCase(test_id=test_id, input_text=input_text, expected_output=expected_output)
        db.add(test_case)
        db.commit()
        
        result = test_case.to_dict()
        db.close()
        
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/test-cases/<int:test_case_id>', methods=['DELETE'])
def delete_test_case(test_case_id):
    """Delete a test case"""
    try:
        db = get_db_session()
        test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
        
        if not test_case:
            db.close()
            return jsonify({"error": "Test case not found"}), 404
        
        db.delete(test_case)
        db.commit()
        db.close()
        
        return jsonify({"message": "Test case deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== TEST EXECUTION ENDPOINT =====

@app.route('/api/test-runs', methods=['POST'])
def run_tests():
    """Run tests for a prompt"""
    try:
        data = request.json
        prompt_id = data.get("prompt_id")
        
        if not prompt_id:
            return jsonify({"error": "prompt_id is required"}), 400
        
        db = get_db_session()
        
        # Get prompt
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            db.close()
            return jsonify({"error": "Prompt not found"}), 404
        
        # Get all test cases
        test_cases = db.query(TestCase).all()
        if not test_cases:
            db.close()
            return jsonify({"error": "No test cases found"}), 400
        
        # Run tests
        passed_count = 0
        failed_count = 0
        results = []
        
        for test_case in test_cases:
            print(f"Running test: {test_case.test_id}")
            
            # Run the prompt with the test input
            actual_output = run_prompt(prompt.content, test_case.input_text)
            
            # Evaluate the result
            evaluation = evaluate_test(test_case.expected_output, actual_output)
            
            if evaluation["passed"]:
                passed_count += 1
            else:
                failed_count += 1
            
            results.append({
                "test_id": test_case.test_id,
                "passed": evaluation["passed"],
                "similarity_score": evaluation["similarity_score"],
                "reasoning": evaluation["reasoning"],
                "expected": test_case.expected_output,
                "actual": actual_output
            })
        
        # Calculate pass rate
        total_tests = len(test_cases)
        pass_rate = (passed_count / total_tests) if total_tests > 0 else 0
        
        # Store test run
        test_run = TestRun(
            prompt_id=prompt_id,
            total_tests=total_tests,
            passed=passed_count,
            failed=failed_count,
            pass_rate=pass_rate
        )
        db.add(test_run)
        db.commit()
        
        # Store individual results
        for i, result in enumerate(results):
            test_result = TestResult(
                test_run_id=test_run.id,
                test_case_id=result["test_id"],
                passed=result["passed"],
                similarity_score=result["similarity_score"],
                actual_output=result["actual"],
                reasoning=result["reasoning"]
            )
            db.add(test_result)
        
        db.commit()
        db.close()
        
        return jsonify({
            "test_run_id": test_run.id,
            "prompt_id": prompt_id,
            "total_tests": total_tests,
            "passed": passed_count,
            "failed": failed_count,
            "pass_rate": pass_rate,
            "results": results
        }), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

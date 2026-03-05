import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

# Database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://puneetagarwal:postgrespuneet@localhost:5432/prompt_tester"
)

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Models
class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(Integer, primary_key=True)
    test_id = Column(String(255), unique=True, nullable=False)
    input_text = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "test_id": self.test_id,
            "input": self.input_text,
            "expected_output": self.expected_output,
            "created_at": self.created_at.isoformat()
        }


class TestRun(Base):
    __tablename__ = "test_runs"
    
    id = Column(Integer, primary_key=True)
    prompt_id = Column(Integer, nullable=False)
    total_tests = Column(Integer, nullable=False)
    passed = Column(Integer, nullable=False)
    failed = Column(Integer, nullable=False)
    pass_rate = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "prompt_id": self.prompt_id,
            "total_tests": self.total_tests,
            "passed": self.passed,
            "failed": self.failed,
            "pass_rate": self.pass_rate,
            "created_at": self.created_at.isoformat()
        }


class TestResult(Base):
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True)
    test_run_id = Column(Integer, nullable=False)
    test_case_id = Column(String(255), nullable=False)
    passed = Column(Boolean, nullable=False)
    similarity_score = Column(Float, nullable=False)
    actual_output = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "test_run_id": self.test_run_id,
            "test_case_id": self.test_case_id,
            "passed": self.passed,
            "similarity_score": self.similarity_score,
            "actual_output": self.actual_output,
            "reasoning": self.reasoning,
            "created_at": self.created_at.isoformat()
        }


# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

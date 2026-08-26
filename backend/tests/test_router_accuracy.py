"""
Model Router Accuracy Benchmark Suite (24 Test Cases with Paraphrased Out-of-Sample Queries)
===========================================================================================
Evaluates the SovereignAI Router against a labeled test dataset of 24 diverse industrial prompts
spanning all 4 core problem statement modalities:
1. Multimodal Document / P&ID / Inspection Analysis (qwen2.5-vl:7b)
2. Code Synthesis & Telemetry Sandboxing (qwen2.5-coder:7b)
3. Deep Reasoning & Engineering Rationale (deepseek-r1:7b)
4. Fast SOP Search & Knowledge Retrieval (llama3.2:3b)
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.router import model_router

TEST_DATASET = [
    # Category 1: Vision / Multimodal Document (Expected: qwen2.5-vl:7b)
    {"prompt": "Analyze the attached scanned ultrasonic thickness report for Heat Exchanger HX-401.", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},
    {"prompt": "Inspect the CDU-1 P&ID schematic and extract all relief valve and bypass line tags.", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},
    {"prompt": "Transcribe handwritten shift handover inspection notes from turnaround logsheet.", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},
    {"prompt": "Assess surface corrosion pitting photo on crude column pass 2 tray according to API 571.", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},
    {"prompt": "OCR scan of pump foundation crack inspection photograph with dimensional scale.", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},
    {"prompt": "Can you visually inspect this drawing and tell me what valves are connected to line 12-CDU?", "has_file": True, "expected": "qwen2.5-vl:7b", "cat": "VISION_DOC"},

    # Category 2: Coding & Sandbox Telemetry (Expected: qwen2.5-coder:7b)
    {"prompt": "Write a Python script to process vibration telemetry CSV and detect ISO 10816-3 Zone C breaches.", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},
    {"prompt": "Develop an automated pandas pipeline to compute crude preheat train heat transfer coefficients (U-values).", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},
    {"prompt": "Synthesize Python function to calculate remaining useful life (RUL) using exponential degradation models.", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},
    {"prompt": "Write sandbox script to parse Modbus TCP telemetry logs and output anomaly time ranges.", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},
    {"prompt": "Generate openpyxl automation code to format refinery equipment health index sheets.", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},
    {"prompt": "Build a dataframe calculation in the sandbox to find mean and peak pump vibrations.", "has_file": False, "expected": "qwen2.5-coder:7b", "cat": "CODE_EXEC"},

    # Category 3: Deep Reasoning & Complex Engineering Analysis (Expected: deepseek-r1:7b)
    {"prompt": "Provide step-by-step root cause failure analysis (RCFA) for catastrophic crude distillation tray collapse.", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},
    {"prompt": "Derive thermodynamic flash calculation proofs for multi-component hydrocarbon equilibrium under vacuum.", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},
    {"prompt": "Synthesize multi-variable trade-off analysis between turnaround postponement risk vs retubing CAPEX.", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},
    {"prompt": "Conduct formal HazOp hazard identification reasoning on high-pressure hydrocracker feed preheat circuit.", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},
    {"prompt": "Formulate first-principles mathematical derivation of shell-side pressure drop in segmental baffled exchangers.", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},
    {"prompt": "Why did the column tray collapse and what is the engineering justification note for immediate shutdown?", "has_file": False, "expected": "deepseek-r1:7b", "cat": "REASONING"},

    # Category 4: Fast SOP / Search / Summary (Expected: llama3.2:3b)
    {"prompt": "Lookup MRPL safety SOP-08 section 4.2 minimum shell wall thickness standard.", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
    {"prompt": "Quick summary of refinery shift handover protocol SOP-14.", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
    {"prompt": "Search knowledge base for emergency evacuation muster points in CDU unit.", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
    {"prompt": "Retrieve statutory testing frequency table for ASME Section VIII pressure vessels.", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
    {"prompt": "Summarize definition of Category-A safety isolation from OISD-STD-118.", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
    {"prompt": "What is the permissible limit and safety guideline for pressure relief valve testing?", "has_file": False, "expected": "llama3.2:3b", "cat": "SOP_SEARCH"},
]


def run_benchmark():
    correct = 0
    total = len(TEST_DATASET)
    cat_stats = {}

    print("\n" + "=" * 80)
    print(f" SOVEREIGN-AI MODEL ROUTER ACCURACY BENCHMARK ({total} TEST CASES)")
    print("=" * 80)
    print(f"{'#':<3} | {'Category':<11} | {'Expected Model':<17} | {'Predicted Model':<17} | {'Result'}")
    print("-" * 80)

    for idx, item in enumerate(TEST_DATASET, 1):
        decision = model_router.route_task(item["prompt"], filename="sample.pdf" if item["has_file"] else None)
        pred = decision["selected_model"]
        is_match = pred == item["expected"]
        if is_match:
            correct += 1
            res_str = "[PASS]"
        else:
            res_str = f"[FAIL] ({decision['reasoning'][:30]}...)"

        cat = item["cat"]
        if cat not in cat_stats:
            cat_stats[cat] = {"correct": 0, "total": 0}
        cat_stats[cat]["total"] += 1
        if is_match:
            cat_stats[cat]["correct"] += 1

        print(f"{idx:<3} | {cat:<11} | {item['expected']:<17} | {pred:<17} | {res_str}")

    accuracy_pct = (correct / total) * 100.0

    print("-" * 80)
    print(f" OVERALL ROUTER ACCURACY: {correct}/{total} ({accuracy_pct:.1f}%)")
    print("=" * 80)
    print("\nCategory Breakdown:")
    for cat, stats in cat_stats.items():
        cat_acc = (stats["correct"] / stats["total"]) * 100.0
        print(f"  • {cat:<12}: {stats['correct']}/{stats['total']} ({cat_acc:.1f}%)")
    print("=" * 80 + "\n")
    return accuracy_pct


if __name__ == "__main__":
    acc = run_benchmark()
    sys.exit(0 if acc >= 90.0 else 1)

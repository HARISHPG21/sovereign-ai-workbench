import re
from typing import Dict, Any, Optional
from app.config import settings

class ModelRouter:
    """
    Intelligent Open-Weight Model Router.
    Analyzes prompt intent, natural language phrasing, file extensions, and computational requirements,
    dynamically selecting the optimal on-premise model.
    """
    @staticmethod
    def route_task(
        prompt: str,
        filename: Optional[str] = None,
        mime_type: Optional[str] = None
    ) -> Dict[str, Any]:
        p_lower = prompt.lower().strip()
        file_lower = (filename or "").lower()
        has_file = bool(filename)

        # ── 1. File Extension Hard Signals ─────────────────────────────────────
        if has_file and file_lower.endswith((".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".p&id", ".dwg", ".webp")):
            return {
                "task_type": "MULTIMODAL_DOC",
                "selected_model": settings.DEFAULT_VISION_MODEL,
                "model_capability": "VISION",
                "reasoning": f"Task involves visual/drawing artifact ({filename}). Auto-routed to on-premise Vision-Language Model ({settings.DEFAULT_VISION_MODEL}).",
                "estimated_vram_gb": 5.8
            }
        elif has_file and file_lower.endswith((".py", ".csv", ".xlsx", ".json", ".sql", ".sh", ".parquet")):
            return {
                "task_type": "CODE_EXEC",
                "selected_model": settings.DEFAULT_CODE_MODEL,
                "model_capability": "CODE",
                "reasoning": f"Task involves code/tabular data attachment ({filename}). Auto-routed to specialized coding model ({settings.DEFAULT_CODE_MODEL}).",
                "estimated_vram_gb": 5.2
            }

        # ── 2. Weighted Intent Scoring for Natural Language Phrasings ─────────
        scores = {
            "VISION_DOC": 0.0,
            "CODE_EXEC": 0.0,
            "REASONING": 0.0,
            "SOP_SEARCH": 0.0
        }

        # Vision / Drawing / Document Patterns
        vision_patterns = [
            r"\b(scanned|scan|ocr|transcribe|handwritten|handwriting|drawing|schematic|p&id|pid|blueprint|dwg)\b",
            r"\b(photo|photograph|picture|image|visual inspection|corrosion pitting|crack inspection|microscopy)\b",
            r"\b(inspection report|ultrasonic thickness|wall thickness mapping|dye penetrant)\b"
        ]
        for pat in vision_patterns:
            if re.search(pat, p_lower):
                scores["VISION_DOC"] += 2.5

        # Code / Data Analysis / Script Patterns
        code_patterns = [
            r"\b(python|script|pandas|numpy|openpyxl|dataframe|modbus|scada|telemetry|sensor data|csv|xlsx)\b",
            r"\b(write (?:a )?(?:python )?code|develop (?:a )?script|write (?:a )?function|automation script)\b",
            r"\b(sandbox|execute code|run script|program|calculate remaining useful life|u-value|u-values|rul)\b",
            r"\b(algorithm|compute .* vibration|process .* telemetry)\b"
        ]
        for pat in code_patterns:
            if re.search(pat, p_lower):
                scores["CODE_EXEC"] += 2.5

        # Deep Reasoning / First-Principles / Safety Compliance Patterns
        reasoning_patterns = [
            r"\b(root cause|rcfa|failure analysis|why did|investigate failure|tray collapse|hazard identification)\b",
            r"\b(hazop|thermodynamic|derivation|first-principles|equilibrium|mathematical derivation|proofs?)\b",
            r"\b(approval note|board memo|board deck|executive memo|trade-off analysis|capex vs opex|risk matrix)\b",
            r"\b(turnaround postponement|justification note|remaining life assessment)\b"
        ]
        for pat in reasoning_patterns:
            if re.search(pat, p_lower):
                scores["REASONING"] += 2.5

        # Fast SOP Lookup / Query Summarization Patterns
        sop_patterns = [
            r"\b(lookup|search knowledge|find document|search sop|query sop|what is the rule|guidelines?)\b",
            r"\b(quick summary|summarize|tell me about|definition of|muster point|evacuation|frequency table)\b",
            r"\b(safety standard|sop-\d+|oisd-\w+|asme section|statutory testing|permissible limit)\b"
        ]
        for pat in sop_patterns:
            if re.search(pat, p_lower):
                scores["SOP_SEARCH"] += 2.0

        # Disambiguation & Preference
        # If prompt has both reasoning and simple search, complex reasoning takes precedence
        if scores["REASONING"] > 0 and scores["SOP_SEARCH"] > 0 and scores["REASONING"] >= scores["SOP_SEARCH"]:
            scores["SOP_SEARCH"] = 0.0

        # Determine winning category
        best_category = max(scores, key=scores.get)
        max_score = scores[best_category]

        if max_score > 0:
            if best_category == "VISION_DOC":
                return {
                    "task_type": "MULTIMODAL_DOC",
                    "selected_model": settings.DEFAULT_VISION_MODEL,
                    "model_capability": "VISION",
                    "reasoning": f"Task references visual, drawing, or scanned artifact. Auto-routed to Vision-Language Model ({settings.DEFAULT_VISION_MODEL}).",
                    "estimated_vram_gb": 5.8
                }
            elif best_category == "CODE_EXEC":
                return {
                    "task_type": "CODE_EXEC",
                    "selected_model": settings.DEFAULT_CODE_MODEL,
                    "model_capability": "CODE",
                    "reasoning": f"Task requests algorithmic data processing or sandbox code execution. Auto-routed to coding model ({settings.DEFAULT_CODE_MODEL}).",
                    "estimated_vram_gb": 5.2
                }
            elif best_category == "REASONING":
                return {
                    "task_type": "REPORT_GEN",
                    "selected_model": settings.DEFAULT_REASONING_MODEL,
                    "model_capability": "REASONING",
                    "reasoning": f"Task requires multi-step engineering logic, physical derivations, or formal approval synthesis. Auto-routed to reasoning model ({settings.DEFAULT_REASONING_MODEL}).",
                    "estimated_vram_gb": 5.6
                }
            else:  # SOP_SEARCH
                return {
                    "task_type": "GENERAL",
                    "selected_model": settings.DEFAULT_FAST_MODEL,
                    "model_capability": "GENERAL",
                    "reasoning": f"Fast SOP / knowledge retrieval & summary query. Auto-routed to lightweight on-premise model ({settings.DEFAULT_FAST_MODEL}).",
                    "estimated_vram_gb": 2.8
                }

        # Fallback default
        return {
            "task_type": "GENERAL",
            "selected_model": settings.DEFAULT_FAST_MODEL,
            "model_capability": "GENERAL",
            "reasoning": f"General engineering inquiry / SOP lookup query. Auto-routed to lightweight on-premise model ({settings.DEFAULT_FAST_MODEL}).",
            "estimated_vram_gb": 2.8
        }

model_router = ModelRouter()

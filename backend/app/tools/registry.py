from typing import Dict, Any, List, Callable
from app.tools.ocr_tool import ocr_tool
from app.tools.file_tool import file_tool
from app.sandbox.local_process_box import sandbox_engine
from app.generators.docx_gen import docx_generator
from app.generators.pptx_gen import pptx_generator
from app.generators.xlsx_gen import xlsx_generator


class ToolRegistry:
    """
    Central Enterprise Tool Registry.
    Registers and executes air-gapped deterministic tools for Sovereign AI Agents.

    Tools implement the PS SIH26117 requirements:
      - file_reader_tool        : read local files (Gap 1.5 fix)
      - file_writer_tool        : write/append local workspace files (Gap 1.5 fix)
      - file_csv_editor         : edit CSV cells in-place (Gap 1.5 fix)
      - ocr_document_extractor  : local OCR / PDF parsing
      - python_sandbox_runner   : isolated code execution
      - docx_approval_generator : .docx generation
      - pptx_presentation_generator : .pptx generation
      - xlsx_spreadsheet_generator  : .xlsx generation
      - local_knowledge_retriever   : RAG SOP search
    """

    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {
            # ── File I/O (Gap 1.5 — previously missing) ──────────────────────
            "file_reader_tool": {
                "name": "file_reader_tool",
                "description": "Reads any text, CSV, or JSON file from the on-premise workspace directory. Supports reading uploaded spreadsheets and reports in-place.",
                "parameters": {"filename": "string"},
                "category": "FILE_IO",
            },
            "file_writer_tool": {
                "name": "file_writer_tool",
                "description": "Writes or appends text content to a file in the secure on-premise workspace. Scoped strictly to the sandboxed workspace directory.",
                "parameters": {"filename": "string", "content": "string", "mode": "overwrite|append"},
                "category": "FILE_IO",
            },
            "file_csv_editor": {
                "name": "file_csv_editor",
                "description": "Edits a specific cell in an existing CSV file. Allows agents to update spreadsheet data in-place rather than only generating new files.",
                "parameters": {"filename": "string", "row_index": "integer", "column": "string", "new_value": "string"},
                "category": "FILE_IO",
            },
            "file_excel_editor": {
                "name": "file_excel_editor",
                "description": "Edits a specific cell coordinate (e.g. 'C5') in an existing Excel (.xlsx) workbook in-place.",
                "parameters": {"filename": "string", "cell_coordinate": "string", "new_value": "string", "sheet_name": "string (optional)"},
                "category": "FILE_IO",
            },
            "workspace_list_files": {
                "name": "workspace_list_files",
                "description": "Lists all files currently in the agent sandbox workspace directory.",
                "parameters": {},
                "category": "FILE_IO",
            },

            # ── Document & Vision ─────────────────────────────────────────────
            "ocr_document_extractor": {
                "name": "ocr_document_extractor",
                "description": "Extracts text and tables from local scanned PDFs, drawings, and images using on-premise OCR. For handwritten content and P&ID images, the vision-language model (Qwen2.5-VL) is the primary path; Tesseract/pypdf handles clean printed text.",
                "parameters": {"file_path": "string"},
                "category": "DOCUMENT",
            },

            # ── Code Execution ────────────────────────────────────────────────
            "python_sandbox_runner": {
                "name": "python_sandbox_runner",
                "description": "Executes Python code in an isolated air-gapped sandbox without host network access. CPU-limited, memory-capped, timeout-enforced.",
                "parameters": {"code": "string"},
                "category": "EXECUTION",
            },

            # ── Generators ────────────────────────────────────────────────────
            "docx_approval_generator": {
                "name": "docx_approval_generator",
                "description": "Generates formal styled MRPL / PSU Word Approval Notes (.docx) with executive stamps and 'AI-Drafted, Human-Reviewed' watermark footer.",
                "parameters": {"data": "object", "output_filename": "string (optional)"},
                "category": "GENERATOR",
            },
            "pptx_presentation_generator": {
                "name": "pptx_presentation_generator",
                "description": "Generates executive briefing slide presentations (.pptx).",
                "parameters": {"data": "object", "output_filename": "string (optional)"},
                "category": "GENERATOR",
            },
            "xlsx_spreadsheet_generator": {
                "name": "xlsx_spreadsheet_generator",
                "description": "Generates structured Excel calculation sheets (.xlsx) with formulas and alarm highlights.",
                "parameters": {"data": "object", "output_filename": "string (optional)"},
                "category": "GENERATOR",
            },

            # ── Knowledge ─────────────────────────────────────────────────────
            "local_knowledge_retriever": {
                "name": "local_knowledge_retriever",
                "description": "Performs local semantic hybrid (BM25 + vector) search against refinery SOPs and safety manuals. Zero external API calls.",
                "parameters": {"query": "string", "collection": "string"},
                "category": "RAG",
            },
        }

    def list_tools(self) -> List[Dict[str, Any]]:
        return list(self._tools.values())

    async def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        # ── File I/O tools ────────────────────────────────────────────────────
        if tool_name == "file_reader_tool":
            return file_tool.read_file(arguments.get("filename", ""))

        elif tool_name == "file_writer_tool":
            return file_tool.write_file(
                filename=arguments.get("filename", "output.txt"),
                content=arguments.get("content", ""),
                mode=arguments.get("mode", "overwrite"),
            )

        elif tool_name == "file_csv_editor":
            return file_tool.edit_csv_cell(
                filename=arguments.get("filename", ""),
                row_index=int(arguments.get("row_index", 0)),
                column=arguments.get("column", ""),
                new_value=arguments.get("new_value", ""),
            )

        elif tool_name == "file_excel_editor":
            return file_tool.edit_excel_cell(
                filename=arguments.get("filename", ""),
                cell_coordinate=arguments.get("cell_coordinate", "A1"),
                new_value=str(arguments.get("new_value", "")),
                sheet_name=arguments.get("sheet_name"),
            )

        elif tool_name == "workspace_list_files":
            return file_tool.list_workspace_files()

        # ── Document & Vision ─────────────────────────────────────────────────
        elif tool_name == "ocr_document_extractor":
            return await ocr_tool.extract_document_content(arguments.get("file_path", ""))

        # ── Code Execution ────────────────────────────────────────────────────
        elif tool_name == "python_sandbox_runner":
            return await sandbox_engine.execute_python_code(arguments.get("code", ""))

        # ── Generators ────────────────────────────────────────────────────────
        elif tool_name == "docx_approval_generator":
            return docx_generator.create_approval_note(
                arguments.get("data", {}),
                arguments.get("output_filename"),
            )

        elif tool_name == "pptx_presentation_generator":
            return pptx_generator.create_executive_deck(
                arguments.get("data", {}),
                arguments.get("output_filename"),
            )

        elif tool_name == "xlsx_spreadsheet_generator":
            return xlsx_generator.create_equipment_analysis_sheet(
                arguments.get("data", {}),
                arguments.get("output_filename"),
            )

        else:
            return {"error": f"Tool '{tool_name}' not recognized in local sovereign registry."}


tool_registry = ToolRegistry()

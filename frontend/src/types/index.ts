export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "ENGINEER" | "MANAGER" | "ANALYST" | "DEVELOPER";
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface AgentStep {
  id: string;
  step_order: number;
  agent_name: string;
  model_used?: string;
  tool_called?: string;
  tool_input?: any;
  tool_output?: any;
  thought_trace?: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "RETRY";
  created_at: string;
}

export interface GeneratedFile {
  id: string;
  filename: string;
  file_type: "DOCX" | "PPTX" | "XLSX" | "PDF" | "CODE";
  file_size_bytes: number;
  storage_path: string;
  integrity_sha256?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  task_type: string;
  status: "PENDING" | "PLANNING" | "RUNNING" | "COMPLETED" | "FAILED";
  assigned_model?: string;
  attached_filename?: string;
  result_summary?: string;
  execution_time_seconds: number;
  created_at: string;
  completed_at?: string;
  steps: AgentStep[];
  generated_files: GeneratedFile[];
}

export interface ModelRegistryItem {
  id: string;
  name: string;
  provider: string;
  capability: string;
  context_length: number;
  quantization: string;
  vram_required_gb: number;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  last_health_check: string;
}

export interface NetworkTelemetry {
  air_gap_status: string;
  external_api_calls: number;
  external_egress_bytes: number;
  local_ai_inference_pct: number;
  blocked_outbound_attempts: number;
  total_local_requests: number;
  uptime_seconds: number;
  active_local_sockets: number;
  connections: Array<{
    type: string;
    local_address: string;
    remote_address: string;
    status: string;
    is_local_only: boolean;
  }>;
  verified_sovereign: boolean;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  task_id?: string;
  event_type: string;
  actor_email?: string;
  actor_role?: string;
  action_details: string;
  external_calls_detected: number;
  ip_address: string;
  timestamp: string;
}

export interface KnowledgeDocument {
  id: string;
  collection_id?: string;
  filename: string;
  title: string;
  file_type: string;
  file_size_bytes: number;
  total_pages: number;
  uploaded_at: string;
  category?: string;
  chunk_count?: number;
}

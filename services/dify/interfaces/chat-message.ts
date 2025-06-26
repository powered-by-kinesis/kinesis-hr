/**
 * Represents a file parameter for the chat message request.
 */
export interface DifyChatFileParameter {
  type: 'document' | 'image' | 'audio' | 'video' | 'custom';
  transfer_method: 'remote_url' | 'local_file';
  url?: string; // Required if transfer_method is 'remote_url'
  upload_file_id?: string; // Required if transfer_method is 'local_file'
}

/**
 * Request body for sending a chat message to Dify.
 */
export interface DifyChatMessageRequest {
  query: string;
  inputs?: Record<string, any>; // Default {}
  response_mode: 'streaming' | 'blocking';
  user: string;
  conversation_id?: string;
  files?: DifyChatFileParameter[];
  auto_generate_name?: boolean; // Default true
}

/**
 * Represents model usage information.
 */
export interface DifyUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens: number;
  total_price?: number | string; // 'decimal' in docs
  currency?: string;
}

/**
 * Represents a retriever resource (citation/attribution).
 */
export interface DifyRetrieverResource {
  position?: number;
  dataset_id?: string;
  dataset_name?: string;
  document_id: string;
  document_name?: string;
  segment_id?: string;
  content: string;
  score?: number;
  url?: string;
}

/**
 * Response object for a blocking chat message request.
 */
export interface DifyChatCompletionResponse {
  event: 'message'; // Fixed value
  task_id: string;
  id: string; // Unique ID for the response itself
  message_id: string; // Unique message ID
  conversation_id: string;
  mode: 'chat'; // Fixed value
  answer: string;
  metadata: Record<string, any>;
  usage: DifyUsage;
  retriever_resources?: DifyRetrieverResource[];
  created_at: number; // Timestamp
}

// Streaming Chunk Response Types

interface DifyStreamEventBase {
  event: string;
  task_id: string;
  conversation_id?: string; // Not present in all events like workflow_started
  message_id?: string; // Not present in all events
  created_at?: number; // Not present in all events
}

export interface DifyMessageStreamEvent extends DifyStreamEventBase {
  event: 'message';
  message_id: string;
  conversation_id: string;
  answer: string;
  created_at: number;
}

export interface DifyMessageFileStreamEvent extends DifyStreamEventBase {
  event: 'message_file';
  id: string; // File unique ID
  type: 'image'; // Currently only 'image'
  belongs_to: 'assistant'; // Fixed value
  url: string;
  conversation_id: string;
  // task_id and created_at are not explicitly mentioned for this event in the doc, but usually present
}

export interface DifyMessageEndStreamEvent extends DifyStreamEventBase {
  event: 'message_end';
  message_id: string;
  conversation_id: string;
  metadata: Record<string, any>;
  usage: DifyUsage;
  retriever_resources?: DifyRetrieverResource[];
  // created_at is not explicitly mentioned for this event in the doc
}

export interface DifyTtsMessageStreamEvent extends DifyStreamEventBase {
  event: 'tts_message';
  message_id: string;
  audio: string; // base64 encoded
  created_at: number;
}

export interface DifyTtsMessageEndStreamEvent extends DifyStreamEventBase {
  event: 'tts_message_end';
  message_id: string;
  audio: string; // empty string
  created_at: number;
}

export interface DifyMessageReplaceStreamEvent extends DifyStreamEventBase {
  event: 'message_replace';
  message_id: string;
  conversation_id: string;
  answer: string;
  created_at: number;
}

interface WorkflowDataBase {
  id: string; // Unique ID of workflow execution (or node execution for node events)
  created_at: number; // Timestamp
}

interface WorkflowStartedData extends WorkflowDataBase {
  workflow_id: string;
  sequence_number: number;
}

export interface DifyWorkflowStartedStreamEvent extends DifyStreamEventBase {
  event: 'workflow_started';
  workflow_run_id: string;
  data: WorkflowStartedData;
  // created_at is part of data object
}

interface NodeEventData extends WorkflowDataBase {
  node_id: string;
  node_type: string;
  title: string;
  index: number;
  predecessor_node_id?: string;
  inputs?: Record<string, any>;
}

export interface DifyNodeStartedStreamEvent extends DifyStreamEventBase {
  event: 'node_started';
  workflow_run_id: string;
  data: NodeEventData;
  // created_at is part of data object
}

interface NodeFinishedData extends NodeEventData {
  process_data?: any; // JSON
  outputs?: any; // JSON
  status: 'running' | 'succeeded' | 'failed' | 'stopped';
  error?: string;
  elapsed_time?: number; // float
  execution_metadata?: any; // JSON
  total_tokens?: number;
  total_price?: number | string; // decimal
  currency?: string;
}

export interface DifyNodeFinishedStreamEvent extends DifyStreamEventBase {
  event: 'node_finished';
  workflow_run_id: string;
  data: NodeFinishedData;
  // created_at is part of data object
}

interface WorkflowFinishedData extends WorkflowDataBase {
  workflow_id: string;
  status: 'running' | 'succeeded' | 'failed' | 'stopped';
  outputs?: any; // JSON
  error?: string;
  elapsed_time?: number; // float
  total_tokens?: number;
  total_steps: number; // default 0
  finished_at: number; // Timestamp
}

export interface DifyWorkflowFinishedStreamEvent extends DifyStreamEventBase {
  event: 'workflow_finished';
  workflow_run_id: string;
  data: WorkflowFinishedData;
  // created_at is part of data object
}

export interface DifyErrorStreamEvent extends DifyStreamEventBase {
  event: 'error';
  // task_id and message_id are mentioned in the doc
  message_id: string;
  status: number; // HTTP status code
  code: string; // Error code
  message: string; // Error message
  // created_at is not explicitly mentioned for this event in the doc
}

export interface DifyPingStreamEvent {
  event: 'ping';
  // No other fields mentioned for ping event
}

/**
 * Union type for all possible streaming chunk events from Dify.
 * The actual stream will be text/event-stream, with each event being a JSON string.
 * e.g., data: {"event": "message", ...}\n\n
 */
export type DifyChunkChatCompletionResponse =
  | DifyMessageStreamEvent
  | DifyMessageFileStreamEvent
  | DifyMessageEndStreamEvent
  | DifyTtsMessageStreamEvent
  | DifyTtsMessageEndStreamEvent
  | DifyMessageReplaceStreamEvent
  | DifyWorkflowStartedStreamEvent
  | DifyNodeStartedStreamEvent
  | DifyNodeFinishedStreamEvent
  | DifyWorkflowFinishedStreamEvent
  | DifyErrorStreamEvent
  | DifyPingStreamEvent;

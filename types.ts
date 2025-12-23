
export interface Keyword {
  Key: string;
  Value: string;
}

export interface RagRequest {
  question: string;
  top_k: number;
  keywords: Keyword[];
}

export interface Source {
  file: string;
  page: number | null;
  section: string | null;
  similarity: number;
  original_indices: number[];
  content?: string; // Optional: used internally for LLM context
}

export interface RagResponse {
  question: string;
  answer: string;
  sources: Source[];
  retrieval_count: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface Document {
  id: string;
  url: string;
  title: string;
  content: string;
  partner: string;
  country: string;
  city: string;
}

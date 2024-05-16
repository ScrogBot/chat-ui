import { Tables } from "@/supabase/types"

export interface ChatMessage {
  message: Tables<"messages">
  id?: string; // Optional if not always needed
  role: string;
  content: string;
  timestamp: number;
}

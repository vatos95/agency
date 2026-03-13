export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string;
          description: string;
          designer_id: string;
          id: string;
          mentor_id: string | null;
          mission_id: string | null;
          title: string;
        };
      };
      clients: {
        Row: {
          created_at: string;
          designer_id: string;
          expectation_level: string;
          expectations: string[];
          id: string;
          mentor_id: string;
          name: string;
          sector: string;
          summary: string;
          tone: string;
          updated_at: string;
        };
      };
      deliveries: {
        Row: {
          created_at: string;
          designer_id: string;
          email_body: string;
          email_subject: string;
          figma_link: string;
          id: string;
          mentor_id: string;
          mission_id: string;
          status: Database["public"]["Enums"]["delivery_status"];
        };
        Insert: {
          created_at?: string;
          designer_id: string;
          email_body: string;
          email_subject: string;
          figma_link: string;
          id?: string;
          mentor_id: string;
          mission_id: string;
          status?: Database["public"]["Enums"]["delivery_status"];
        };
      };
      messages: {
        Row: {
          body: string;
          budget_cents: number;
          client_id: string | null;
          created_at: string;
          deadline_at: string | null;
          deliverables: string[];
          designer_id: string;
          id: string;
          mentor_id: string;
          mission_id: string | null;
          preview: string;
          sender_name: string;
          status: Database["public"]["Enums"]["message_status"];
          subject: string;
          urgency: Database["public"]["Enums"]["message_urgency"];
        };
      };
      mission_feedback: {
        Row: {
          author_role: Database["public"]["Enums"]["app_role"];
          body: string;
          created_at: string;
          id: string;
          mission_id: string;
          title: string;
        };
      };
      missions: {
        Row: {
          budget_cents: number;
          client_id: string;
          created_at: string;
          deadline_at: string | null;
          deliverables: string[];
          delivery_body: string;
          delivery_subject: string;
          designer_id: string;
          expectations: string[];
          figma_link: string;
          id: string;
          mentor_id: string;
          note: string;
          objective: string;
          status: Database["public"]["Enums"]["mission_status"];
          title: string;
          updated_at: string;
        };
        Update: {
          figma_link?: string;
          status?: Database["public"]["Enums"]["mission_status"];
        };
      };
      profiles: {
        Row: {
          balance_cents: number;
          career_stage: string;
          created_at: string;
          display_name: string;
          email: string;
          id: string;
          mentor_id: string | null;
          pending_mentor_email: string | null;
          reputation: number;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Update: {
          display_name?: string;
          mentor_id?: string | null;
          pending_mentor_email?: string | null;
        };
      };
      progress_snapshots: {
        Row: {
          created_at: string;
          designer_id: string;
          id: string;
          is_highlight: boolean;
          label: string;
          mentor_id: string | null;
          value: number;
        };
      };
    };
    Enums: {
      app_role: "mentor" | "designer";
      delivery_status: "draft" | "submitted" | "reviewed";
      message_status: "new" | "pending" | "reply_required" | "archived";
      message_urgency: "normal" | "today" | "priority";
      mission_status:
        | "new"
        | "active"
        | "delivery_due"
        | "revision"
        | "validated";
    };
  };
};

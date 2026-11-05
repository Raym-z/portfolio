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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "admin" | "user";
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "user";
          created_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "user";
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description_id: string;
          description_en: string;
          thumbnail_url: string | null;
          tech_stack: string[];
          features: string[];
          live_url: string | null;
          github_url: string | null;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description_id?: string;
          description_en?: string;
          thumbnail_url?: string | null;
          tech_stack?: string[];
          features?: string[];
          live_url?: string | null;
          github_url?: string | null;
          published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          description_id?: string;
          description_en?: string;
          thumbnail_url?: string | null;
          tech_stack?: string[];
          features?: string[];
          live_url?: string | null;
          github_url?: string | null;
          published?: boolean;
          display_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string | null;
          image_url: string;
          url: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer?: string | null;
          image_url: string;
          url?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          issuer?: string | null;
          image_url?: string;
          url?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          user_name: string;
          content: string;
          profile_image_url: string | null;
          is_pinned: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          content: string;
          profile_image_url?: string | null;
          is_pinned?: boolean;
          created_at?: string;
        };
        Update: {
          is_pinned?: boolean;
          content?: string;
          user_name?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

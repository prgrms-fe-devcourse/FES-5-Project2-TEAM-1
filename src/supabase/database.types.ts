export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      board: {
        Row: {
          active: boolean | null
          address: string | null
          board_cls: Database["public"]["Enums"]["board_cls"] | null
          board_id: string
          contents: string
          create_at: string
          images: string | null
          likes: number
          meeting_time: string | null
          member: string | null
          profile_id: string
          title: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          board_cls?: Database["public"]["Enums"]["board_cls"] | null
          board_id?: string
          contents: string
          create_at?: string
          images?: string | null
          likes?: number
          meeting_time?: string | null
          member?: string | null
          profile_id?: string
          title: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          board_cls?: Database["public"]["Enums"]["board_cls"] | null
          board_id?: string
          contents?: string
          create_at?: string
          images?: string | null
          likes?: number
          meeting_time?: string | null
          member?: string | null
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_to_board"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      board_member: {
        Row: {
          board_id: string
          member_id: string
          profile_id: string
        }
        Insert: {
          board_id?: string
          member_id?: string
          profile_id?: string
        }
        Update: {
          board_id?: string
          member_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_member_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "fk_user_profile_to_channel_member"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      board_save: {
        Row: {
          address: string
          board_cls: Database["public"]["Enums"]["board_cls"]
          board_id: string
          contents: string
          create_at: string
          due_date: string
          images: string
          join_cls: Database["public"]["Enums"]["join_cls"]
          member: string
          profile_id: string
          title: string
        }
        Insert: {
          address: string
          board_cls?: Database["public"]["Enums"]["board_cls"]
          board_id?: string
          contents: string
          create_at?: string
          due_date?: string
          images: string
          join_cls?: Database["public"]["Enums"]["join_cls"]
          member: string
          profile_id?: string
          title: string
        }
        Update: {
          address?: string
          board_cls?: Database["public"]["Enums"]["board_cls"]
          board_id?: string
          contents?: string
          create_at?: string
          due_date?: string
          images?: string
          join_cls?: Database["public"]["Enums"]["join_cls"]
          member?: string
          profile_id?: string
          title?: string
        }
        Relationships: []
      }
      board_tag: {
        Row: {
          board_id: string
          color_code: string | null
          hash_tag: string | null
          tag_id: string
        }
        Insert: {
          board_id?: string
          color_code?: string | null
          hash_tag?: string | null
          tag_id?: string
        }
        Update: {
          board_id?: string
          color_code?: string | null
          hash_tag?: string | null
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_board_to_board_tag"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
        ]
      }
      comment: {
        Row: {
          board_id: string
          comment_id: string
          contents: string
          create_at: string
          likes: number
          profile_id: string
        }
        Insert: {
          board_id?: string
          comment_id?: string
          contents: string
          create_at?: string
          likes?: number
          profile_id?: string
        }
        Update: {
          board_id?: string
          comment_id?: string
          contents?: string
          create_at?: string
          likes?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "fk_board_to_comment"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
        ]
      }
      commnet_reply: {
        Row: {
          comment_id: string
          contents: string
          created_at: string
          likes: number
          profile_id: string
          reply_id: string
        }
        Insert: {
          comment_id?: string
          contents: string
          created_at?: string
          likes?: number
          profile_id?: string
          reply_id?: string
        }
        Update: {
          comment_id?: string
          contents?: string
          created_at?: string
          likes?: number
          profile_id?: string
          reply_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commnet_reply_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comment"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "commnet_reply_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      news_cards: {
        Row: {
          description: string
          id: number
          image: string
          title: string
          url: string
        }
        Insert: {
          description: string
          id?: never
          image: string
          title: string
          url: string
        }
        Update: {
          description?: string
          id?: never
          image?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      peer_review: {
        Row: {
          create_at: string
          profile_id: string
          review_contents: string
          review_contents_preview: string
          review_id: string
          review_score: number
          writer_id: string
        }
        Insert: {
          create_at?: string
          profile_id?: string
          review_contents: string
          review_contents_preview: string
          review_id?: string
          review_score?: number
          writer_id?: string
        }
        Update: {
          create_at?: string
          profile_id?: string
          review_contents?: string
          review_contents_preview?: string
          review_id?: string
          review_score?: number
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_to_peer_review"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "fk_user_profile_to_peer_review1"
            columns: ["writer_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      post: {
        Row: {
          board_id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          board_id?: string
          post_id?: string
          profile_id?: string
        }
        Update: {
          board_id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_board_to_post"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "fk_user_profile_to_post"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      scrap: {
        Row: {
          board_id: string
          profile_id: string
          scrap_id: string
        }
        Insert: {
          board_id?: string
          profile_id?: string
          scrap_id?: string
        }
        Update: {
          board_id?: string
          profile_id?: string
          scrap_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_board_to_scrap"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "fk_user_profile_to_scrap"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      thread: {
        Row: {
          board_id: string
          contents: string
          create_at: string
          likes: number
          profile_id: string
          thread_id: string
        }
        Insert: {
          board_id?: string
          contents: string
          create_at?: string
          likes?: number
          profile_id?: string
          thread_id?: string
        }
        Update: {
          board_id?: string
          contents?: string
          create_at?: string
          likes?: number
          profile_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_to_thread"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "thread_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "board"
            referencedColumns: ["board_id"]
          },
        ]
      }
      thread_reply: {
        Row: {
          contents: string
          created_at: string
          likes: number | null
          profile_id: string
          reply_id: string
          thread_id: string
        }
        Insert: {
          contents: string
          created_at?: string
          likes?: number | null
          profile_id?: string
          reply_id?: string
          thread_id?: string
        }
        Update: {
          contents?: string
          created_at?: string
          likes?: number | null
          profile_id?: string
          reply_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_reply_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "thread_reply_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "thread"
            referencedColumns: ["thread_id"]
          },
        ]
      }
      user_base: {
        Row: {
          create_at: string
          id: string
          name: string
          nickname: string
          recent_at: string
          role: string
          status: Database["public"]["Enums"]["status"]
        }
        Insert: {
          create_at?: string
          id?: string
          name: string
          nickname: string
          recent_at?: string
          role: string
          status?: Database["public"]["Enums"]["status"]
        }
        Update: {
          create_at?: string
          id?: string
          name?: string
          nickname?: string
          recent_at?: string
          role?: string
          status?: Database["public"]["Enums"]["status"]
        }
        Relationships: []
      }
      user_interest: {
        Row: {
          interest: string
          interest_id: string
          profile_id: string
        }
        Insert: {
          interest: string
          interest_id?: string
          profile_id?: string
        }
        Update: {
          interest?: string
          interest_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_to_user_interest"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      user_profile: {
        Row: {
          address: string
          age: number
          background_images: string
          email: string
          gender: string
          profile_id: string
          profile_images: string
          user_id: string
        }
        Insert: {
          address: string
          age?: number
          background_images: string
          email: string
          gender: string
          profile_id?: string
          profile_images: string
          user_id?: string
        }
        Update: {
          address?: string
          age?: number
          background_images?: string
          email?: string
          gender?: string
          profile_id?: string
          profile_images?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_to_user_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_base"
            referencedColumns: ["id"]
          },
        ]
      }
      user_social: {
        Row: {
          create_at: string
          profile_id: string
          social: string
          social_id: string
          social_link: string
        }
        Insert: {
          create_at?: string
          profile_id?: string
          social?: string
          social_id?: string
          social_link: string
        }
        Update: {
          create_at?: string
          profile_id?: string
          social?: string
          social_id?: string
          social_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile_to_user_social"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      board_cls: "0" | "1"
      join_cls: "0" | "1"
      status: "0" | "1" | "2" | "3"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      board_cls: ["0", "1"],
      join_cls: ["0", "1"],
      status: ["0", "1", "2", "3"],
    },
  },
} as const

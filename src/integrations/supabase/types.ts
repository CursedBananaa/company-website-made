export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_config: {
        Row: {
          id: number
          created_at: string
          is_maintenance_mode: boolean | null
          maintenance_message: string | null
          maintenance_title: string | null
          min_supported_version: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          is_maintenance_mode?: boolean | null
          maintenance_message?: string | null
          maintenance_title?: string | null
          min_supported_version?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          is_maintenance_mode?: boolean | null
          maintenance_message?: string | null
          maintenance_title?: string | null
          min_supported_version?: string | null
        }
      }
      application: {
        Row: {
          id: number
          created_at: string
          status: string | null
          opportunity_id: number | null
          cv: string | null
          proposal: string | null
          notes: string | null
          student_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          status?: string | null
          opportunity_id?: number | null
          cv?: string | null
          proposal?: string | null
          notes?: string | null
          student_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          status?: string | null
          opportunity_id?: number | null
          cv?: string | null
          proposal?: string | null
          notes?: string | null
          student_id?: number | null
        }
      }
      assignment: {
        Row: {
          id: number
          created_at: string
          student_id: number
          opportunity_id: number
        }
        Insert: {
          id?: never
          created_at?: string
          student_id: number
          opportunity_id: number
        }
        Update: {
          id?: never
          created_at?: string
          student_id?: number
          opportunity_id?: number
        }
      }
      categories: {
        Row: {
          id: number
          created_at: string
          name: string | null
          icone_url: string | null
          description: string | null
          opportunity_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          name?: string | null
          icone_url?: string | null
          description?: string | null
          opportunity_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          name?: string | null
          icone_url?: string | null
          description?: string | null
          opportunity_id?: number | null
        }
      }
      chats: {
        Row: {
          id: number
          created_at: string
          participants: string[]
          last_message: string | null
          last_message_time: string | null
          unread_count: number
        }
        Insert: {
          id?: never
          created_at?: string
          participants: string[]
          last_message?: string | null
          last_message_time?: string | null
          unread_count?: number
        }
        Update: {
          id?: never
          created_at?: string
          participants?: string[]
          last_message?: string | null
          last_message_time?: string | null
          unread_count?: number
        }
      }
      company_profile: {
        Row: {
          id: number
          created_at: string
          website: string | null
          industry: string | null
          description: string | null
          user_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          website?: string | null
          industry?: string | null
          description?: string | null
          user_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          website?: string | null
          industry?: string | null
          description?: string | null
          user_id?: number | null
        }
      }
      completed_modules: {
        Row: {
          id: number
          created_at: string
          student_id: number
          module_id: number
        }
        Insert: {
          id?: never
          created_at?: string
          student_id: number
          module_id: number
        }
        Update: {
          id?: never
          created_at?: string
          student_id?: number
          module_id?: number
        }
      }
      completed_opportunity: {
        Row: {
          id: number
          created_at: string
          confirmed_by_student: boolean | null
          confirmed_by_company: boolean | null
          confirmed_by_payment: boolean | null
          student_id: number | null
          opportunity_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          confirmed_by_student?: boolean | null
          confirmed_by_company?: boolean | null
          confirmed_by_payment?: boolean | null
          student_id?: number | null
          opportunity_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          confirmed_by_student?: boolean | null
          confirmed_by_company?: boolean | null
          confirmed_by_payment?: boolean | null
          student_id?: number | null
          opportunity_id?: number | null
        }
      }
      messages: {
        Row: {
          id: number
          created_at: string
          content: string
          sender_id: number
          is_read: boolean
          chat_id: number
        }
        Insert: {
          id?: never
          created_at?: string
          content: string
          sender_id: number
          is_read?: boolean
          chat_id: number
        }
        Update: {
          id?: never
          created_at?: string
          content?: string
          sender_id?: number
          is_read?: boolean
          chat_id?: number
        }
      }
      modules: {
        Row: {
          id: number
          created_at: string
          opportunity_id: number
          title: string
          description: string
          duration: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          opportunity_id: number
          title: string
          description: string
          duration?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          opportunity_id?: number
          title?: string
          description?: string
          duration?: number | null
        }
      }
      notifications: {
        Row: {
          id: number
          created_at: string
          title: string | null
          body: string | null
          is_read: boolean | null
          u_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          title?: string | null
          body?: string | null
          is_read?: boolean | null
          u_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          title?: string | null
          body?: string | null
          is_read?: boolean | null
          u_id?: number | null
        }
      }
      opportunity: {
        Row: {
          id: number
          created_at: string
          title: string | null
          type: string | null
          description: string | null
          requirements: string | null
          deadline: string | null
          is_paid: boolean | null
          amount_of_money: number | null
          duration: number | null
          company_id: number | null
          image_url: string | null
        }
        Insert: {
          id?: never
          created_at?: string
          title?: string | null
          type?: string | null
          description?: string | null
          requirements?: string | null
          deadline?: string | null
          is_paid?: boolean | null
          amount_of_money?: number | null
          duration?: number | null
          company_id?: number | null
          image_url?: string | null
        }
        Update: {
          id?: never
          created_at?: string
          title?: string | null
          type?: string | null
          description?: string | null
          requirements?: string | null
          deadline?: string | null
          is_paid?: boolean | null
          amount_of_money?: number | null
          duration?: number | null
          company_id?: number | null
          image_url?: string | null
        }
      }
      payment: {
        Row: {
          id: number
          paid_at: string
          amount: number | null
          currency: string | null
          type: string | null
          method: string | null
          status: string | null
          total_installment: number | null
          installment_number: number | null
          uid_sender_id: number | null
          uid_receiver_id: number | null
          completed_opp_id: number | null
        }
        Insert: {
          id?: never
          paid_at?: string
          amount?: number | null
          currency?: string | null
          type?: string | null
          method?: string | null
          status?: string | null
          total_installment?: number | null
          installment_number?: number | null
          uid_sender_id?: number | null
          uid_receiver_id?: number | null
          completed_opp_id?: number | null
        }
        Update: {
          id?: never
          paid_at?: string
          amount?: number | null
          currency?: string | null
          type?: string | null
          method?: string | null
          status?: string | null
          total_installment?: number | null
          installment_number?: number | null
          uid_sender_id?: number | null
          uid_receiver_id?: number | null
          completed_opp_id?: number | null
        }
      }
      review: {
        Row: {
          id: number
          created_at: string
          rating: number | null
          comment: string | null
          uid_review: number | null
          uid_target: number | null
          completed_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          rating?: number | null
          comment?: string | null
          uid_review?: number | null
          uid_target?: number | null
          completed_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          rating?: number | null
          comment?: string | null
          uid_review?: number | null
          uid_target?: number | null
          completed_id?: number | null
        }
      }
      saved_opportunities: {
        Row: {
          id: number
          created_at: string
          user_id: number | null
          opportunity_id: number | null
        }
        Insert: {
          id?: never
          created_at?: string
          user_id?: number | null
          opportunity_id?: number | null
        }
        Update: {
          id?: never
          created_at?: string
          user_id?: number | null
          opportunity_id?: number | null
        }
      }
      student_profile: {
        Row: {
          id: number
          created_at: string
          university: string | null
          major: string | null
          grad_year: string | null
          training_days: number | null
          user_id: number | null
          cv_url: string | null
          github_url: string | null
        }
        Insert: {
          id?: never
          created_at?: string
          university?: string | null
          major?: string | null
          grad_year?: string | null
          training_days?: number | null
          user_id?: number | null
          cv_url?: string | null
          github_url?: string | null
        }
        Update: {
          id?: never
          created_at?: string
          university?: string | null
          major?: string | null
          grad_year?: string | null
          training_days?: number | null
          user_id?: number | null
          cv_url?: string | null
          github_url?: string | null
        }
      }
      student_skills: {
        Row: {
          student_id: number
          created_at: string
          skill_name: string
        }
        Insert: {
          student_id?: never
          created_at?: string
          skill_name: string
        }
        Update: {
          student_id?: never
          created_at?: string
          skill_name?: string
        }
      }
      user: {
        Row: {
          id: number
          created_at: string
          full_name: string
          phone_number: string | null
          email: string
          password: string
          auth_id: string | null
          updated_at: string | null
          role: string
          bio: string | null
          profile_picture: string | null
          fcm_token: string | null
        }
        Insert: {
          id?: never
          created_at?: string
          full_name: string
          phone_number?: string | null
          email: string
          password: string
          auth_id?: string | null
          updated_at?: string | null
          role?: string
          bio?: string | null
          profile_picture?: string | null
          fcm_token?: string | null
        }
        Update: {
          id?: never
          created_at?: string
          full_name?: string
          phone_number?: string | null
          email?: string
          password?: string
          auth_id?: string | null
          updated_at?: string | null
          role?: string
          bio?: string | null
          profile_picture?: string | null
          fcm_token?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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

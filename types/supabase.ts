export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      ai_call_logs: {
        Row: {
          call_type: string;
          created_at: string | null;
          error_message: string | null;
          estimated_tokens: number | null;
          http_status: number;
          id: string;
          key_index: number;
          latency_ms: number;
          provider_id: string;
        };
        Insert: {
          call_type: string;
          created_at?: string | null;
          error_message?: string | null;
          estimated_tokens?: number | null;
          http_status: number;
          id?: string;
          key_index: number;
          latency_ms: number;
          provider_id: string;
        };
        Update: {
          call_type?: string;
          created_at?: string | null;
          error_message?: string | null;
          estimated_tokens?: number | null;
          http_status?: number;
          id?: string;
          key_index?: number;
          latency_ms?: number;
          provider_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_call_logs_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'ai_providers';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_provider_keys: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean;
          key_index: number;
          key_value_encrypted: string;
          label: string | null;
          provider_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean;
          key_index: number;
          key_value_encrypted: string;
          label?: string | null;
          provider_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean;
          key_index?: number;
          key_value_encrypted?: string;
          label?: string | null;
          provider_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_provider_keys_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'ai_providers';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_providers: {
        Row: {
          created_at: string | null;
          display_name: string;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          display_name: string;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          created_at?: string | null;
          display_name?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      eval_results: {
        Row: {
          calibration_rationale: string;
          calibration_score: number;
          created_at: string | null;
          followup_rationale: string | null;
          followup_score: number | null;
          id: string;
          overall_eval_score: number;
          provider_used: string;
          question_quality_rationale: string;
          question_quality_score: number;
          report_accuracy_rationale: string;
          report_accuracy_score: number;
          session_id: string;
          tone_rationale: string;
          tone_score: number;
        };
        Insert: {
          calibration_rationale: string;
          calibration_score: number;
          created_at?: string | null;
          followup_rationale?: string | null;
          followup_score?: number | null;
          id?: string;
          overall_eval_score: number;
          provider_used: string;
          question_quality_rationale: string;
          question_quality_score: number;
          report_accuracy_rationale: string;
          report_accuracy_score: number;
          session_id: string;
          tone_rationale: string;
          tone_score: number;
        };
        Update: {
          calibration_rationale?: string;
          calibration_score?: number;
          created_at?: string | null;
          followup_rationale?: string | null;
          followup_score?: number | null;
          id?: string;
          overall_eval_score?: number;
          provider_used?: string;
          question_quality_rationale?: string;
          question_quality_score?: number;
          report_accuracy_rationale?: string;
          report_accuracy_score?: number;
          session_id?: string;
          tone_rationale?: string;
          tone_score?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'eval_results_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: true;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          is_suspended: boolean;
          role: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          is_suspended?: boolean;
          role?: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_suspended?: boolean;
          role?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string | null;
          id: string;
          overall_score: number;
          report_json: Json;
          role_alignment_summary: string;
          session_id: string;
          top_improvements: string[];
          top_strengths: string[];
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          overall_score: number;
          report_json: Json;
          role_alignment_summary: string;
          session_id: string;
          top_improvements: string[];
          top_strengths: string[];
        };
        Update: {
          created_at?: string | null;
          id?: string;
          overall_score?: number;
          report_json?: Json;
          role_alignment_summary?: string;
          session_id?: string;
          top_improvements?: string[];
          top_strengths?: string[];
        };
        Relationships: [
          {
            foreignKeyName: 'reports_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: true;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      session_feedback: {
        Row: {
          created_at: string | null;
          feedback_text: string | null;
          id: string;
          session_id: string;
          star_rating: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          feedback_text?: string | null;
          id?: string;
          session_id: string;
          star_rating: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          feedback_text?: string | null;
          id?: string;
          session_id?: string;
          star_rating?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'session_feedback_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: true;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'session_feedback_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      sessions: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          duration_secs: number | null;
          id: string;
          jd_role_title: string | null;
          jd_text: string;
          overall_score: number | null;
          resume_id: string | null;
          resume_text: string;
          slider_value: number;
          status: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          duration_secs?: number | null;
          id?: string;
          jd_role_title?: string | null;
          jd_text: string;
          overall_score?: number | null;
          resume_id?: string | null;
          resume_text: string;
          slider_value: number;
          status?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          duration_secs?: number | null;
          id?: string;
          jd_role_title?: string | null;
          jd_text?: string;
          overall_score?: number | null;
          resume_id?: string | null;
          resume_text?: string;
          slider_value?: number;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_resume_id_fkey';
            columns: ['resume_id'];
            isOneToOne: false;
            referencedRelation: 'user_resumes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      transcripts: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          question_id: string | null;
          session_id: string;
          speaker: string;
          turn_index: number;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          question_id?: string | null;
          session_id: string;
          speaker: string;
          turn_index: number;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          question_id?: string | null;
          session_id?: string;
          speaker?: string;
          turn_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'transcripts_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      user_resumes: {
        Row: {
          extracted_text: string;
          file_name: string;
          id: string;
          is_default: boolean | null;
          storage_path: string;
          uploaded_at: string | null;
          user_id: string;
        };
        Insert: {
          extracted_text: string;
          file_name: string;
          id?: string;
          is_default?: boolean | null;
          storage_path: string;
          uploaded_at?: string | null;
          user_id: string;
        };
        Update: {
          extracted_text?: string;
          file_name?: string;
          id?: string;
          is_default?: boolean | null;
          storage_path?: string;
          uploaded_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_resumes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ams_achievements: {
        Row: {
          active: boolean
          category: string
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          role: string
          title: string
          updated_at: string
          xp: number
        }
        Insert: {
          active?: boolean
          category?: string
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          role?: string
          title: string
          updated_at?: string
          xp?: number
        }
        Update: {
          active?: boolean
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          role?: string
          title?: string
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      ams_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          meta: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          meta?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          meta?: Json | null
        }
        Relationships: []
      }
      ams_badges: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          rarity: string
          title: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          rarity?: string
          title: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          rarity?: string
          title?: string
        }
        Relationships: []
      }
      ams_claims: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reward_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reward_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reward_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_claims_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "ams_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      ams_levels: {
        Row: {
          level: number
          reward: string | null
          title: string
          xp_required: number
        }
        Insert: {
          level: number
          reward?: string | null
          title: string
          xp_required: number
        }
        Update: {
          level?: number
          reward?: string | null
          title?: string
          xp_required?: number
        }
        Relationships: []
      }
      ams_milestones: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          id: string
          metric: string
          target_value: number
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          id?: string
          metric?: string
          target_value?: number
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          metric?: string
          target_value?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      ams_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ams_ranks: {
        Row: {
          color: string
          id: string
          min_level: number
          name: string
          perks: string | null
        }
        Insert: {
          color?: string
          id: string
          min_level: number
          name: string
          perks?: string | null
        }
        Update: {
          color?: string
          id?: string
          min_level?: number
          name?: string
          perks?: string | null
        }
        Relationships: []
      }
      ams_rewards: {
        Row: {
          active: boolean
          code: string
          cost_xp: number
          created_at: string
          description: string | null
          id: string
          stock: number
          title: string
          type: string
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          cost_xp?: number
          created_at?: string
          description?: string | null
          id?: string
          stock?: number
          title: string
          type?: string
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          cost_xp?: number
          created_at?: string
          description?: string | null
          id?: string
          stock?: number
          title?: string
          type?: string
          value?: number
        }
        Relationships: []
      }
      ams_streaks: {
        Row: {
          activity_count: number
          date: string
          id: string
          user_id: string
        }
        Insert: {
          activity_count?: number
          date: string
          id?: string
          user_id: string
        }
        Update: {
          activity_count?: number
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ams_trophies: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          tier: string
          title: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          tier?: string
          title: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          tier?: string
          title?: string
        }
        Relationships: []
      }
      ams_user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "ams_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      ams_user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "ams_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      ams_user_milestones: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          milestone_id: string
          progress: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          milestone_id: string
          progress?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          milestone_id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "ams_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      ams_user_progress: {
        Row: {
          achievements_unlocked: number
          created_at: string
          current_streak: number
          display_name: string | null
          last_activity_at: string | null
          level: number
          longest_streak: number
          rank: string
          role: string
          territory: string | null
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_unlocked?: number
          created_at?: string
          current_streak?: number
          display_name?: string | null
          last_activity_at?: string | null
          level?: number
          longest_streak?: number
          rank?: string
          role?: string
          territory?: string | null
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_unlocked?: number
          created_at?: string
          current_streak?: number
          display_name?: string | null
          last_activity_at?: string | null
          level?: number
          longest_streak?: number
          rank?: string
          role?: string
          territory?: string | null
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ams_user_trophies: {
        Row: {
          awarded_at: string
          id: string
          trophy_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          id?: string
          trophy_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          id?: string
          trophy_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_user_trophies_trophy_id_fkey"
            columns: ["trophy_id"]
            isOneToOne: false
            referencedRelation: "ams_trophies"
            referencedColumns: ["id"]
          },
        ]
      }
      ams_xp_transactions: {
        Row: {
          achievement_id: string | null
          amount: number
          category: string
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          achievement_id?: string | null
          amount: number
          category?: string
          created_at?: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          achievement_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ams_xp_transactions_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "ams_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_achievements: {
        Row: {
          code: string
          description: string | null
          id: string
          tier: string | null
          title: string
          unlocked_at: string
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          code: string
          description?: string | null
          id?: string
          tier?: string | null
          title: string
          unlocked_at?: string
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          code?: string
          description?: string | null
          id?: string
          tier?: string | null
          title?: string
          unlocked_at?: string
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: []
      }
      reseller_ai_messages: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      reseller_commissions: {
        Row: {
          amount: number | null
          created_at: string
          earned_at: string | null
          id: string
          order_id: string | null
          paid_at: string | null
          rate: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          earned_at?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          rate?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          earned_at?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          rate?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "reseller_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_customers: {
        Row: {
          company: string | null
          country_code: string | null
          created_at: string
          email: string | null
          health_score: number | null
          id: string
          joined_at: string | null
          lifetime_value: number | null
          mrr: number | null
          name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          health_score?: number | null
          id?: string
          joined_at?: string | null
          lifetime_value?: number | null
          mrr?: number | null
          name: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          health_score?: number | null
          id?: string
          joined_at?: string | null
          lifetime_value?: number | null
          mrr?: number | null
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reseller_kpi_daily: {
        Row: {
          commission: number | null
          customers_new: number | null
          date: string
          id: string
          leads_new: number | null
          orders_count: number | null
          revenue: number | null
          user_id: string
        }
        Insert: {
          commission?: number | null
          customers_new?: number | null
          date: string
          id?: string
          leads_new?: number | null
          orders_count?: number | null
          revenue?: number | null
          user_id: string
        }
        Update: {
          commission?: number | null
          customers_new?: number | null
          date?: string
          id?: string
          leads_new?: number | null
          orders_count?: number | null
          revenue?: number | null
          user_id?: string
        }
        Relationships: []
      }
      reseller_leads: {
        Row: {
          budget: number | null
          company: string | null
          country_code: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          name: string
          next_action: string | null
          next_action_at: string | null
          notes: string | null
          phone: string | null
          probability: number | null
          score: number | null
          source: string | null
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          company?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          next_action?: string | null
          next_action_at?: string | null
          notes?: string | null
          phone?: string | null
          probability?: number | null
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          company?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          next_action?: string | null
          next_action_at?: string | null
          notes?: string | null
          phone?: string | null
          probability?: number | null
          score?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reseller_licenses: {
        Row: {
          created_at: string
          customer_id: string | null
          expires_at: string | null
          id: string
          issued_at: string | null
          license_key: string | null
          product_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          license_key?: string | null
          product_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          license_key?: string | null
          product_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_licenses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "reseller_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_id: string | null
          id: string
          ordered_at: string | null
          product_name: string
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          ordered_at?: string | null
          product_name: string
          stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          id?: string
          ordered_at?: string | null
          product_name?: string
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "reseller_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_profiles: {
        Row: {
          avatar_url: string | null
          champion_tier: string | null
          country_code: string | null
          country_name: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          employee_id: string | null
          id: string
          level: number | null
          lifetime_revenue: number | null
          monthly_revenue: number | null
          rank: string | null
          territory: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          wallet_balance: number | null
          xp_total: number | null
        }
        Insert: {
          avatar_url?: string | null
          champion_tier?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          employee_id?: string | null
          id?: string
          level?: number | null
          lifetime_revenue?: number | null
          monthly_revenue?: number | null
          rank?: string | null
          territory?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          wallet_balance?: number | null
          xp_total?: number | null
        }
        Update: {
          avatar_url?: string | null
          champion_tier?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          employee_id?: string | null
          id?: string
          level?: number | null
          lifetime_revenue?: number | null
          monthly_revenue?: number | null
          rank?: string | null
          territory?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          wallet_balance?: number | null
          xp_total?: number | null
        }
        Relationships: []
      }
      reseller_renewals: {
        Row: {
          amount: number | null
          created_at: string
          customer_id: string | null
          due_at: string
          id: string
          license_id: string | null
          product_name: string
          risk_level: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_id?: string | null
          due_at: string
          id?: string
          license_id?: string | null
          product_name: string
          risk_level?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_id?: string | null
          due_at?: string
          id?: string
          license_id?: string | null
          product_name?: string
          risk_level?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_renewals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "reseller_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reseller_renewals_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "reseller_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ams_award_xp: {
        Args: {
          _achievement_id?: string
          _amount: number
          _category: string
          _reason: string
          _user_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "boss" | "moderator" | "user"
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
      app_role: ["admin", "boss", "moderator", "user"],
    },
  },
} as const

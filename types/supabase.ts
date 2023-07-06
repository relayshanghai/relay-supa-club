export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      campaign_creators: {
        Row: {
          added_by_id: string
          address: string | null
          avatar_url: string
          brief_opened_by_creator: boolean | null
          campaign_id: string | null
          created_at: string | null
          creator_id: string
          creator_model: string | null
          creator_token: string | null
          email_sent: boolean | null
          fullname: string | null
          id: string
          influencer_social_profiles_id: string | null
          interested: boolean | null
          link_url: string | null
          need_support: boolean | null
          next_step: string | null
          paid_amount: number
          payment_currency: string
          payment_details: string | null
          payment_rate: number
          payment_status: string
          platform: string
          publication_date: string | null
          rate_currency: string
          reject_message: string | null
          relay_creator_id: number | null
          sample_status: string
          status: string | null
          tracking_details: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          added_by_id: string
          address?: string | null
          avatar_url: string
          brief_opened_by_creator?: boolean | null
          campaign_id?: string | null
          created_at?: string | null
          creator_id: string
          creator_model?: string | null
          creator_token?: string | null
          email_sent?: boolean | null
          fullname?: string | null
          id?: string
          influencer_social_profiles_id?: string | null
          interested?: boolean | null
          link_url?: string | null
          need_support?: boolean | null
          next_step?: string | null
          paid_amount?: number
          payment_currency?: string
          payment_details?: string | null
          payment_rate?: number
          payment_status?: string
          platform?: string
          publication_date?: string | null
          rate_currency?: string
          reject_message?: string | null
          relay_creator_id?: number | null
          sample_status?: string
          status?: string | null
          tracking_details?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          added_by_id?: string
          address?: string | null
          avatar_url?: string
          brief_opened_by_creator?: boolean | null
          campaign_id?: string | null
          created_at?: string | null
          creator_id?: string
          creator_model?: string | null
          creator_token?: string | null
          email_sent?: boolean | null
          fullname?: string | null
          id?: string
          influencer_social_profiles_id?: string | null
          interested?: boolean | null
          link_url?: string | null
          need_support?: boolean | null
          next_step?: string | null
          paid_amount?: number
          payment_currency?: string
          payment_details?: string | null
          payment_rate?: number
          payment_status?: string
          platform?: string
          publication_date?: string | null
          rate_currency?: string
          reject_message?: string | null
          relay_creator_id?: number | null
          sample_status?: string
          status?: string | null
          tracking_details?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_added_by_id_fkey"
            columns: ["added_by_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_influencer_social_profiles_id_fkey"
            columns: ["influencer_social_profiles_id"]
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_notes: {
        Row: {
          campaign_creator_id: string
          comment: string | null
          created_at: string | null
          id: string
          important: boolean
          user_id: string
        }
        Insert: {
          campaign_creator_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          important?: boolean
          user_id: string
        }
        Update: {
          campaign_creator_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          important?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_notes_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          archived: boolean | null
          budget_cents: number | null
          budget_currency: string | null
          company_id: string
          created_at: string | null
          creator_count: number | null
          date_end_campaign: string | null
          date_end_creator_outreach: string | null
          date_start_campaign: string | null
          description: string
          id: string
          media: Json[] | null
          media_path: string[] | null
          name: string
          product_link: string | null
          product_name: string | null
          promo_types: string[] | null
          purge_media: Json[] | null
          requirements: string | null
          slug: string | null
          status: string | null
          tag_list: string[] | null
          target_locations: string[] | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          budget_cents?: number | null
          budget_currency?: string | null
          company_id: string
          created_at?: string | null
          creator_count?: number | null
          date_end_campaign?: string | null
          date_end_creator_outreach?: string | null
          date_start_campaign?: string | null
          description: string
          id?: string
          media?: Json[] | null
          media_path?: string[] | null
          name: string
          product_link?: string | null
          product_name?: string | null
          promo_types?: string[] | null
          purge_media?: Json[] | null
          requirements?: string | null
          slug?: string | null
          status?: string | null
          tag_list?: string[] | null
          target_locations?: string[] | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          budget_cents?: number | null
          budget_currency?: string | null
          company_id?: string
          created_at?: string | null
          creator_count?: number | null
          date_end_campaign?: string | null
          date_end_creator_outreach?: string | null
          date_start_campaign?: string | null
          description?: string
          id?: string
          media?: Json[] | null
          media_path?: string[] | null
          name?: string
          product_link?: string | null
          product_name?: string | null
          promo_types?: string[] | null
          purge_media?: Json[] | null
          requirements?: string | null
          slug?: string | null
          status?: string | null
          tag_list?: string[] | null
          target_locations?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          ai_email_generator_limit: string
          avatar_url: string | null
          created_at: string | null
          cus_id: string | null
          id: string
          name: string | null
          profiles_limit: string
          searches_limit: string
          size: string | null
          subscription_current_period_end: string | null
          subscription_current_period_start: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string
          trial_ai_email_generator_limit: string
          trial_profiles_limit: string
          trial_searches_limit: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          ai_email_generator_limit?: string
          avatar_url?: string | null
          created_at?: string | null
          cus_id?: string | null
          id?: string
          name?: string | null
          profiles_limit?: string
          searches_limit?: string
          size?: string | null
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          trial_ai_email_generator_limit?: string
          trial_profiles_limit?: string
          trial_searches_limit?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          ai_email_generator_limit?: string
          avatar_url?: string | null
          created_at?: string | null
          cus_id?: string | null
          id?: string
          name?: string | null
          profiles_limit?: string
          searches_limit?: string
          size?: string | null
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          trial_ai_email_generator_limit?: string
          trial_profiles_limit?: string
          trial_searches_limit?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_categories: {
        Row: {
          category: string
          company_id: string
          created_at: string
          id: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          id?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_categories_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_categories: {
        Row: {
          category: string
          created_at: string | null
          id: string
          influencer_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          influencer_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          influencer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_categories_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_posts: {
        Row: {
          campaign_id: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          influencer_social_profile_id: string | null
          is_reusable: boolean
          platform: string
          posted_date: string | null
          preview_url: string | null
          publish_date: string | null
          title: string | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          influencer_social_profile_id?: string | null
          is_reusable?: boolean
          platform: string
          posted_date?: string | null
          preview_url?: string | null
          publish_date?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          influencer_social_profile_id?: string | null
          is_reusable?: boolean
          platform?: string
          posted_date?: string | null
          preview_url?: string | null
          publish_date?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_posts_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_social_profiles: {
        Row: {
          created_at: string | null
          id: string
          influencer_id: string
          platform: string
          reference_id: string
          url: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          influencer_id: string
          platform: string
          reference_id: string
          url: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          influencer_id?: string
          platform?: string
          reference_id?: string
          url?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_social_profiles_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      influencers: {
        Row: {
          address: string | null
          avatar_url: string
          created_at: string | null
          email: string | null
          id: string
          is_recommended: boolean | null
          name: string
        }
        Insert: {
          address?: string | null
          avatar_url: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_recommended?: boolean | null
          name: string
        }
        Update: {
          address?: string | null
          avatar_url?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_recommended?: boolean | null
          name?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          company_id: string
          company_owner: boolean | null
          created_at: string | null
          email: string
          expire_at: string | null
          id: string
          updated_at: string | null
          used: boolean
        }
        Insert: {
          company_id: string
          company_owner?: boolean | null
          created_at?: string | null
          email: string
          expire_at?: string | null
          id?: string
          updated_at?: string | null
          used?: boolean
        }
        Update: {
          company_id?: string
          company_owner?: boolean | null
          created_at?: string | null
          email?: string
          expire_at?: string | null
          id?: string
          updated_at?: string | null
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "invites_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      logs: {
        Row: {
          created_at: string | null
          data: Json | null
          id: number
          message: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: number
          message?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: number
          message?: string | null
          type?: string
        }
        Relationships: []
      }
      posts_performance: {
        Row: {
          campaign_id: string
          comments_total: number | null
          created_at: string | null
          id: string
          influencer_social_profile_id: string | null
          likes_total: number | null
          orders_total: number | null
          post_id: string
          sales_revenue: number | null
          sales_total: number | null
          updated_at: string | null
          views_total: number | null
        }
        Insert: {
          campaign_id: string
          comments_total?: number | null
          created_at?: string | null
          id?: string
          influencer_social_profile_id?: string | null
          likes_total?: number | null
          orders_total?: number | null
          post_id: string
          sales_revenue?: number | null
          sales_total?: number | null
          updated_at?: string | null
          views_total?: number | null
        }
        Update: {
          campaign_id?: string
          comments_total?: number | null
          created_at?: string | null
          id?: string
          influencer_social_profile_id?: string | null
          likes_total?: number | null
          orders_total?: number | null
          post_id?: string
          sales_revenue?: number | null
          sales_total?: number | null
          updated_at?: string | null
          views_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_performance_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_performance_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_performance_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "influencer_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sales: {
        Row: {
          amount: number
          campaign_id: string | null
          company_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          company_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      usages: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          item_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          item_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          item_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usages_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_company_member: {
        Args: {
          target_company_id: string
        }
        Returns: boolean
      }
      is_company_member_of_campaign: {
        Args: {
          target_campaign_id: string
        }
        Returns: boolean
      }
      is_relay_employee: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


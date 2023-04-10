export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
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
          interested: boolean | null
          link_url: string | null
          need_support: boolean | null
          next_step: string | null
          paid_amount_cents: number
          paid_amount_currency: string
          payment_details: string | null
          payment_status: string
          platform: string
          publication_date: string | null
          rate_cents: number
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
          interested?: boolean | null
          link_url?: string | null
          need_support?: boolean | null
          next_step?: string | null
          paid_amount_cents?: number
          paid_amount_currency?: string
          payment_details?: string | null
          payment_status?: string
          platform?: string
          publication_date?: string | null
          rate_cents?: number
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
          interested?: boolean | null
          link_url?: string | null
          need_support?: boolean | null
          next_step?: string | null
          paid_amount_cents?: number
          paid_amount_currency?: string
          payment_details?: string | null
          payment_status?: string
          platform?: string
          publication_date?: string | null
          rate_cents?: number
          rate_currency?: string
          reject_message?: string | null
          relay_creator_id?: number | null
          sample_status?: string
          status?: string | null
          tracking_details?: string | null
          updated_at?: string | null
          username?: string | null
        }
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
      }
      campaigns: {
        Row: {
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
        }
        Insert: {
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
        }
        Update: {
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
        }
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
      }
      influencer_categories: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          influencer: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          influencer?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          influencer?: string | null
        }
      }
      influencer_posts: {
        Row: {
          campaign: string | null
          comment_count: number | null
          created_at: string | null
          id: string
          influencer: string | null
          is_reusable: boolean | null
          like_count: number | null
          platform: string | null
          publish_date: string | null
          type: string | null
          updated_at: string | null
          url: string | null
          view_count: number | null
        }
        Insert: {
          campaign?: string | null
          comment_count?: number | null
          created_at?: string | null
          id?: string
          influencer?: string | null
          is_reusable?: boolean | null
          like_count?: number | null
          platform?: string | null
          publish_date?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          view_count?: number | null
        }
        Update: {
          campaign?: string | null
          comment_count?: number | null
          created_at?: string | null
          id?: string
          influencer?: string | null
          is_reusable?: boolean | null
          like_count?: number | null
          platform?: string | null
          publish_date?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          view_count?: number | null
        }
      }
      influencer_profiles: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          url?: string | null
        }
      }
      influencers: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
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
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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


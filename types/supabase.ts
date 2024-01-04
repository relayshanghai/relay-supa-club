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
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          country: string
          created_at: string
          id: string
          influencer_social_profile_id: string | null
          name: string
          phone_number: string | null
          postal_code: string
          state: string
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          country: string
          created_at?: string
          id?: string
          influencer_social_profile_id?: string | null
          name: string
          phone_number?: string | null
          postal_code: string
          state: string
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          influencer_social_profile_id?: string | null
          name?: string
          phone_number?: string | null
          postal_code?: string
          state?: string
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      boostbot_conversations: {
        Row: {
          chat_messages: Json | null
          created_at: string | null
          id: string
          profile_id: string
          search_results: Json | null
        }
        Insert: {
          chat_messages?: Json | null
          created_at?: string | null
          id?: string
          profile_id: string
          search_results?: Json | null
        }
        Update: {
          chat_messages?: Json | null
          created_at?: string | null
          id?: string
          profile_id?: string
          search_results?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "boostbot_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
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
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_influencer_social_profiles_id_fkey"
            columns: ["influencer_social_profiles_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_notes: {
        Row: {
          campaign_creator_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          important: boolean
          influencer_social_profile_id: string | null
          sequence_influencer_id: string | null
          user_id: string
        }
        Insert: {
          campaign_creator_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          important?: boolean
          influencer_social_profile_id?: string | null
          sequence_influencer_id?: string | null
          user_id: string
        }
        Update: {
          campaign_creator_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          important?: boolean
          influencer_social_profile_id?: string | null
          sequence_influencer_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_notes_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_notes_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_notes_sequence_influencer_id_fkey"
            columns: ["sequence_influencer_id"]
            isOneToOne: false
            referencedRelation: "sequence_influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
            isOneToOne: false
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
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string
          terms_accepted: boolean | null
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
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          terms_accepted?: boolean | null
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
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          terms_accepted?: boolean | null
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
          product_id: string | null
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      emails: {
        Row: {
          created_at: string | null
          data: Json
          deleted_at: string | null
          email_engine_account_id: string
          email_engine_id: string
          email_engine_message_id: string
          id: string
          recipients: string
          sender: string
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          deleted_at?: string | null
          email_engine_account_id: string
          email_engine_id: string
          email_engine_message_id: string
          id?: string
          recipients: string
          sender: string
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          deleted_at?: string | null
          email_engine_account_id?: string
          email_engine_id?: string
          email_engine_message_id?: string
          id?: string
          recipients?: string
          sender?: string
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["thread_id"]
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
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_contacts: {
        Row: {
          id: string
          influencer_id: string | null
          type: string | null
          value: string | null
        }
        Insert: {
          id: string
          influencer_id?: string | null
          type?: string | null
          value?: string | null
        }
        Update: {
          id?: string
          influencer_id?: string | null
          type?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_contacts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_posts: {
        Row: {
          campaign_id: string | null
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
          sequence_id: string | null
          sequence_influencer_id: string | null
          title: string | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          campaign_id?: string | null
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
          sequence_id?: string | null
          sequence_influencer_id?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          campaign_id?: string | null
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
          sequence_id?: string | null
          sequence_influencer_id?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_posts_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_posts_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_posts_sequence_influencer_id_fkey"
            columns: ["sequence_influencer_id"]
            isOneToOne: false
            referencedRelation: "sequence_influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_social_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          influencer_id: string
          name: string | null
          platform: string
          recent_post_title: string | null
          recent_post_url: string | null
          reference_id: string
          url: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          influencer_id: string
          name?: string | null
          platform: string
          recent_post_title?: string | null
          recent_post_url?: string | null
          reference_id: string
          url: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          influencer_id?: string
          name?: string | null
          platform?: string
          recent_post_title?: string | null
          recent_post_url?: string | null
          reference_id?: string
          url?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_social_profiles_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          payload: Json | null
          queue: string | null
          result: Json | null
          retry_count: number | null
          run_at: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner?: string | null
          payload?: Json | null
          queue?: string | null
          result?: Json | null
          retry_count?: number | null
          run_at: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          payload?: Json | null
          queue?: string | null
          result?: Json | null
          retry_count?: number | null
          run_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_performance_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_performance_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "influencer_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          price: number | null
          price_currency: string | null
          shop_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          price_currency?: string | null
          shop_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          price_currency?: string | null
          shop_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          email_engine_account_id: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          sequence_send_email: string | null
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          email_engine_account_id?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          sequence_send_email?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          email_engine_account_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          sequence_send_email?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      report_snapshots: {
        Row: {
          company_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          profile_id: string | null
          snapshot: Json
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          profile_id?: string | null
          snapshot: Json
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          profile_id?: string | null
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "report_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_snapshots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "tracking_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_snapshots_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      search_parameters: {
        Row: {
          created_at: string | null
          data: Json
          hash: string
          id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          hash: string
          id?: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          hash?: string
          id?: string
        }
        Relationships: []
      }
      search_snapshots: {
        Row: {
          company_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          parameters_id: string | null
          profile_id: string | null
          snapshot: Json
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          parameters_id?: string | null
          profile_id?: string | null
          snapshot: Json
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          parameters_id?: string | null
          profile_id?: string | null
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "search_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_snapshots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "tracking_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_snapshots_parameter_id_fkey"
            columns: ["parameters_id"]
            isOneToOne: false
            referencedRelation: "search_parameters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_snapshots_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sequence_emails: {
        Row: {
          created_at: string
          email_delivery_status: string | null
          email_engine_account_id: string | null
          email_message_id: string | null
          email_send_at: string | null
          email_tracking_status: string | null
          id: string
          job_id: string | null
          sequence_id: string | null
          sequence_influencer_id: string
          sequence_step_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_delivery_status?: string | null
          email_engine_account_id?: string | null
          email_message_id?: string | null
          email_send_at?: string | null
          email_tracking_status?: string | null
          id?: string
          job_id?: string | null
          sequence_id?: string | null
          sequence_influencer_id: string
          sequence_step_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_delivery_status?: string | null
          email_engine_account_id?: string | null
          email_message_id?: string | null
          email_send_at?: string | null
          email_tracking_status?: string | null
          id?: string
          job_id?: string | null
          sequence_id?: string | null
          sequence_influencer_id?: string
          sequence_step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequence_emails_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_emails_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_emails_sequence_influencer_id_fkey"
            columns: ["sequence_influencer_id"]
            isOneToOne: false
            referencedRelation: "sequence_influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_emails_sequence_step_id_fkey"
            columns: ["sequence_step_id"]
            isOneToOne: false
            referencedRelation: "sequence_steps"
            referencedColumns: ["id"]
          }
        ]
      }
      sequence_influencers: {
        Row: {
          added_by: string
          address_id: string | null
          avatar_url: string | null
          company_id: string
          created_at: string
          email: string | null
          funnel_status: string
          id: string
          influencer_social_profile_id: string | null
          iqdata_id: string
          name: string | null
          next_step: string | null
          platform: string | null
          rate_amount: number | null
          rate_currency: string | null
          real_full_name: string | null
          scheduled_post_date: string | null
          sequence_id: string
          sequence_step: number
          social_profile_last_fetched: string | null
          tags: string[]
          updated_at: string
          url: string | null
          username: string | null
          video_details: string | null
        }
        Insert: {
          added_by: string
          address_id?: string | null
          avatar_url?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          funnel_status: string
          id?: string
          influencer_social_profile_id?: string | null
          iqdata_id: string
          name?: string | null
          next_step?: string | null
          platform?: string | null
          rate_amount?: number | null
          rate_currency?: string | null
          real_full_name?: string | null
          scheduled_post_date?: string | null
          sequence_id: string
          sequence_step?: number
          social_profile_last_fetched?: string | null
          tags?: string[]
          updated_at?: string
          url?: string | null
          username?: string | null
          video_details?: string | null
        }
        Update: {
          added_by?: string
          address_id?: string | null
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          funnel_status?: string
          id?: string
          influencer_social_profile_id?: string | null
          iqdata_id?: string
          name?: string | null
          next_step?: string | null
          platform?: string | null
          rate_amount?: number | null
          rate_currency?: string | null
          real_full_name?: string | null
          scheduled_post_date?: string | null
          sequence_id?: string
          sequence_step?: number
          social_profile_last_fetched?: string | null
          tags?: string[]
          updated_at?: string
          url?: string | null
          username?: string | null
          video_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_influencers_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_influencers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_influencers_influencer_social_profile_id_fkey"
            columns: ["influencer_social_profile_id"]
            isOneToOne: false
            referencedRelation: "influencer_social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_influencers_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          }
        ]
      }
      sequence_steps: {
        Row: {
          created_at: string
          id: string
          name: string | null
          sequence_id: string
          step_number: number
          template_id: string
          updated_at: string
          wait_time_hours: number
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          sequence_id: string
          step_number?: number
          template_id: string
          updated_at?: string
          wait_time_hours?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          sequence_id?: string
          step_number?: number
          template_id?: string
          updated_at?: string
          wait_time_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          }
        ]
      }
      sequences: {
        Row: {
          auto_start: boolean
          company_id: string
          created_at: string
          deleted: boolean
          id: string
          manager_first_name: string | null
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          auto_start?: boolean
          company_id: string
          created_at?: string
          deleted?: boolean
          id?: string
          manager_first_name?: string | null
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          auto_start?: boolean
          company_id?: string
          created_at?: string
          deleted?: boolean
          id?: string
          manager_first_name?: string | null
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequences_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      template_variables: {
        Row: {
          created_at: string
          id: string
          key: string
          name: string
          required: boolean
          sequence_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name: string
          required?: boolean
          sequence_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name?: string
          required?: boolean
          sequence_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_variables_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          }
        ]
      }
      threads: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email_engine_account_id: string
          id: string
          last_reply_id: string | null
          sequence_influencer_id: string | null
          thread_id: string
          thread_status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email_engine_account_id: string
          id?: string
          last_reply_id?: string | null
          sequence_influencer_id?: string | null
          thread_id: string
          thread_status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email_engine_account_id?: string
          id?: string
          last_reply_id?: string | null
          sequence_influencer_id?: string | null
          thread_id?: string
          thread_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_sequence_influencer_id_fkey"
            columns: ["sequence_influencer_id"]
            isOneToOne: false
            referencedRelation: "sequence_influencers"
            referencedColumns: ["id"]
          }
        ]
      }
      tracking_events: {
        Row: {
          anonymous_id: string | null
          company_id: string | null
          created_at: string | null
          data: Json | null
          event: string
          event_at: string | null
          id: string
          journey_id: string | null
          journey_type: string | null
          profile_id: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          company_id?: string | null
          created_at?: string | null
          data?: Json | null
          event: string
          event_at?: string | null
          id?: string
          journey_id?: string | null
          journey_type?: string | null
          profile_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          company_id?: string | null
          created_at?: string | null
          data?: Json | null
          event?: string
          event_at?: string | null
          id?: string
          journey_id?: string | null
          journey_type?: string | null
          profile_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vercel_logs: {
        Row: {
          data: Json | null
          deployment_id: string | null
          id: string
          message: string | null
          source: string | null
          timestamp: string | null
          type: string | null
        }
        Insert: {
          data?: Json | null
          deployment_id?: string | null
          id: string
          message?: string | null
          source?: string | null
          timestamp?: string | null
          type?: string | null
        }
        Update: {
          data?: Json | null
          deployment_id?: string | null
          id?: string
          message?: string | null
          source?: string | null
          timestamp?: string | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      searches_per_user: {
        Row: {
          name: string | null
          searches_limit: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          website: string | null
        }
        Insert: {
          name?: string | null
          searches_limit?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          website?: string | null
        }
        Update: {
          name?: string | null
          searches_limit?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_queue_worker: {
        Args: {
          worker_name: string
          url: string
          token: string
          schedule: string
        }
        Returns: undefined
      }
      create_queue_worker_2: {
        Args: {
          worker_name: string
          url: string
          token: string
          schedule: string
        }
        Returns: undefined
      }
      fetch_email_count_per_account_by_date: {
        Args: {
          account_id: string
        }
        Returns: {
          date: string
          step_id: string
          emails_count: number
        }[]
      }
      fetch_pending_jobs: {
        Args: {
          job_queue: string
          job_status: string
          queue_limit: number
          run_time: string
        }
        Returns: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          payload: Json | null
          queue: string | null
          result: Json | null
          retry_count: number | null
          run_at: string
          status: string | null
        }[]
      }
      is_activated_account: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
      rotate_vercel_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never


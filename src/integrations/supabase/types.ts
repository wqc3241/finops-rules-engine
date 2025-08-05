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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advertised_offers: {
        Row: {
          bulletin_pricing_id: string | null
          created_at: string | null
          disclosure: string | null
          id: string
          loan_amount_per_10k: string | null
          total_cost_of_credit: string | null
        }
        Insert: {
          bulletin_pricing_id?: string | null
          created_at?: string | null
          disclosure?: string | null
          id?: string
          loan_amount_per_10k?: string | null
          total_cost_of_credit?: string | null
        }
        Update: {
          bulletin_pricing_id?: string | null
          created_at?: string | null
          disclosure?: string | null
          id?: string
          loan_amount_per_10k?: string | null
          total_cost_of_credit?: string | null
        }
        Relationships: []
      }
      app_dt_references: {
        Row: {
          application_date: string | null
          application_id: string | null
          created_at: string | null
          dt_id: string | null
          dt_portal_state: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          application_id?: string | null
          created_at?: string | null
          dt_id?: string | null
          dt_portal_state?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          application_id?: string | null
          created_at?: string | null
          dt_id?: string | null
          dt_portal_state?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_dt_references_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applicant_info: {
        Row: {
          address: string | null
          application_id: string | null
          city: string | null
          contact_number: string | null
          created_at: string | null
          dob: string | null
          email_address: string | null
          employer_name: string | null
          employment_type: string | null
          first_name: string | null
          housing_payment_amount: string | null
          id: string
          income_amount: string | null
          is_co_applicant: boolean | null
          job_title: string | null
          last_name: string | null
          middle_name: string | null
          other_income_amount: string | null
          other_source_of_income: string | null
          relationship: string | null
          residence_type: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          application_id?: string | null
          city?: string | null
          contact_number?: string | null
          created_at?: string | null
          dob?: string | null
          email_address?: string | null
          employer_name?: string | null
          employment_type?: string | null
          first_name?: string | null
          housing_payment_amount?: string | null
          id?: string
          income_amount?: string | null
          is_co_applicant?: boolean | null
          job_title?: string | null
          last_name?: string | null
          middle_name?: string | null
          other_income_amount?: string | null
          other_source_of_income?: string | null
          relationship?: string | null
          residence_type?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          application_id?: string | null
          city?: string | null
          contact_number?: string | null
          created_at?: string | null
          dob?: string | null
          email_address?: string | null
          employer_name?: string | null
          employment_type?: string | null
          first_name?: string | null
          housing_payment_amount?: string | null
          id?: string
          income_amount?: string | null
          is_co_applicant?: boolean | null
          job_title?: string | null
          last_name?: string | null
          middle_name?: string | null
          other_income_amount?: string | null
          other_source_of_income?: string | null
          relationship?: string | null
          residence_type?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_info_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_details: {
        Row: {
          application_id: string | null
          created_at: string | null
          edition: string | null
          id: string
          model: string | null
          order_number: string | null
          ordered_by: string | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          edition?: string | null
          id?: string
          model?: string | null
          order_number?: string | null
          ordered_by?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          edition?: string | null
          id?: string
          model?: string | null
          order_number?: string | null
          ordered_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_history: {
        Row: {
          action: string
          application_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          user_name: string | null
        }
        Insert: {
          action: string
          application_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          user_name?: string | null
        }
        Update: {
          action?: string
          application_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_notes: {
        Row: {
          application_id: string | null
          author: string | null
          content: string
          created_at: string | null
          date: string | null
          id: string
        }
        Insert: {
          application_id?: string | null
          author?: string | null
          content: string
          created_at?: string | null
          date?: string | null
          id?: string
        }
        Update: {
          application_id?: string | null
          author?: string | null
          content?: string
          created_at?: string | null
          date?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_notes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          id: string
          name: string
          reapplication_sequence: number | null
          reapply_enabled: boolean | null
          state: string | null
          status: Database["public"]["Enums"]["application_status"]
          type: Database["public"]["Enums"]["application_type"]
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          name: string
          reapplication_sequence?: number | null
          reapply_enabled?: boolean | null
          state?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          type: Database["public"]["Enums"]["application_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string
          reapplication_sequence?: number | null
          reapply_enabled?: boolean | null
          state?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          type?: Database["public"]["Enums"]["application_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      bulletin_pricing: {
        Row: {
          advertised: boolean | null
          created_at: string | null
          financial_program_code: string | null
          geo_code: string | null
          id: string
          lender_name: string | null
          pricing_config: string | null
          pricing_type: string | null
          pricing_value: number | null
          program_id: string | null
          upload_date: string | null
        }
        Insert: {
          advertised?: boolean | null
          created_at?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          id?: string
          lender_name?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          program_id?: string | null
          upload_date?: string | null
        }
        Update: {
          advertised?: boolean | null
          created_at?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          id?: string
          lender_name?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          program_id?: string | null
          upload_date?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          country_code: string
          country_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      credit_profiles: {
        Row: {
          created_at: string | null
          employment_type: string | null
          id: string
          max_age: number | null
          max_credit_score: number | null
          max_dti: number | null
          max_income: number | null
          max_pti: number | null
          min_age: number | null
          min_credit_score: number | null
          min_dti: number | null
          min_income: number | null
          min_pti: number | null
          priority: number | null
        }
        Insert: {
          created_at?: string | null
          employment_type?: string | null
          id?: string
          max_age?: number | null
          max_credit_score?: number | null
          max_dti?: number | null
          max_income?: number | null
          max_pti?: number | null
          min_age?: number | null
          min_credit_score?: number | null
          min_dti?: number | null
          min_income?: number | null
          min_pti?: number | null
          priority?: number | null
        }
        Update: {
          created_at?: string | null
          employment_type?: string | null
          id?: string
          max_age?: number | null
          max_credit_score?: number | null
          max_dti?: number | null
          max_income?: number | null
          max_pti?: number | null
          min_age?: number | null
          min_credit_score?: number | null
          min_dti?: number | null
          min_income?: number | null
          min_pti?: number | null
          priority?: number | null
        }
        Relationships: []
      }
      deal_stipulations: {
        Row: {
          created_at: string | null
          deal_offer_id: string | null
          description: string
          id: string
        }
        Insert: {
          created_at?: string | null
          deal_offer_id?: string | null
          description: string
          id?: string
        }
        Update: {
          created_at?: string | null
          deal_offer_id?: string | null
          description?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_stipulations_deal_offer_id_fkey"
            columns: ["deal_offer_id"]
            isOneToOne: false
            referencedRelation: "deal_structure_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_structure_offers: {
        Row: {
          created_at: string | null
          deal_structure_id: string | null
          decision: string | null
          id: string
          lender_name: string
          status: Database["public"]["Enums"]["deal_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deal_structure_id?: string | null
          decision?: string | null
          id?: string
          lender_name: string
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deal_structure_id?: string | null
          decision?: string | null
          id?: string
          lender_name?: string
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_structure_offers_deal_structure_id_fkey"
            columns: ["deal_structure_id"]
            isOneToOne: false
            referencedRelation: "deal_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_structure_parameters: {
        Row: {
          created_at: string | null
          deal_offer_id: string | null
          id: string
          parameter_key: string
          parameter_value: string | null
        }
        Insert: {
          created_at?: string | null
          deal_offer_id?: string | null
          id?: string
          parameter_key: string
          parameter_value?: string | null
        }
        Update: {
          created_at?: string | null
          deal_offer_id?: string | null
          id?: string
          parameter_key?: string
          parameter_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_structure_parameters_deal_offer_id_fkey"
            columns: ["deal_offer_id"]
            isOneToOne: false
            referencedRelation: "deal_structure_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_structures: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_structures_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          created_at: string | null
          dealer_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          dealer_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          dealer_name?: string
          id?: string
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          application_id: string | null
          category_id: string | null
          created_at: string | null
          file_url: string | null
          id: string
          name: string
          status: string | null
          uploaded_date: string | null
        }
        Insert: {
          application_id?: string | null
          category_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          name: string
          status?: string | null
          uploaded_date?: string | null
        }
        Update: {
          application_id?: string | null
          category_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          name?: string
          status?: string | null
          uploaded_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_rules: {
        Row: {
          amount: number | null
          created_at: string | null
          fee_name: string
          fee_type: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          fee_name: string
          fee_type: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          fee_name?: string
          fee_type?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      financial_products: {
        Row: {
          category: string | null
          created_at: string | null
          geo_code: string | null
          id: string
          is_active: boolean | null
          product_subtype: string | null
          product_type: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          product_subtype?: string | null
          product_type: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          product_subtype?: string | null
          product_type?: string
        }
        Relationships: []
      }
      financial_program_configs: {
        Row: {
          clone_from: string | null
          created_at: string | null
          financial_product_id: string | null
          financing_vehicle_condition: string | null
          id: string
          is_active: boolean | null
          order_types: string | null
          priority: number | null
          product_type: string | null
          program_code: string
          program_end_date: string | null
          program_start_date: string | null
          vehicle_style_id: string | null
          version: number | null
        }
        Insert: {
          clone_from?: string | null
          created_at?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: boolean | null
          order_types?: string | null
          priority?: number | null
          product_type?: string | null
          program_code: string
          program_end_date?: string | null
          program_start_date?: string | null
          vehicle_style_id?: string | null
          version?: number | null
        }
        Update: {
          clone_from?: string | null
          created_at?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: boolean | null
          order_types?: string | null
          priority?: number | null
          product_type?: string | null
          program_code?: string
          program_end_date?: string | null
          program_start_date?: string | null
          vehicle_style_id?: string | null
          version?: number | null
        }
        Relationships: []
      }
      financial_summaries: {
        Row: {
          active_tab: string | null
          application_id: string | null
          created_at: string | null
          id: string
          type: Database["public"]["Enums"]["financial_type"]
          updated_at: string | null
        }
        Insert: {
          active_tab?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          type: Database["public"]["Enums"]["financial_type"]
          updated_at?: string | null
        }
        Update: {
          active_tab?: string | null
          application_id?: string | null
          created_at?: string | null
          id?: string
          type?: Database["public"]["Enums"]["financial_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_summaries_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_summary_data: {
        Row: {
          created_at: string | null
          data_key: string
          data_value: string | null
          financial_summary_id: string | null
          id: string
          tab_type: string
        }
        Insert: {
          created_at?: string | null
          data_key: string
          data_value?: string | null
          financial_summary_id?: string | null
          id?: string
          tab_type: string
        }
        Update: {
          created_at?: string | null
          data_key?: string
          data_value?: string | null
          financial_summary_id?: string | null
          id?: string
          tab_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_summary_data_financial_summary_id_fkey"
            columns: ["financial_summary_id"]
            isOneToOne: false
            referencedRelation: "financial_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      gateways: {
        Row: {
          created_at: string | null
          gateway_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          gateway_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          gateway_name?: string
          id?: string
        }
        Relationships: []
      }
      lease_configs: {
        Row: {
          config_name: string
          created_at: string | null
          id: string
        }
        Insert: {
          config_name: string
          created_at?: string | null
          id?: string
        }
        Update: {
          config_name?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      lenders: {
        Row: {
          created_at: string | null
          id: string
          lender_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lender_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lender_name?: string
        }
        Relationships: []
      }
      location_geo: {
        Row: {
          created_at: string | null
          geo_code: string
          id: string
          location_name: string
        }
        Insert: {
          created_at?: string | null
          geo_code: string
          id?: string
          location_name: string
        }
        Update: {
          created_at?: string | null
          geo_code?: string
          id?: string
          location_name?: string
        }
        Relationships: []
      }
      order_credits_data: {
        Row: {
          created_at: string | null
          id: string
          label: string
          order_detail_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          order_detail_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          order_detail_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_credits_data_order_detail_id_fkey"
            columns: ["order_detail_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_details: {
        Row: {
          application_id: string | null
          created_at: string | null
          delivery_date: string | null
          id: string
          updated_at: string | null
          vehicle_trade_in_make: string | null
          vehicle_trade_in_mileage: string | null
          vehicle_trade_in_model: string | null
          vehicle_trade_in_value: string | null
          vehicle_trade_in_year: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          updated_at?: string | null
          vehicle_trade_in_make?: string | null
          vehicle_trade_in_mileage?: string | null
          vehicle_trade_in_model?: string | null
          vehicle_trade_in_value?: string | null
          vehicle_trade_in_year?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          updated_at?: string | null
          vehicle_trade_in_make?: string | null
          vehicle_trade_in_mileage?: string | null
          vehicle_trade_in_model?: string | null
          vehicle_trade_in_value?: string | null
          vehicle_trade_in_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_details_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      order_registration_data: {
        Row: {
          created_at: string | null
          id: string
          label: string
          order_detail_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          order_detail_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          order_detail_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_registration_data_order_detail_id_fkey"
            columns: ["order_detail_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_sale_data: {
        Row: {
          created_at: string | null
          id: string
          label: string
          order_detail_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          order_detail_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          order_detail_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_sale_data_order_detail_id_fkey"
            columns: ["order_detail_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tax_fee_data: {
        Row: {
          created_at: string | null
          id: string
          label: string
          order_detail_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          order_detail_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          order_detail_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tax_fee_data_order_detail_id_fkey"
            columns: ["order_detail_id"]
            isOneToOne: false
            referencedRelation: "order_details"
            referencedColumns: ["id"]
          },
        ]
      }
      order_types: {
        Row: {
          created_at: string | null
          id: string
          type_code: string
          type_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          type_code: string
          type_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          type_code?: string
          type_name?: string
        }
        Relationships: []
      }
      pricing_configs: {
        Row: {
          created_at: string | null
          id: string
          max_lease_mileage: number | null
          max_ltv: number | null
          max_term: number | null
          min_lease_mileage: number | null
          min_ltv: number | null
          min_term: number | null
          priority: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_lease_mileage?: number | null
          max_ltv?: number | null
          max_term?: number | null
          min_lease_mileage?: number | null
          min_ltv?: number | null
          min_term?: number | null
          priority?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_lease_mileage?: number | null
          max_ltv?: number | null
          max_term?: number | null
          min_lease_mileage?: number | null
          min_ltv?: number | null
          min_term?: number | null
          priority?: number | null
        }
        Relationships: []
      }
      pricing_types: {
        Row: {
          created_at: string | null
          id: string
          type_code: string
          type_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          type_code: string
          type_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          type_code?: string
          type_name?: string
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          created_at: string | null
          id: string
          rule_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rule_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rule_name?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          country_id: string | null
          created_at: string | null
          id: string
          state_code: string | null
          state_name: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          state_code?: string | null
          state_name: string
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          state_code?: string | null
          state_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      stipulations: {
        Row: {
          created_at: string | null
          id: string
          stipulation_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stipulation_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stipulation_name?: string
        }
        Relationships: []
      }
      tax_rules: {
        Row: {
          created_at: string | null
          geo_code: string | null
          id: string
          is_active: boolean | null
          rate: number | null
          tax_name: string
          tax_type: string
        }
        Insert: {
          created_at?: string | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          rate?: number | null
          tax_name: string
          tax_type: string
        }
        Update: {
          created_at?: string | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          rate?: number | null
          tax_name?: string
          tax_type?: string
        }
        Relationships: []
      }
      vehicle_conditions: {
        Row: {
          condition: string
          created_at: string | null
          id: string
        }
        Insert: {
          condition: string
          created_at?: string | null
          id?: string
        }
        Update: {
          condition?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      vehicle_data: {
        Row: {
          applicable_discounts: string | null
          application_id: string | null
          created_at: string | null
          gcc_cash_price: string | null
          id: string
          model: string | null
          msrp: string | null
          total_discount_amount: string | null
          trim: string | null
          updated_at: string | null
          vin: string | null
          year: string | null
        }
        Insert: {
          applicable_discounts?: string | null
          application_id?: string | null
          created_at?: string | null
          gcc_cash_price?: string | null
          id?: string
          model?: string | null
          msrp?: string | null
          total_discount_amount?: string | null
          trim?: string | null
          updated_at?: string | null
          vin?: string | null
          year?: string | null
        }
        Update: {
          applicable_discounts?: string | null
          application_id?: string | null
          created_at?: string | null
          gcc_cash_price?: string | null
          id?: string
          model?: string | null
          msrp?: string | null
          total_discount_amount?: string | null
          trim?: string | null
          updated_at?: string | null
          vin?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_data_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_options: {
        Row: {
          created_at: string | null
          id: string
          option_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_name?: string
        }
        Relationships: []
      }
      vehicle_style_coding: {
        Row: {
          code: string
          created_at: string | null
          description: string
          id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          id?: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user" | "manager"
      application_status:
        | "Pending"
        | "Submitted"
        | "Approved"
        | "Conditionally Approved"
        | "Declined"
        | "Booked"
        | "Funded"
        | "Pending Signature"
        | "Pending Reapply"
      application_type: "Lease" | "Loan"
      deal_status: "requested" | "approved" | "customer"
      financial_type: "Lease" | "Loan"
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
      app_role: ["admin", "user", "manager"],
      application_status: [
        "Pending",
        "Submitted",
        "Approved",
        "Conditionally Approved",
        "Declined",
        "Booked",
        "Funded",
        "Pending Signature",
        "Pending Reapply",
      ],
      application_type: ["Lease", "Loan"],
      deal_status: ["requested", "approved", "customer"],
      financial_type: ["Lease", "Loan"],
    },
  },
} as const

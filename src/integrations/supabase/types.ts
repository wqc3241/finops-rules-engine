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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advertised_offers: {
        Row: {
          created_at: string | null
          financial_program_code: string | null
          id: string
          is_active: boolean | null
          lender: string | null
          term: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          financial_program_code?: string | null
          id?: string
          is_active?: boolean | null
          lender?: string | null
          term?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          financial_program_code?: string | null
          id?: string
          is_active?: boolean | null
          lender?: string | null
          term?: number | null
          updated_at?: string | null
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
          bulletin_id: string
          created_by: string | null
          credit_profile: string | null
          financial_program_code: string | null
          geo_code: string | null
          lender_list: string | null
          pricing_config: string | null
          pricing_type: string | null
          pricing_value: number | null
          updated_date: string | null
          upload_date: string | null
        }
        Insert: {
          advertised?: boolean | null
          bulletin_id: string
          created_by?: string | null
          credit_profile?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          lender_list?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          updated_date?: string | null
          upload_date?: string | null
        }
        Update: {
          advertised?: boolean | null
          bulletin_id?: string
          created_by?: string | null
          credit_profile?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          lender_list?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          updated_date?: string | null
          upload_date?: string | null
        }
        Relationships: []
      }
      bulletin_upload_errors: {
        Row: {
          column_name: string | null
          created_at: string
          error_message: string
          error_type: string
          field_value: string | null
          id: string
          row_number: number | null
          session_id: string
          sheet_name: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          error_message: string
          error_type: string
          field_value?: string | null
          id?: string
          row_number?: number | null
          session_id: string
          sheet_name: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          error_message?: string
          error_type?: string
          field_value?: string | null
          id?: string
          row_number?: number | null
          session_id?: string
          sheet_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulletin_upload_errors_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "bulletin_upload_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      bulletin_upload_sessions: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          change_request_id: string | null
          created_at: string
          file_size: number
          filename: string
          id: string
          invalid_records: number | null
          program_code: string
          total_records: number | null
          updated_at: string
          upload_status: string
          uploaded_by: string | null
          valid_records: number | null
          validation_completed_at: string | null
          validation_status: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_request_id?: string | null
          created_at?: string
          file_size: number
          filename: string
          id?: string
          invalid_records?: number | null
          program_code: string
          total_records?: number | null
          updated_at?: string
          upload_status?: string
          uploaded_by?: string | null
          valid_records?: number | null
          validation_completed_at?: string | null
          validation_status?: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_request_id?: string | null
          created_at?: string
          file_size?: number
          filename?: string
          id?: string
          invalid_records?: number | null
          program_code?: string
          total_records?: number | null
          updated_at?: string
          upload_status?: string
          uploaded_by?: string | null
          valid_records?: number | null
          validation_completed_at?: string | null
          validation_status?: string
        }
        Relationships: []
      }
      change_details: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          request_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          rule_key: string
          status: Database["public"]["Enums"]["approval_status"]
          table_name: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          request_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_key: string
          status?: Database["public"]["Enums"]["approval_status"]
          table_name: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          request_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_key?: string
          status?: Database["public"]["Enums"]["approval_status"]
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_details_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      change_requests: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["approval_status"]
          submitted_at: string
          table_schema_ids: string[] | null
          version_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          table_schema_ids?: string[] | null
          version_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          table_schema_ids?: string[] | null
          version_id?: string
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
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          employment_type?: string | null
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
          profile_id: string
        }
        Update: {
          created_at?: string | null
          employment_type?: string | null
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
          profile_id?: string
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
          dba_name: string | null
          financing_form_list: string | null
          gateway_dealer_id: string | null
          gateway_entity_address: string | null
          gateway_entity_city: string | null
          gateway_entity_phone: string | null
          gateway_entity_state: string | null
          gateway_entity_zip: string | null
          gateway_id: string | null
          geo_code: string | null
          id: string
          legal_entity_address: string | null
          legal_entity_city: string | null
          legal_entity_name: string | null
          legal_entity_phone: string | null
          legal_entity_state: string | null
          legal_entity_zip: string | null
          selling_state: string | null
        }
        Insert: {
          created_at?: string | null
          dba_name?: string | null
          financing_form_list?: string | null
          gateway_dealer_id?: string | null
          gateway_entity_address?: string | null
          gateway_entity_city?: string | null
          gateway_entity_phone?: string | null
          gateway_entity_state?: string | null
          gateway_entity_zip?: string | null
          gateway_id?: string | null
          geo_code?: string | null
          id: string
          legal_entity_address?: string | null
          legal_entity_city?: string | null
          legal_entity_name?: string | null
          legal_entity_phone?: string | null
          legal_entity_state?: string | null
          legal_entity_zip?: string | null
          selling_state?: string | null
        }
        Update: {
          created_at?: string | null
          dba_name?: string | null
          financing_form_list?: string | null
          gateway_dealer_id?: string | null
          gateway_entity_address?: string | null
          gateway_entity_city?: string | null
          gateway_entity_phone?: string | null
          gateway_entity_state?: string | null
          gateway_entity_zip?: string | null
          gateway_id?: string | null
          geo_code?: string | null
          id?: string
          legal_entity_address?: string | null
          legal_entity_city?: string | null
          legal_entity_name?: string | null
          legal_entity_phone?: string | null
          legal_entity_state?: string | null
          legal_entity_zip?: string | null
          selling_state?: string | null
        }
        Relationships: []
      }
      discount_rules: {
        Row: {
          amount: number
          amount_type: Database["public"]["Enums"]["amount_type_enum"]
          auto_approval_rules: Json
          capitalize_type:
            | Database["public"]["Enums"]["capitalize_type_enum"]
            | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type_enum"]
          eligibility: Json
          end_at: string | null
          exclusive_with: string[]
          gl_code: string | null
          id: string
          is_active: boolean
          max_stackable_count: number
          name: string
          priority: number
          published_at: string | null
          published_by: string | null
          referral_registry_id: string | null
          stacking_group_id: string | null
          start_at: string
          taxable: boolean
          updated_at: string
          updated_by: string | null
          verification_modes: Database["public"]["Enums"]["verification_mode_enum"][]
          verification_required: boolean
          version: number
        }
        Insert: {
          amount: number
          amount_type: Database["public"]["Enums"]["amount_type_enum"]
          auto_approval_rules?: Json
          capitalize_type?:
            | Database["public"]["Enums"]["capitalize_type_enum"]
            | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type_enum"]
          eligibility?: Json
          end_at?: string | null
          exclusive_with?: string[]
          gl_code?: string | null
          id?: string
          is_active?: boolean
          max_stackable_count?: number
          name: string
          priority?: number
          published_at?: string | null
          published_by?: string | null
          referral_registry_id?: string | null
          stacking_group_id?: string | null
          start_at: string
          taxable?: boolean
          updated_at?: string
          updated_by?: string | null
          verification_modes?: Database["public"]["Enums"]["verification_mode_enum"][]
          verification_required?: boolean
          version?: number
        }
        Update: {
          amount?: number
          amount_type?: Database["public"]["Enums"]["amount_type_enum"]
          auto_approval_rules?: Json
          capitalize_type?:
            | Database["public"]["Enums"]["capitalize_type_enum"]
            | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type_enum"]
          eligibility?: Json
          end_at?: string | null
          exclusive_with?: string[]
          gl_code?: string | null
          id?: string
          is_active?: boolean
          max_stackable_count?: number
          name?: string
          priority?: number
          published_at?: string | null
          published_by?: string | null
          referral_registry_id?: string | null
          stacking_group_id?: string | null
          start_at?: string
          taxable?: boolean
          updated_at?: string
          updated_by?: string | null
          verification_modes?: Database["public"]["Enums"]["verification_mode_enum"][]
          verification_required?: boolean
          version?: number
        }
        Relationships: []
      }
      document_acceptable_files: {
        Row: {
          created_at: string | null
          document_type_id: string
          file_extension: string
          id: string
          max_file_size_mb: number | null
        }
        Insert: {
          created_at?: string | null
          document_type_id: string
          file_extension: string
          id?: string
          max_file_size_mb?: number | null
        }
        Update: {
          created_at?: string | null
          document_type_id?: string
          file_extension?: string
          id?: string
          max_file_size_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_acceptable_files_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_file_types: {
        Row: {
          category_id: string
          created_at: string | null
          file_extension: string
          id: string
          max_file_size_mb: number | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          file_extension: string
          id?: string
          max_file_size_mb?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          file_extension?: string
          id?: string
          max_file_size_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_file_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      document_statuses: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          is_default: boolean | null
          sort_order: number | null
          status_color: string | null
          status_name: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          sort_order?: number | null
          status_color?: string | null
          status_name: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          sort_order?: number | null
          status_color?: string | null
          status_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_statuses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          is_internal_only: boolean | null
          is_required: boolean | null
          name: string
          product_types: string[] | null
          requires_signature: boolean | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_internal_only?: boolean | null
          is_required?: boolean | null
          name: string
          product_types?: string[] | null
          requires_signature?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_internal_only?: boolean | null
          is_required?: boolean | null
          name?: string
          product_types?: string[] | null
          requires_signature?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          application_id: string | null
          category_id: string | null
          created_at: string | null
          document_type_id: string | null
          expiration_date: string | null
          file_extension: string | null
          file_name: string | null
          file_size_mb: number | null
          file_url: string | null
          id: string
          is_required: boolean | null
          last_modified: string | null
          name: string
          notes: string | null
          product_type: string | null
          requires_signature: boolean | null
          signature_status: string | null
          status: string | null
          updated_at: string | null
          uploaded_by: string | null
          uploaded_date: string | null
        }
        Insert: {
          application_id?: string | null
          category_id?: string | null
          created_at?: string | null
          document_type_id?: string | null
          expiration_date?: string | null
          file_extension?: string | null
          file_name?: string | null
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          last_modified?: string | null
          name: string
          notes?: string | null
          product_type?: string | null
          requires_signature?: boolean | null
          signature_status?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          uploaded_date?: string | null
        }
        Update: {
          application_id?: string | null
          category_id?: string | null
          created_at?: string | null
          document_type_id?: string | null
          expiration_date?: string | null
          file_extension?: string | null
          file_name?: string | null
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          last_modified?: string | null
          name?: string
          notes?: string | null
          product_type?: string | null
          requires_signature?: boolean | null
          signature_status?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          uploaded_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_rules: {
        Row: {
          __v: string | null
          _id: string
          capitalizeType: string | null
          category: string | null
          createdAt: string | null
          createdBy: string | null
          description: string | null
          endDate: string | null
          feeActive: boolean | null
          feeAmount: number | null
          feeCountry: string | null
          feeCurrency: string | null
          feeRanges: string | null
          feeRangeType: string | null
          feeState: string | null
          feeTaxable: boolean | null
          feeTaxRate: string | null
          frCaTranslation: string | null
          isDeleted: boolean | null
          isNewExperience: string | null
          migration: string | null
          name: string | null
          payType: string | null
          pricingVersion: string | null
          provider: string | null
          purchaseType_appliesToAll: boolean | null
          purchaseType_values: Json | null
          selfReg: boolean | null
          startDate: string | null
          subcategory: string | null
          titleStatus_appliesToAll: boolean | null
          titleStatus_values: Json | null
          type: string | null
          updatedAt: string | null
          updatedBy: string | null
          vehicleModel_appliesToAll: boolean | null
          vehicleModel_values: Json | null
          vehicleYear_appliesToAll: boolean | null
          vehicleYear_values: Json | null
        }
        Insert: {
          __v?: string | null
          _id: string
          capitalizeType?: string | null
          category?: string | null
          createdAt?: string | null
          createdBy?: string | null
          description?: string | null
          endDate?: string | null
          feeActive?: boolean | null
          feeAmount?: number | null
          feeCountry?: string | null
          feeCurrency?: string | null
          feeRanges?: string | null
          feeRangeType?: string | null
          feeState?: string | null
          feeTaxable?: boolean | null
          feeTaxRate?: string | null
          frCaTranslation?: string | null
          isDeleted?: boolean | null
          isNewExperience?: string | null
          migration?: string | null
          name?: string | null
          payType?: string | null
          pricingVersion?: string | null
          provider?: string | null
          purchaseType_appliesToAll?: boolean | null
          purchaseType_values?: Json | null
          selfReg?: boolean | null
          startDate?: string | null
          subcategory?: string | null
          titleStatus_appliesToAll?: boolean | null
          titleStatus_values?: Json | null
          type?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
          vehicleModel_appliesToAll?: boolean | null
          vehicleModel_values?: Json | null
          vehicleYear_appliesToAll?: boolean | null
          vehicleYear_values?: Json | null
        }
        Update: {
          __v?: string | null
          _id?: string
          capitalizeType?: string | null
          category?: string | null
          createdAt?: string | null
          createdBy?: string | null
          description?: string | null
          endDate?: string | null
          feeActive?: boolean | null
          feeAmount?: number | null
          feeCountry?: string | null
          feeCurrency?: string | null
          feeRanges?: string | null
          feeRangeType?: string | null
          feeState?: string | null
          feeTaxable?: boolean | null
          feeTaxRate?: string | null
          frCaTranslation?: string | null
          isDeleted?: boolean | null
          isNewExperience?: string | null
          migration?: string | null
          name?: string | null
          payType?: string | null
          pricingVersion?: string | null
          provider?: string | null
          purchaseType_appliesToAll?: boolean | null
          purchaseType_values?: Json | null
          selfReg?: boolean | null
          startDate?: string | null
          subcategory?: string | null
          titleStatus_appliesToAll?: boolean | null
          titleStatus_values?: Json | null
          type?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
          vehicleModel_appliesToAll?: boolean | null
          vehicleModel_values?: Json | null
          vehicleYear_appliesToAll?: boolean | null
          vehicleYear_values?: Json | null
        }
        Relationships: []
      }
      financial_products: {
        Row: {
          category: string | null
          created_at: string | null
          geo_code: string | null
          is_active: boolean | null
          product_id: string
          product_subtype: string | null
          product_type: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          geo_code?: string | null
          is_active?: boolean | null
          product_id: string
          product_subtype?: string | null
          product_type: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          geo_code?: string | null
          is_active?: boolean | null
          product_id?: string
          product_subtype?: string | null
          product_type?: string
        }
        Relationships: []
      }
      financial_program_configs: {
        Row: {
          advertised: string | null
          clone_from: string | null
          created: string | null
          created_at: string | null
          financial_product_id: string | null
          financing_vehicle_condition: string | null
          id: string
          is_active: string | null
          order_types: string | null
          priority: number | null
          product_type: string | null
          program_code: string
          program_end_date: string | null
          program_id: string | null
          program_start_date: string | null
          template_metadata: Json | null
          updated: string | null
          vehicle_style_id: string | null
          version: number | null
        }
        Insert: {
          advertised?: string | null
          clone_from?: string | null
          created?: string | null
          created_at?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: string | null
          order_types?: string | null
          priority?: number | null
          product_type?: string | null
          program_code: string
          program_end_date?: string | null
          program_id?: string | null
          program_start_date?: string | null
          template_metadata?: Json | null
          updated?: string | null
          vehicle_style_id?: string | null
          version?: number | null
        }
        Update: {
          advertised?: string | null
          clone_from?: string | null
          created?: string | null
          created_at?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: string | null
          order_types?: string | null
          priority?: number | null
          product_type?: string | null
          program_code?: string
          program_end_date?: string | null
          program_id?: string | null
          program_start_date?: string | null
          template_metadata?: Json | null
          updated?: string | null
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
          geo_code: string | null
          id: string
          platform_id: string | null
        }
        Insert: {
          created_at?: string | null
          gateway_name: string
          geo_code?: string | null
          id: string
          platform_id?: string | null
        }
        Update: {
          created_at?: string | null
          gateway_name?: string
          geo_code?: string | null
          id?: string
          platform_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gateways_geo_code_fkey"
            columns: ["geo_code"]
            isOneToOne: false
            referencedRelation: "geo_location"
            referencedColumns: ["geo_code"]
          },
        ]
      }
      geo_location: {
        Row: {
          country_code: string | null
          country_name: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          geo_code: string
          geo_level: string | null
          location_code: string | null
          location_name: string | null
          state_name: string | null
          state_or_provinces_code: string | null
        }
        Insert: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          geo_code: string
          geo_level?: string | null
          location_code?: string | null
          location_name?: string | null
          state_name?: string | null
          state_or_provinces_code?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          geo_code?: string
          geo_level?: string | null
          location_code?: string | null
          location_name?: string | null
          state_name?: string | null
          state_or_provinces_code?: string | null
        }
        Relationships: []
      }
      lease_configs: {
        Row: {
          created_at: string | null
          fee_capitalization: string | null
          "Geo Code": string | null
          id: string
          sales_tax_basis: string | null
          tax_capitalization: string | null
          tax_payment_option: string | null
          trade_on_ccr: string | null
          trade_tax_credit_eligibility: string | null
        }
        Insert: {
          created_at?: string | null
          fee_capitalization?: string | null
          "Geo Code"?: string | null
          id?: string
          sales_tax_basis?: string | null
          tax_capitalization?: string | null
          tax_payment_option?: string | null
          trade_on_ccr?: string | null
          trade_tax_credit_eligibility?: string | null
        }
        Update: {
          created_at?: string | null
          fee_capitalization?: string | null
          "Geo Code"?: string | null
          id?: string
          sales_tax_basis?: string | null
          tax_capitalization?: string | null
          tax_payment_option?: string | null
          trade_on_ccr?: string | null
          trade_tax_credit_eligibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lease_configs_geo_code_fkey"
            columns: ["Geo Code"]
            isOneToOne: false
            referencedRelation: "geo_location"
            referencedColumns: ["geo_code"]
          },
        ]
      }
      lenders: {
        Row: {
          created_at: string | null
          "Gateway lender ID": string
          gateway_lender_name: string | null
          lender_address: string | null
          lender_name: string
          lien_holder_name: string | null
        }
        Insert: {
          created_at?: string | null
          "Gateway lender ID": string
          gateway_lender_name?: string | null
          lender_address?: string | null
          lender_name: string
          lien_holder_name?: string | null
        }
        Update: {
          created_at?: string | null
          "Gateway lender ID"?: string
          gateway_lender_name?: string | null
          lender_address?: string | null
          lender_name?: string
          lien_holder_name?: string | null
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
      pending_bulletin_pricing: {
        Row: {
          advertised: boolean | null
          bulletin_id: string
          created_at: string | null
          created_by: string | null
          credit_profile: string | null
          financial_program_code: string | null
          geo_code: string | null
          id: string
          lender_list: string | null
          pricing_config: string | null
          pricing_type: string | null
          pricing_value: number | null
          session_id: string
          upload_date: string | null
        }
        Insert: {
          advertised?: boolean | null
          bulletin_id: string
          created_at?: string | null
          created_by?: string | null
          credit_profile?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          id?: string
          lender_list?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          session_id: string
          upload_date?: string | null
        }
        Update: {
          advertised?: boolean | null
          bulletin_id?: string
          created_at?: string | null
          created_by?: string | null
          credit_profile?: string | null
          financial_program_code?: string | null
          geo_code?: string | null
          id?: string
          lender_list?: string | null
          pricing_config?: string | null
          pricing_type?: string | null
          pricing_value?: number | null
          session_id?: string
          upload_date?: string | null
        }
        Relationships: []
      }
      pending_financial_program_configs: {
        Row: {
          advertised: string | null
          clone_from: string | null
          created_at: string | null
          created_by: string | null
          financial_product_id: string | null
          financing_vehicle_condition: string | null
          id: string
          is_active: string | null
          order_types: string | null
          priority: number | null
          program_code: string
          program_end_date: string | null
          program_start_date: string | null
          request_id: string
          template_metadata: Json | null
          vehicle_style_id: string | null
          version: number | null
        }
        Insert: {
          advertised?: string | null
          clone_from?: string | null
          created_at?: string | null
          created_by?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: string | null
          order_types?: string | null
          priority?: number | null
          program_code: string
          program_end_date?: string | null
          program_start_date?: string | null
          request_id: string
          template_metadata?: Json | null
          vehicle_style_id?: string | null
          version?: number | null
        }
        Update: {
          advertised?: string | null
          clone_from?: string | null
          created_at?: string | null
          created_by?: string | null
          financial_product_id?: string | null
          financing_vehicle_condition?: string | null
          id?: string
          is_active?: string | null
          order_types?: string | null
          priority?: number | null
          program_code?: string
          program_end_date?: string | null
          program_start_date?: string | null
          request_id?: string
          template_metadata?: Json | null
          vehicle_style_id?: string | null
          version?: number | null
        }
        Relationships: []
      }
      pricing_configs: {
        Row: {
          created_at: string | null
          max_lease_mileage: number | null
          max_ltv: number | null
          max_term: number | null
          min_lease_mileage: number | null
          min_ltv: number | null
          min_term: number | null
          pricing_rule_id: string
          priority: number | null
        }
        Insert: {
          created_at?: string | null
          max_lease_mileage?: number | null
          max_ltv?: number | null
          max_term?: number | null
          min_lease_mileage?: number | null
          min_ltv?: number | null
          min_term?: number | null
          pricing_rule_id: string
          priority?: number | null
        }
        Update: {
          created_at?: string | null
          max_lease_mileage?: number | null
          max_ltv?: number | null
          max_term?: number | null
          min_lease_mileage?: number | null
          min_ltv?: number | null
          min_term?: number | null
          pricing_rule_id?: string
          priority?: number | null
        }
        Relationships: []
      }
      pricing_types: {
        Row: {
          created_at: string | null
          financial_products_list: string[] | null
          id: string
          type_code: string
          type_name: string
        }
        Insert: {
          created_at?: string | null
          financial_products_list?: string[] | null
          id?: string
          type_code: string
          type_name: string
        }
        Update: {
          created_at?: string | null
          financial_products_list?: string[] | null
          id?: string
          type_code?: string
          type_name?: string
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          created_at: string | null
          credit_profile: string | null
          dealer: string | null
          financial_product: string | null
          financing_vehicle_condition_type: string | null
          geo_code: string | null
          is_active: boolean | null
          lender: string | null
          routing_priority: number | null
          rule_id: string
        }
        Insert: {
          created_at?: string | null
          credit_profile?: string | null
          dealer?: string | null
          financial_product?: string | null
          financing_vehicle_condition_type?: string | null
          geo_code?: string | null
          is_active?: boolean | null
          lender?: string | null
          routing_priority?: number | null
          rule_id: string
        }
        Update: {
          created_at?: string | null
          credit_profile?: string | null
          dealer?: string | null
          financial_product?: string | null
          financing_vehicle_condition_type?: string | null
          geo_code?: string | null
          is_active?: boolean | null
          lender?: string | null
          routing_priority?: number | null
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_rules_dealer_fkey"
            columns: ["dealer"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routing_rules_geo_code_fkey"
            columns: ["geo_code"]
            isOneToOne: false
            referencedRelation: "geo_location"
            referencedColumns: ["geo_code"]
          },
          {
            foreignKeyName: "routing_rules_lender_fkey"
            columns: ["lender"]
            isOneToOne: false
            referencedRelation: "lenders"
            referencedColumns: ["Gateway lender ID"]
          },
        ]
      }
      rule_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          rule_key: string
          table_name: string
          value: Json
          version_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          rule_key: string
          table_name: string
          value: Json
          version_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          rule_key?: string
          table_name?: string
          value?: Json
          version_id?: string
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
          customer_or_internal: string | null
          description: string | null
          document_list: string | null
          document_required: boolean | null
          geo_code: string | null
          id: string
          is_active: boolean | null
          primary_or_co_applicant: string | null
          stipulation_name: string
        }
        Insert: {
          created_at?: string | null
          customer_or_internal?: string | null
          description?: string | null
          document_list?: string | null
          document_required?: boolean | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          primary_or_co_applicant?: string | null
          stipulation_name: string
        }
        Update: {
          created_at?: string | null
          customer_or_internal?: string | null
          description?: string | null
          document_list?: string | null
          document_required?: boolean | null
          geo_code?: string | null
          id?: string
          is_active?: boolean | null
          primary_or_co_applicant?: string | null
          stipulation_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "stipulations_geo_code_fkey"
            columns: ["geo_code"]
            isOneToOne: false
            referencedRelation: "geo_location"
            referencedColumns: ["geo_code"]
          },
        ]
      }
      table_locks: {
        Row: {
          id: string
          locked_at: string
          locked_by: string
          request_id: string
          schema_id: string
        }
        Insert: {
          id?: string
          locked_at?: string
          locked_by: string
          request_id: string
          schema_id: string
        }
        Update: {
          id?: string
          locked_at?: string
          locked_by?: string
          request_id?: string
          schema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_locks_request_fk"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_locks_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "change_requests"
            referencedColumns: ["id"]
          },
        ]
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
      user_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_conditions: {
        Row: {
          advertised_condition: string | null
          applicable_rv_table: string | null
          created_at: string | null
          financing_vehicle_condition_type: string | null
          geo_code: string | null
          id: string
          max_odometer: number | null
          min_odometer: number | null
          model_year: number | null
          prior_sell_to_customer: boolean | null
          registration_end_date: string | null
          registration_start_date: string | null
          title_status: string | null
        }
        Insert: {
          advertised_condition?: string | null
          applicable_rv_table?: string | null
          created_at?: string | null
          financing_vehicle_condition_type?: string | null
          geo_code?: string | null
          id?: string
          max_odometer?: number | null
          min_odometer?: number | null
          model_year?: number | null
          prior_sell_to_customer?: boolean | null
          registration_end_date?: string | null
          registration_start_date?: string | null
          title_status?: string | null
        }
        Update: {
          advertised_condition?: string | null
          applicable_rv_table?: string | null
          created_at?: string | null
          financing_vehicle_condition_type?: string | null
          geo_code?: string | null
          id?: string
          max_odometer?: number | null
          min_odometer?: number | null
          model_year?: number | null
          prior_sell_to_customer?: boolean | null
          registration_end_date?: string | null
          registration_start_date?: string | null
          title_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_conditions_geo_code_fkey"
            columns: ["geo_code"]
            isOneToOne: false
            referencedRelation: "geo_location"
            referencedColumns: ["geo_code"]
          },
        ]
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
          adas: string | null
          code: string | null
          color: string | null
          created_at: string | null
          design: string | null
          drivetrain: string | null
          id: string
          priority: number | null
          roof: string | null
          sound_system: string | null
          wheels: string | null
        }
        Insert: {
          adas?: string | null
          code?: string | null
          color?: string | null
          created_at?: string | null
          design?: string | null
          drivetrain?: string | null
          id?: string
          priority?: number | null
          roof?: string | null
          sound_system?: string | null
          wheels?: string | null
        }
        Update: {
          adas?: string | null
          code?: string | null
          color?: string | null
          created_at?: string | null
          design?: string | null
          drivetrain?: string | null
          id?: string
          priority?: number | null
          roof?: string | null
          sound_system?: string | null
          wheels?: string | null
        }
        Relationships: []
      }
      vehicle_style_coding: {
        Row: {
          alg_code: number
          created_at: string | null
          geo_code: string | null
          make: string | null
          model: string | null
          model_year: number | null
          option_code: string | null
          priority: number | null
          trim: string | null
          vehicle_style_id: string
        }
        Insert: {
          alg_code: number
          created_at?: string | null
          geo_code?: string | null
          make?: string | null
          model?: string | null
          model_year?: number | null
          option_code?: string | null
          priority?: number | null
          trim?: string | null
          vehicle_style_id: string
        }
        Update: {
          alg_code?: number
          created_at?: string | null
          geo_code?: string | null
          make?: string | null
          model?: string | null
          model_year?: number | null
          option_code?: string | null
          priority?: number | null
          trim?: string | null
          vehicle_style_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_primary_keys: {
        Args: { table_name_param: string }
        Returns: {
          column_name: string
        }[]
      }
      get_table_columns: {
        Args: { table_name_param: string }
        Returns: {
          column_default: string
          column_name: string
          data_type: string
          is_nullable: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_fs_ops_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      amount_type_enum: "Flat" | "Percent" | "PaymentCredit"
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
      approval_status: "PENDING" | "APPROVED" | "REJECTED" | "IN_REVIEW"
      capitalize_type_enum: "CapCostReduction" | "PostTaxCredit" | "N/A"
      deal_status: "requested" | "approved" | "customer"
      discount_type_enum: "Cash" | "Lease" | "Loan"
      financial_type: "Lease" | "Loan"
      inventory_scope_enum: "InventoryVINs" | "ConfiguredBuilds" | "Both"
      user_role: "FS_OPS" | "FS_ADMIN" | "admin"
      vehicle_condition_enum: "New" | "CPO" | "Demo" | "Used"
      verification_mode_enum: "Documentation" | "ReferralCode"
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
      amount_type_enum: ["Flat", "Percent", "PaymentCredit"],
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
      approval_status: ["PENDING", "APPROVED", "REJECTED", "IN_REVIEW"],
      capitalize_type_enum: ["CapCostReduction", "PostTaxCredit", "N/A"],
      deal_status: ["requested", "approved", "customer"],
      discount_type_enum: ["Cash", "Lease", "Loan"],
      financial_type: ["Lease", "Loan"],
      inventory_scope_enum: ["InventoryVINs", "ConfiguredBuilds", "Both"],
      user_role: ["FS_OPS", "FS_ADMIN", "admin"],
      vehicle_condition_enum: ["New", "CPO", "Demo", "Used"],
      verification_mode_enum: ["Documentation", "ReferralCode"],
    },
  },
} as const

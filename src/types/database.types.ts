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
      customer_accounts: {
        Row: {
          id: string
          company_name: string
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          created_at?: string
        }
      }
      product_groups: {
        Row: {
          id: string
          customer_account_id: string | null
          name: string
          parent_id: string | null
          level: number
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          name: string
          parent_id?: string | null
          level: number
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          name?: string
          parent_id?: string | null
          level?: number
          created_at?: string
        }
      }
      catalog_items: {
        Row: {
          id: string
          customer_account_id: string | null
          product_group_id: string | null
          internal_sku: string
          pricing_basis_code: string
          title_he: string
          title_en: string
          category: string
          description: string | null
          image_urls: string[] | null
          currency_code: string
          supplier_lead_time_days: number | null
          top_picks: boolean
          is_active: boolean
          attributes: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          product_group_id?: string | null
          internal_sku: string
          pricing_basis_code?: string
          title_he: string
          title_en: string
          category: string
          description?: string | null
          image_urls?: string[] | null
          currency_code?: string
          supplier_lead_time_days?: number | null
          top_picks?: boolean
          is_active?: boolean
          attributes?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          product_group_id?: string | null
          internal_sku?: string
          pricing_basis_code?: string
          title_he?: string
          title_en?: string
          category?: string
          description?: string | null
          image_urls?: string[] | null
          currency_code?: string
          supplier_lead_time_days?: number | null
          top_picks?: boolean
          is_active?: boolean
          attributes?: Json | null
          created_at?: string
        }
      }
      product_variations: {
        Row: {
          id: string
          customer_account_id: string | null
          catalog_item_id: string | null
          variation_type: string
          value: string
          cost_modifier: number
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          catalog_item_id?: string | null
          variation_type: string
          value: string
          cost_modifier?: number
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          catalog_item_id?: string | null
          variation_type?: string
          value?: string
          cost_modifier?: number
          created_at?: string
        }
      }
      catalog_item_tags: {
        Row: {
          id: string
          customer_account_id: string | null
          catalog_item_id: string | null
          tag_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          catalog_item_id?: string | null
          tag_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          catalog_item_id?: string | null
          tag_id?: string | null
          created_at?: string
        }
      }
      tag_library: {
        Row: {
          id: string
          code: string
          name_he: string
          name_en: string
          tier: string
          domain: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name_he: string
          name_en: string
          tier: string
          domain?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name_he?: string
          name_en?: string
          tier?: string
          domain?: string | null
          created_at?: string
        }
      }
      price_lists: {
        Row: {
          id: string
          customer_account_id: string | null
          code: string
          name: string
          currency: string
          valid_from: string
          valid_to: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          code: string
          name: string
          currency?: string
          valid_from?: string
          valid_to?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          code?: string
          name?: string
          currency?: string
          valid_from?: string
          valid_to?: string
          is_active?: boolean
          created_at?: string
        }
      }
      price_list_lines: {
        Row: {
          id: string
          customer_account_id: string | null
          price_list_id: string | null
          unit_id: string | null
          min_quantity: number
          max_quantity: number | null
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          customer_account_id?: string | null
          price_list_id?: string | null
          unit_id?: string | null
          min_quantity: number
          max_quantity?: number | null
          unit_price: number
          created_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string | null
          price_list_id?: string | null
          unit_id?: string | null
          min_quantity?: number
          max_quantity?: number | null
          unit_price?: number
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          customer_account_id: string
          counterparty_id: string | null
          owner_user_id: string | null
          team_id: string | null
          reference: string | null
          title: string
          description: string | null
          status_code: string
          attributes: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_account_id: string
          counterparty_id?: string | null
          owner_user_id?: string | null
          team_id?: string | null
          reference?: string | null
          title: string
          description?: string | null
          status_code?: string
          attributes?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string
          counterparty_id?: string | null
          owner_user_id?: string | null
          team_id?: string | null
          reference?: string | null
          title?: string
          description?: string | null
          status_code?: string
          attributes?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          customer_account_id: string
          inquiry_id: string
          reference: string | null
          status_code: string
          currency: string
          version: number
          fx_mode: string | null
          fx_rate: number | null
          fx_rate_date: string | null
          subtotal: number | null
          total: number | null
          valid_until: string | null
          issued_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_account_id: string
          inquiry_id: string
          reference?: string | null
          status_code?: string
          currency: string
          version?: number
          fx_mode?: string | null
          fx_rate?: number | null
          fx_rate_date?: string | null
          subtotal?: number | null
          total?: number | null
          valid_until?: string | null
          issued_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_account_id?: string
          inquiry_id?: string
          reference?: string | null
          status_code?: string
          currency?: string
          version?: number
          fx_mode?: string | null
          fx_rate?: number | null
          fx_rate_date?: string | null
          subtotal?: number | null
          total?: number | null
          valid_until?: string | null
          issued_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_lines: {
        Row: {
          id: string
          customer_account_id: string
          quote_id: string
          unit_id: string | null
          supply_offer_id: string | null
          description: string | null
          sort_order: number
          quantity: number
          unit_price: number
          line_total: number
          cost_breakdown: Json
          attributes: Json
        }
        Insert: {
          id?: string
          customer_account_id: string
          quote_id: string
          unit_id?: string | null
          supply_offer_id?: string | null
          description?: string | null
          sort_order?: number
          quantity: number
          unit_price: number
          line_total: number
          cost_breakdown?: Json
          attributes?: Json
        }
        Update: {
          id?: string
          customer_account_id?: string
          quote_id?: string
          unit_id?: string | null
          supply_offer_id?: string | null
          description?: string | null
          sort_order?: number
          quantity?: number
          unit_price?: number
          line_total?: number
          cost_breakdown?: Json
          attributes?: Json
        }
      }
      navigation_menu_items: {
        Row: {
          id: string
          title_en: string
          title_he: string
          route: string
          icon: string
          allowed_roles: string[]
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title_en: string
          title_he: string
          route: string
          icon: string
          allowed_roles: string[]
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          title_en?: string
          title_he?: string
          route?: string
          icon?: string
          allowed_roles?: string[]
          display_order?: number
          created_at?: string
        }
      }
    }
  }
}

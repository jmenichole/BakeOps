export interface CakeConfig {
    productType: string;
    flavor: string;
    filling: string;
    tiers?: number;
    quantity?: number;
    addOns?: string[];
    style?: string;
    colors?: string[];
}

export interface CakeDesign {
    id?: string;
    title: string;
    image_url: string | null;
    description?: string | null;
    configuration_data?: CakeConfig;
    estimated_price?: number;
}

export interface Order {
    id: string;
    customer_name: string | null;
    customer_email: string;
    customer_phone?: string | null;
    total_price: number;
    deposit_paid: number;
    delivery_date: string | null;
    notes: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    is_paid?: boolean;
    cake_designs?: CakeDesign | null;
}

export interface Baker {
    id: string;
    business_name: string | null;
    referral_code?: string | null;
    email_leads: boolean;
    order_updates: boolean;
    updated_at: string;
    zip_code?: string | null;
    role?: 'baker' | 'admin';
    is_premium?: boolean;
    email?: string;
}

export interface PrepTask {
    id: string;
    order_id?: string | null;
    baker_id: string;
    title: string;
    description: string | null;
    category: 'baking' | 'filling' | 'coating' | 'fondant' | 'decorating' | 'packing' | 'delivery' | 'Other' | 'Assembly' | 'Decoration' | 'Packaging';
    status: 'todo' | 'in_progress' | 'completed';
    scheduled_for: string;
    estimated_minutes?: number;
    created_at: string;
    updated_at: string;
}

export interface AnalyticsEvent {
    id: string;
    user_id?: string | null;
    event_type: string;
    page_path?: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}


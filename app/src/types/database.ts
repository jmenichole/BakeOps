export interface CakeDesign {
    id?: string;
    title: string;
    image_url: string | null;
    description?: string | null;
    configuration_data?: any;
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
    status: string;
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
}

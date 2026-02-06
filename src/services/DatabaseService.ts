import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseService {
    private supabase: SupabaseClient | null = null;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url') {
            this.supabase = createClient(supabaseUrl, supabaseKey);
        } else {
            console.warn('⚠️ Supabase credentials missing or default. DB features will be disabled.');
        }
    }

    public async getProductCatalogue(category: string): Promise<any[]> {
        if (!this.supabase) return [];

        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .ilike('category', `%${category}%`);

        if (error) {
            console.error('DB Error (getProducts):', error);
            return [];
        }
        return data || [];
    }

    public async getOrderStatus(orderId: string): Promise<string | null> {
        if (!this.supabase) return null;

        // Assuming orderId is the UUID or a readable ID in the 'orders' table
        const { data, error } = await this.supabase
            .from('orders')
            .select('status, created_at')
            .eq('id', orderId) // or .eq('readable_id', orderId)
            .single();

        if (error) {
            console.error('DB Error (getOrderStatus):', error);
            return null;
        }

        return data ? `Order #${orderId} is currently: *${data.status}* (Placed on: ${new Date(data.created_at).toLocaleDateString()})` : null;
    }
}

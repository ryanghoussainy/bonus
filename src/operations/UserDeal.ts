import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export type UserDeal_t = {
    id: string;
    name: string;
    description: string;
    location: string;
    type: number;
    percentage: number;
    start_time: string;
    end_time: string;
    end_date: string;
    days: string;
    max_pts?: number;
    user_deal_id: string;
}

export async function getUserDeals(session: Session, setDeals: (deals: UserDeal_t[]) => void) {
    try {
        // Get user_id
        const user_id = session.user?.id;
        if (!user_id) throw new Error('No user on the session!');
        
        // Get user_deals for this user
        const { data: user_deals, error } = await supabase
            .from('user_deals')
            .select('id, user_id, deal_id, points')
            .eq('user_id', user_id);

        if (error) throw error;

        // Get deals from these user_deals
        const deals: UserDeal_t[] = [];
        for (const user_deal of user_deals) {
            const { data: deal, error } = await supabase
                .from('deals')
                .select('id, description, type, percentage, start_time, end_time, end_date, days, max_pts')
                .eq('id', user_deal.deal_id)
                .single();

            if (error) throw error;

            // Get shop_user_id
            const { data, error: deal_error } = await supabase
                .from('deals')
                .select('shop_user_id')
                .eq('id', user_deal.deal_id)
                .single();
            
            const shop_user_id = data?.shop_user_id;

            if (deal_error) throw deal_error;

            // Get shop name and location 
            const { data: shop, error: shop_error } = await supabase
                .from('shop_profiles')
                .select('name, location')
                .eq('id', shop_user_id)
                .single();

            if (shop_error) throw shop_error;

            if (deal && shop) {
                deals.push({
                     ...deal,
                     user_deal_id: user_deal.id,
                     name: shop.name,
                     location: shop.location
                });
            }
        }

        if (deals) {
            setDeals(deals);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

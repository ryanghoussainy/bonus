import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export type UserDeal_t = {
    id: string;
    user_deal_id: string;
    name: string;
    location: string;
    description: string;
    discountType: number;
    discount: number;
    endDate: string | null;
    maxPoints: number | null;
    discountTimes: {
        mon_start: string;
        mon_end: string;
        tue_start: string;
        tue_end: string;
        wed_start: string;
        wed_end: string;
        thu_start: string;
        thu_end: string;
        fri_start: string;
        fri_end: string;
        sat_start: string;
        sat_end: string;
        sun_start: string;
        sun_end: string;
    };
}

export async function getUserDeals(session: Session, setDeals: (deals: UserDeal_t[]) => void) {
    try {
        // Get user_id
        const userID = session.user?.id;
        if (!userID) throw new Error('No user on the session!');
        
        // Get user deals for this user
        const { data: userDeals, error } = await supabase
            .from('user_deals')
            .select('id, user_id, deal_id, points')
            .eq('user_id', userID);

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Get deals from these user deals
        const deals: UserDeal_t[] = [];
        for (const userDeal of userDeals) {
            const { data: deal, error } = await supabase
                .from('deals')
                .select('id, description, type, percentage, end_date, max_pts, deal_times_id, shop_user_id')
                .eq('id', userDeal.deal_id)
                .single();

            if (error) {
                Alert.alert(error.message);
                return;
            }
            
            const shopUserID = deal?.shop_user_id;

            // Get shop name and location 
            const { data: shop, error: shopError } = await supabase
                .from('shop_profiles')
                .select('name, location')
                .eq('id', shopUserID)
                .single();

            if (shopError) {
                Alert.alert(shopError.message);
                return;
            }

            // Get discount times
            const dealTimesID = deal?.deal_times_id;
            const { data: discountTimes, error: discountTimesError } = await supabase
                .from('deal_times')
                .select('mon_start, mon_end, \
                        tue_start, tue_end, \
                        wed_start, wed_end, \
                        thu_start, thu_end, \
                        fri_start, fri_end, \
                        sat_start, sat_end, \
                        sun_start, sun_end')
                .eq('id', dealTimesID)
                .single();

            if (discountTimesError) {
                Alert.alert(discountTimesError.message);
                return;
            }

            if (deal && shop) {
                deals.push({
                    id: deal.id,
                    user_deal_id: userDeal.id,
                    name: shop.name,
                    location: shop.location,
                    description: deal.description,
                    discountType: deal.type,
                    discount: deal.percentage,
                    endDate: deal.end_date,
                    maxPoints: deal.max_pts,
                    discountTimes,
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

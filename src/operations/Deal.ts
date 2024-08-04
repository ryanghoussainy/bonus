import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

export type Deal_t = {
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
}

export async function getDeals(setDeals: (deals: Deal_t[]) => void) {
    try {
        const { data: deals, error } = await supabase
            .from('deals')
            .select('name, description, location, type, percentage, start_time, end_time, end_date, days, max_pts');

        if (error) throw error;

        if (deals) {
            setDeals(deals);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

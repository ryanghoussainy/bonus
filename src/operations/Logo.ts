import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getLogoPath(
    deal_id: string,
    setUrl: (logoUrl: string) => void,
) {
    try {
        // Get shop user id
        const { data, error } = await supabase
            .from('deals')
            .select('shop_user_id')
            .eq('id', deal_id)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Get logo url
        const shop_user_id = data?.shop_user_id;
        const { data: logo, error: logo_error } = await supabase
            .from('shop_profiles')
            .select('logo_url')
            .eq('id', shop_user_id)
            .single();

        if (logo_error) {
            Alert.alert(logo_error.message);
            return;
        }

        if (logo) {
            setUrl(logo.logo_url);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

export async function getLogo(path: string, setLogoUrl: (logoUrl: string) => void) {
    try {
      const { data, error } = await supabase.storage.from('logos').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setLogoUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    }
  }

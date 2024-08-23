import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getLogoPath(
    dealID: string,
    setUrl: (logoUrl: string) => void,
) {
    try {
        // Get shop user id
        const { data, error } = await supabase
            .from('deals')
            .select('shop_user_id')
            .eq('id', dealID)
            .single();

        if (error) {
            Alert.alert(error.message);
            return;
        }

        // Get logo url
        const shopUserID = data?.shop_user_id;
        const { data: logo, error: logoError } = await supabase
            .from('shop_profiles')
            .select('logo_url')
            .eq('id', shopUserID)
            .single();

        if (logoError) {
            Alert.alert(logoError.message);
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

export async function getLogo(path: string, setLogoUrl?: (logoUrl: string) => void): Promise<string> {
  try {
    const { data, error } = await supabase.storage.from('logos').download(path);

    if (error) {
      Alert.alert(error.message);
      return "";
    }

    return new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        const logoUrl = fr.result as string;
        if (setLogoUrl) setLogoUrl(logoUrl);
        resolve(logoUrl);
      };
      fr.onerror = () => {
        resolve("");
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return "";
  }
}

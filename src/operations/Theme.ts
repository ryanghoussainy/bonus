import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Theme_t } from "../contexts/ThemeContext";
import { Session } from "@supabase/supabase-js";


export async function getTheme(
    session: Session,
    setTheme: (theme: Theme_t) => void
) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('theme')
            .eq('id', session.user.id)

        if (error) {
            Alert.alert(error.message);
            return;
        }

        if (data && data.length > 0) {
            setTheme(data[0].theme);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

export async function updateTheme(
    session: Session,
    theme: Theme_t
) {
    try {
        const updates = {
            id: session.user.id,
            theme: theme,
        };

        supabase.from('profiles').upsert(updates).then(({ error }) => {
            if (error) {
                Alert.alert(error.message);
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

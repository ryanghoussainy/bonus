import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Alert, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import Colours from "../config/Colours";
import MainTabNavigator from "./MainTabNavigator";
import { UserDeal_t } from "../operations/UserDeal";
import DealScreen from "../screens/DealScreen";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Account from "../screens/settingsScreens/Account";
import General from "../screens/settingsScreens/General";
import { useTheme } from "../contexts/ThemeContext";

export type RootStackParamList = {
  "Main": { session: Session };
  "Deal": { deal: UserDeal_t };
  "Account": undefined;
  "General": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = ({ session }: { session: Session }) => {
  const { theme } = useTheme(); // Get the current theme
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert(error.message);
        setLoading(false);
        return;
      }

      if (user) {
        const role = user.user.user_metadata.role;

        if (role !== '0') {
          // Sign out and alert the user
          await supabase.auth.signOut();
          Alert.alert('The login details you entered are not for this app.', 'Please sign in with the correct details.');
        } else {
          // User is authorized
          setLoading(false);
        }
      }
    };
    checkUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colours.background[theme] }}>
        <ActivityIndicator size="large" color={Colours.primary[theme]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colours.background[theme] },
          headerTitleStyle: { color: Colours.text[theme], fontWeight: "bold", fontSize: 25 },
          headerTintColor: Colours.text[theme],
        }}
      >
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <MainTabNavigator key={session.user.id} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Deal" options={{ headerShown: false, animation: 'fade_from_bottom' }}>
          {() => <DealScreen session={session} />}
        </Stack.Screen>

        {/* Settings screens */}
        <Stack.Screen name="Account" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <Account session={session} />}
        </Stack.Screen>
        <Stack.Screen name="General" options={{ headerShown: false, animation: 'slide_from_right' }}>
          {() => <General session={session} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

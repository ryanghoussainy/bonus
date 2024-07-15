import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotImplemented from "../screens/NotImplemented";
import { StyleSheet } from "react-native";
import { Session } from "@supabase/supabase-js";
import colours from "../config/Colours";
import MainTabNavigator from "./MainTabNavigator";
import { Deal_t } from "../operations/Deal";

export type RootStackParamList = {
    "BONUS Deals": { session: Session };
    "Deal": { deal: Deal_t };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = ({ session }: { session: Session }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
            headerStyle: styles.navigation,
            headerTitleStyle: styles.title,
            headerTintColor: colours.text[colours.theme],
        }}
      >
        <Stack.Screen name="BONUS Deals">
            {() => <MainTabNavigator key={session.user.id} session={session} />}
        </Stack.Screen>
        <Stack.Screen name="Deal" component={NotImplemented} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navigation: {
    backgroundColor: colours.background[colours.theme],
  },
  title: {
    color: colours.text[colours.theme],
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default Navigator;

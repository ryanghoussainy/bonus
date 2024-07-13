import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import NotImplemented from "../NotImplemented";
import HomeScreen from "../HomeScreen";
import colours from "../config/Colours";
import { Session } from "@supabase/supabase-js";
import Account from "../Account";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ session }: { session: Session }) {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colours.green[colours.theme],
        })}
      />

      <Tab.Screen
        name="Settings"
        options={() => ({
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={30} color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colours.green[colours.theme],
        })}
      >
        {() => <Account session={session} />}
    </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colours.dealItem[colours.theme],
    borderTopWidth: 0,
  },
});

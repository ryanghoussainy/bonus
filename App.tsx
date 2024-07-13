import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './src/Auth'
import Account from './src/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { StatusBar } from 'expo-status-bar'
import colours from './config/Colours'
import MainTabNavigator from './navigation/MainTabNavigator'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar style={colours.theme ? "light" : "dark"} backgroundColor={colours.background[colours.theme]} />
        {session && session.user ? <MainTabNavigator key={session.user.id} session={session} /> : <Auth />}
      </View>
    </NavigationContainer>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/screens/Auth'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { StatusBar } from 'expo-status-bar'
import colours from './src/config/Colours'
import Navigator from './src/navigation/StackNavigator'

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
    <View style={{ flex: 1 }}>
      <StatusBar style={colours.theme ? "light" : "dark"} backgroundColor={colours.background[colours.theme]} />
      {session && session.user ? <Navigator key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}

import { useState } from 'react'
import { Alert, View, AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { useTheme } from '../contexts/ThemeContext'
import Colours from '../config/Colours'
import { createUser } from '../operations/User'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme() // Get the current theme

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={{ marginTop: 30, padding: 12, backgroundColor: Colours.background[theme], flex: 1 }}>
      <View style={{ paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch', marginTop: 20 }}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: Colours.text[theme] }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          style={{ color: Colours.text[theme] }}
          disabled={loading}
        />
      </View>
      <View style={{ paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch' }}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock', color: Colours.text[theme], size: 30 }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          style={{ color: Colours.text[theme] }}
          disabled={loading}
        />
      </View>
      <View style={{ paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch', marginTop: 20 }}>
        <Button
          title="Log in"
          disabled={loading}
          onPress={() => signInWithEmail()}
          buttonStyle={{ backgroundColor: Colours.primary }}
        />
      </View>
      <View style={{ paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch' }}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => createUser(email, password, setLoading)}
          buttonStyle={{ backgroundColor: Colours.primary }}
        />
      </View>
    </View>
  )
}

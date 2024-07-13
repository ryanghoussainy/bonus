import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { getUser, updateUser } from './operations/User'
import colours from "./config/Colours"

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    if (session) getUser(session, setLoading, setName)
  }, [session])

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>
        Account
      </Text>

      <View style={styles.miniDivider} />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input 
          label="Email" 
          value={session?.user?.email} 
          disabled 
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input 
          label="First Name" 
          value={name || ''} 
          onChangeText={(text) => setName(text)}
          style={styles.input} 
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateUser(session, name, setLoading)}
          disabled={loading}
          color={colours.green[colours.theme]}
        />
      </View>

      <View style={styles.signOutSection}>
        <Text style={styles.h2}>
          Sign Out
        </Text>

        <View style={styles.miniDivider} />

        <View style={styles.verticallySpaced}>
          <Button 
            title="Sign Out" 
            onPress={() => supabase.auth.signOut()} 
            color={colours.red[colours.theme]}
          />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 12,
    backgroundColor: colours.background[colours.theme],
    flex: 1,
  },
  signOutSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colours.grey[colours.theme],
    marginTop: 15,
    paddingTop: 15,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  input: {
    color: colours.text[colours.theme]
  },
  mt20: {
    marginTop: 20,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colours.text[colours.theme],
    alignSelf: "center",
  },
  miniDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colours.green[colours.theme],
    width: "20%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 2,
  }
})

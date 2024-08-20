import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { getUser, updateUser } from '../operations/User'
import Colours from "../config/Colours"
import Fonts from '../config/Fonts'
import DeleteUserWarning from '../components/DeleteUserWarning'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [deleteUserWarning, setDeleteUserWarning] = useState(false)

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
          disabled={loading || deleteUserWarning}
          onEndEditing={() => getUser(session, setLoading, setName)}
          rightIcon={{ type: 'font-awesome', name: 'pencil', color: Colours.text[Colours.theme] }}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateUser(session, name, setLoading)}
          color={Colours.primary[Colours.theme]}
          disabled={loading}
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
            color={Colours.primary[Colours.theme]}
            disabled={loading}
          />
        </View>
      </View>

      <View style={styles.signOutSection}>
        <Text style={styles.h2}>
          Delete Account
        </Text>

        <View style={styles.miniDivider}></View>

        <View style={styles.verticallySpaced}>
          <Button
            title="Delete Account"
            onPress={() => setDeleteUserWarning(true)}
            color={Colours.primary[Colours.theme]}
            disabled={loading}
          />
        </View>
      </View>

      {
        /* Delete User Warning */
        deleteUserWarning &&
        <DeleteUserWarning
          session={session}
          loading={loading}
          setLoading={setLoading}
          setDeleteUserWarning={setDeleteUserWarning}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colours.background[Colours.theme],
    flex: 1,
  },
  signOutSection: {
    borderTopWidth: 1,
    borderTopColor: Colours.grey[Colours.theme],
    marginTop: 15,
    paddingTop: 15,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  input: {
    color: Colours.text[Colours.theme],
    fontFamily: Fonts.condensed,
  },
  mt20: {
    marginTop: 20,
  },
  h2: {
    fontSize: 23,
    fontWeight: 'bold',
    color: Colours.text[Colours.theme],
    alignSelf: "center",
    fontFamily: Fonts.condensed,
  },
  miniDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colours.primary[Colours.theme],
    width: "20%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 2,
  },
})

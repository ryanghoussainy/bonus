import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { getUser, updateUser, deleteUser } from '../operations/User'
import Colours from "../config/Colours"
import Fonts from '../config/Fonts'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')  
  const [deleteUserWarning, setDeleteUserWarning] = useState(false)
  const [deleteUserEmail, setDeleteUserEmail] = useState('')
  const [enableDeleteUser, setEnableDeleteUser] = useState(false)

  useEffect(() => {
    if (session) getUser(session, setLoading, setName)
  }, [session])

  useEffect(() => {
    if (deleteUserEmail === session?.user?.email) setEnableDeleteUser(true)
    else setEnableDeleteUser(false)
  }, [deleteUserEmail])

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
          rightIcon={{ type: 'font-awesome', name: 'pencil', color: Colours.text[Colours.theme] }}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateUser(session, name, setLoading)}
          color={Colours.green[Colours.theme]}
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
            color={Colours.red[Colours.theme]}
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
            color={Colours.red[Colours.theme]}
            disabled={loading}
          />
        </View>
      </View>

      {
        /* Delete User Warning */
        deleteUserWarning ? 
        <View style={styles.darkBackground}>
          <View style={styles.deleteUserWarning}>
            <Text style={styles.h2}>WARNING!!</Text>
            <Text style={styles.input}>
              You are deleting your account. If you are sure this is what you want, please enter your email.
            </Text>
            <Input
              label="Email"
              style={styles.input}
              onChangeText={(text) => setDeleteUserEmail(text)}
            />
            <Button 
              title="Cancel" 
              onPress={() => setDeleteUserWarning(false)} 
              color={Colours.green[Colours.theme]}
              disabled={loading}
            />
            <Button 
              title="Delete Account" 
              onPress={() => deleteUser(session, setLoading)} 
              color={Colours.red[Colours.theme]}
              disabled={loading || !enableDeleteUser}
            />
          </View>
        </View>
        : null
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
    borderBottomColor: Colours.green[Colours.theme],
    width: "20%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 2,
  },
  darkBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 100,
  },
  deleteUserWarning: {
    position: "absolute",
    alignSelf: "center",
    top: "30%",
    backgroundColor: Colours.dealItem[Colours.theme],
    display: "flex",
    width: "85%",
    padding: 10,
  }
})

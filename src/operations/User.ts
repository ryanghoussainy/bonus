import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'

/*
Get the user's name.
*/
export async function getUser(session: Session, setLoading: (loading: boolean) => void, setName: (name: string) => void) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`name`)
      .eq('id', session?.user.id)
      .single()
    if (error && status !== 406) {
      throw error
    }

    if (data) {
      setName(data.name)
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message)
    }
  } finally {
    setLoading(false)
  }
}

/*
Update the user's name.
*/
export async function updateUser(session: Session, name: string, setLoading: (loading: boolean) => void) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const updates = {
      id: session?.user.id,
      name,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      throw error
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message)
    }
  } finally {
    setLoading(false)
  }
}

/*
Remove the user completely.
*/
export async function deleteUser(
  session: Session,
  setLoading: (loading: boolean) => void
) {
  if (!session?.user) {
    throw new Error('No user on the session!')
  }

  try {
    // Delete the auth user from the database
    await supabase.functions.invoke('user-self-deletion')
    alert('Account deleted successfully!')
  } catch (error) {
    alert('Error deleting the account!')
    console.log(error)
  } finally {
    setLoading(false)
    // Force sign out after deleting the account
    await supabase.auth.signOut()
  }
}

export async function createUser(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
) {
  // Sign up with email and password
  setLoading(true)
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { role: '0' }
    }
  })

  if (error) {
    Alert.alert(error.message)
    setLoading(false)
    return
  }
  if (!session) {
    Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
    return
  }

  // A profile is automatically created for the user via a trigger in the backend
  // Get the user id
  const user_id = session.user.id
  // Fetch all deals
  const { data: deals, error: dealsError } = await supabase.from('deals').select('id')
  if (dealsError) {
    Alert.alert(dealsError.message)
    setLoading(false)
    return
  }
  // For each deal, create a new row in the user_deals table
  for (const deal of deals) {
    const { error } = await supabase.from('user_deals').upsert({
      user_id: user_id,
      deal_id: deal.id,
      points: 0,
      redeemed_days: [],
    })
    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }
  }

  setLoading(false)
}

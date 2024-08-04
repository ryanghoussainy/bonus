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
  setLoading: (loading: boolean) => void,
  setIsModalOpen: (isOpen: boolean) => void
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
    setIsModalOpen(false)
    // Force sign out after deleting the account
    await supabase.auth.signOut()
  }
}

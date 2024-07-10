import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'

export async function getUser(session: Session, setLoading: (loading: boolean) => void, setName: (name: string) => void) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const { data, error, status } = await supabase
      .from('users')
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

export async function updateUser(session: Session, name: string, setLoading: (loading: boolean) => void) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const updates = {
      id: session?.user.id,
      name,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('users').upsert(updates)

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

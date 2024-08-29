import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'

/*
Get the user's details.
*/
export async function getUser(
  session: Session,
  setFirstName: (firstName: string) => void,
  setSurname: (surname: string) => void,
  setMobileNumber: (mobileNumber: string) => void,
  setLoading: (loading: boolean) => void,
) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`first_name, surname, mobile_number`)
      .eq('id', session?.user.id)
      .single()
    if (error && status !== 406) {
      throw error
    }

    if (data) {
      setFirstName(data.first_name)
      setSurname(data.surname)
      setMobileNumber(data.mobile_number)
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
export async function updateUser(
  session: Session,
  firstName: string,
  surname: string,
  mobileNumber: string,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true)
    if (!session?.user) throw new Error('No user on the session!')

    const updates = {
      id: session?.user.id,
      updated_at: new Date(),
      first_name: firstName,
      surname: surname,
      mobile_number: mobileNumber,
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      Alert.alert(error.message);
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
    setLoading(true);
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
  firstName: string,
  surname: string,
  mobileNumber: string,
  preferredTheme: string,
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
  const userID = session.user.id
  // Fetch all deals
  const { data: deals, error: dealsError } = await supabase.from('deals').select('id, type')
  if (dealsError) {
    Alert.alert(dealsError.message)
    setLoading(false)
    return
  }
  // For each deal, create a new row in the user deals table
  for (const deal of deals) {
    const { error } = await supabase.from('user_deals').upsert({
      user_id: userID,
      deal_id: deal.id,
      points: deal.type === 0 ? 0 : null,
      redeemed_days: deal.type === 0 ? [] : null,
    })
    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }
  }

  // The profile is created by a trigger in the backend, so we need to wait for it to be created
  let profileCreated = false
  while (!profileCreated) {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('id').eq('id', userID).single()
    if (profileError) {
      Alert.alert(profileError.message)
      setLoading(false)
      return
    }
    if (profile) {
      profileCreated = true
    }
  }

  // Insert the user's details
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userID,
    updated_at: new Date(),
    first_name: firstName,
    surname: surname,
    mobile_number: mobileNumber,
    theme: preferredTheme,
  })

  if (profileError) {
    Alert.alert(profileError.message)
    setLoading(false)
    return
  }

  setLoading(false)
}

export async function confirmPassword(session: Session, password: string) {
  try {
    if (!session?.user) {
      Alert.alert('User not logged in');
      return false;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: session.user.email || "",
      password: password,
    });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
};

export async function checkValidUser(
  userID: string,
) {
  // Get user
  const { error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userID)
      .single();

  if (error) {
      Alert.alert("Invalid user ID", error.message);
      return false;
  }

  return true;
}

import { useCallback, useState } from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import { UserDeal_t, getUserDeals } from '../operations/UserDeal'
import Deal from '../components/Deal'
import Colours from '../config/Colours'
import { Session } from '@supabase/supabase-js'
import { Button, Text } from '@rneui/themed'
import { useFocusEffect } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../contexts/ThemeContext'

export default function HomeScreen({ session }: { session: Session }) {
  const [deals, setDeals] = useState<UserDeal_t[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme() // Get the current theme

  const fetchDeals = async () => {
    setLoading(true)
    await getUserDeals(session, setDeals)
    setLoading(false)
  }

  // Focus Effect to fetch deals when the screen is focused
  useFocusEffect(useCallback(() => {
    fetchDeals()
  }, [session]))

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[Colours.background[theme], Colours.dealItem[theme]]}
    >
      <FlatList
        data={deals}
        renderItem={({ item }) => <Deal session={session} deal={item} />}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <ActivityIndicator size="large" color={Colours.primary} />
            )
          } else {
            return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: Colours.text[theme], textAlign: 'center' }}>
                  No deals found.
                </Text>
                <Button
                  title="Refresh"
                  onPress={fetchDeals}
                  color={Colours.primary}
                />
              </View>
            )
          }
        }}
      />
    </LinearGradient>
  )
}

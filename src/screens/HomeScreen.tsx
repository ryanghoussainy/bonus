import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { UserDeal_t, getUserDeals } from '../operations/UserDeal';
import Deal from '../components/Deal';
import Colours from '../config/Colours';
import { Session } from '@supabase/supabase-js';
import { Button, Text } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ session }: { session: Session }) {
  const [deals, setDeals] = useState<UserDeal_t[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    await getUserDeals(session, setDeals);
    setLoading(false);
  };

  // Focus Effect to fetch deals when the screen is focused
  useFocusEffect(useCallback(() => {
    fetchDeals()
  }, [session]))

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={deals}
        style={styles.container}
        renderItem={({ item }) => <Deal session={session} deal={item} />}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={styles.container}>
                <ActivityIndicator size="large" color={Colours.primary[Colours.theme]} />
              </View>
            )
          } else {
            return (
              <View style={styles.container}>
                <Text style={styles.text}>No deals found.</Text>
                <Button
                  title="Refresh"
                  onPress={fetchDeals}
                  color={Colours.primary[Colours.theme]}
                />
              </View>
            )
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.background[Colours.theme],
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: Colours.text[Colours.theme],
    textAlign: "center",
  },
})

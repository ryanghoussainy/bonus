import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { UserDeal_t, getUserDeals } from '../operations/UserDeal';
import Deal from '../components/Deal';
import Colours from '../config/Colours';
import { Session } from '@supabase/supabase-js';
import { Button, Text } from '@rneui/themed';

export default function HomeScreen({ session }: { session: Session }) {
  const [deals, setDeals] = useState<UserDeal_t[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    await getUserDeals(session, setDeals);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, [session])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={deals}
        style={styles.container}
        renderItem={({ item }) => <Deal deal={item} />}
        ListEmptyComponent={() => {
          if (loading) {
              return (
              <View style={styles.container}>
                <ActivityIndicator size="large" color={Colours.green[Colours.theme]} />
              </View>
            ) 
          } else {
            return (
              <View style={styles.container}>
                <Text style={styles.text}>No deals found.</Text>
                <Button
                  title="Refresh"
                  onPress={fetchDeals}
                  color={Colours.green[Colours.theme]}
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

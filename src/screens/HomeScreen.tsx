import { StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { UserDeal_t, getUserDeals } from '../operations/UserDeal';
import Deal from '../components/Deal';
import Colours from '../config/Colours';
import { Session } from '@supabase/supabase-js';

export default function HomeScreen({ session }: { session: Session }) {
  const [deals, setDeals] = useState<UserDeal_t[]>([]);

  useEffect(() => {
    getUserDeals(session, setDeals);
  }, [deals])

  return (
    <FlatList
      data={deals}
      style={styles.container}
      renderItem={({ item }) => <Deal deal={item} />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.background[Colours.theme],
  },
})

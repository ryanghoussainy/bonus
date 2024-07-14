import { View, StyleSheet, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Deal_t, getDeals } from './operations/Deal';
import Deal from './components/Deal';
import colours from './config/Colours';

export default function HomeScreen() {
  const [deals, setDeals] = useState<Deal_t[]>([]);

  useEffect(() => {
    getDeals(setDeals);
  }, [])

  return (
    <FlatList
      data={deals}
      style={styles.container}
      renderItem={({ item }) => <Deal deal={item}/>}
    />
  )
}

const styles = StyleSheet.create({
   container: {
       backgroundColor: colours.background[colours.theme],
       marginTop: 30,
   },
})

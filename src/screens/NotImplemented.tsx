import { View, Text, StyleSheet } from 'react-native';
import Colours from '../config/Colours';
import { useTheme } from '../contexts/ThemeContext';

export default function NotImplemented() {
  // Get theme
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
      <Text style={[styles.text, { color: Colours.text[theme] }]}>Not Implemented!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       alignItems: "center",
       justifyContent: "center",
   },
   text: {
       fontSize: 18,
       fontWeight: "500",
   },
})

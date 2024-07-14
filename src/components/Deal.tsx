import { Text, Pressable, StyleSheet, View } from "react-native"
import colours from "../config/Colours"
import { Deal_t } from "../operations/Deal";
import getDiscountDescription from "./DiscountDescription";


const Deal = ({ deal }: { deal: Deal_t }) => {
    return (
        <Pressable onPress={() => console.log(deal.name)} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.name}>{deal.name}</Text>

                <View style={styles.discount}>{getDiscountDescription(deal)}</View>
            </View>
        </Pressable>
    )
}

export default Deal;

const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      height: "auto",
      marginHorizontal: 30,
      marginVertical: 10,
      backgroundColor: colours.dealItem[colours.theme],
      borderRadius: 20,
  
      // Shadow
      shadowColor: colours.text[colours.theme],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
  
      elevation: 1.5,
    },
    content: {
      flex: 1,
    },
    discount: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    logo: {
      width: 70,
      height: 70,
      alignSelf: "center",
      borderRadius: 35,
      borderWidth: 1,
      borderColor: "black",
    },
    name: {
      alignSelf: "center",
      fontSize: 27,
      fontWeight: "bold",
      marginVertical: 5,
      marginHorizontal: 15,
      textAlign: "center",
      color: colours.text[colours.theme],
    },
})

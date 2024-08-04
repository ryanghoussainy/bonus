import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Colours from '../config/Colours'
import getDiscountDescription from '../components/DiscountDescription';
import { RootStackParamList } from '../navigation/StackNavigator';
import Fonts from '../config/Fonts';
import QRCode from 'react-native-qrcode-svg';

type DealScreenRouteProp = RouteProp<RootStackParamList, "Deal">;

const DealScreen = () => {

    const route = useRoute<DealScreenRouteProp>()
    const navigation = useNavigation()
    
    const deal = route.params.deal

    useEffect(() => {
        navigation.setOptions({ title: deal.name })
    }, [])

    
    return (
        <View style={styles.container}>
            <View style={styles.dealContainer}>
                {/* Discount */}
                <View>{getDiscountDescription(deal)}</View>

                {/* Redeem */}
                <View style={styles.redeem}>
                    <QRCode
                        value="hello"
                        size={230}
                    />
                </View>

                {/* Description */}
                <Text style={[styles.description, { textDecorationLine: "underline" }]}>
                    DETAILS
                </Text>
                <Text style={[styles.description, { paddingBottom: 15 }]}>
                    {deal.description}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background[Colours.theme],
        flex: 1,
    },
    dealContainer: {
        backgroundColor: Colours.dealItem[Colours.theme],
        flex: 1,
        marginVertical: 40,
        marginHorizontal: 30,
        borderRadius: 35,
        borderColor: Colours.green[Colours.theme],
        borderWidth: 1,
    },
    description: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
        fontSize: 15,
    },
    redeem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})

export default DealScreen;

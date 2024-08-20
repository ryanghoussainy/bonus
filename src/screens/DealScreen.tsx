import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Colours from '../config/Colours'
import { getDiscountDescription, getDiscountTimes } from '../components/DiscountDescription';
import { RootStackParamList } from '../navigation/StackNavigator';
import Fonts from '../config/Fonts';
import QRCode from 'react-native-qrcode-svg';
import { getLogo, getLogoPath } from '../operations/Logo';
import { Session } from '@supabase/supabase-js';
import { Image } from '@rneui/themed';

type DealScreenRouteProp = RouteProp<RootStackParamList, "Deal">;

const DealScreen = ({ session }: { session: Session }) => {
    const [url, setUrl] = useState<string>("");
    const [logoUrl, setLogoUrl] = useState<string>("");

    const route = useRoute<DealScreenRouteProp>()
    const navigation = useNavigation()

    const deal = route.params.deal

    useEffect(() => {
        if (url) getLogo(url, setLogoUrl);
    }, [url])

    useEffect(() => {
        getLogoPath(deal.id, setUrl);
    }, [session])

    useLayoutEffect(() => {
        navigation.setOptions({ title: deal.name })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.dealContainer}>
                {/* Logo */}
                {logoUrl &&
                    <Image
                        source={{ uri: logoUrl }}
                        accessibilityLabel="Logo"
                        style={styles.logo}
                        resizeMode="cover"
                    />
                }

                {/* Discount */}
                <Text>
                    {getDiscountDescription(deal)}
                </Text>

                {/* Discount Times */}
                <View>{getDiscountTimes(deal)}</View>

                {/* Redeem */}
                <QRCode
                    value={deal.user_deal_id}
                    size={230}
                />

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
        borderColor: Colours.primary[Colours.theme],
        borderWidth: 1,
        alignItems: "center"
    },
    description: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: Colours.text[Colours.theme],
        fontFamily: Fonts.condensed,
        fontSize: 15,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 25,
    },
})

export default DealScreen;

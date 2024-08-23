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
import { useTheme } from '../contexts/ThemeContext';

type DealScreenRouteProp = RouteProp<RootStackParamList, "Deal">;

const DealScreen = ({ session }: { session: Session }) => {
    // Get theme
    const { theme } = useTheme();

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
        <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            <View style={[styles.dealContainer, { backgroundColor: Colours.dealItem[theme], borderColor: Colours.primary[theme] }]}>
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
                <Text style={[styles.description, { textDecorationLine: "underline", color: Colours.text[theme] }]}>
                    DETAILS
                </Text>
                <Text style={[styles.description, { paddingBottom: 15, color: Colours.text[theme] }]}>
                    {deal.description}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dealContainer: {
        flex: 1,
        marginVertical: 40,
        marginHorizontal: 30,
        borderRadius: 35,
        borderWidth: 1,
        alignItems: "center"
    },
    description: {
        paddingHorizontal: 15,
        paddingVertical: 5,
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

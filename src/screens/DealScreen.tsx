import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import QRCode from 'react-native-qrcode-svg';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { useTheme } from '../contexts/ThemeContext';
import { Session } from '@supabase/supabase-js';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { getLogo } from '../operations/Logo';
import { Ionicons } from '@expo/vector-icons';

type DealScreenRouteProp = RouteProp<RootStackParamList, 'Deal'>;

export default function DealScreen({ session }: { session: Session }) {
    const { theme } = useTheme();
    const route = useRoute<DealScreenRouteProp>();
    const deal = route.params.deal;

    // Logo
    const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const navigation = useNavigation();

    useEffect(() => {
        getLogo(deal.logoUrl, setLogoUrl);
    }, [session]);

    // Format Time
    const formatTime = (time: string | null) => {
        if (!time) return '';
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Format Discount Times
    const formatDiscountTimes = (discountTimes: { [key: string]: string | null }) => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return days
            .map((day) => {
                if (!discountTimes[`${day}_start`] || !discountTimes[`${day}_end`]) return null;
                const start = formatTime(discountTimes[`${day}_start`]);
                const end = formatTime(discountTimes[`${day}_end`]);
                return `${day.charAt(0).toUpperCase()}${day.slice(1)} - ${start} to ${end}`;
            })
            .filter(Boolean)
            .join('\n');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: Colours.background[theme] }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-outline" size={28} color={Colours.text[theme]} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Image source={{ uri: logoUrl }} style={styles.logo} />
                <Text style={[styles.shopName, { color: Colours.text[theme] }]}>{deal.name}</Text>
                <Text style={[styles.shopLocation, { color: Colours.text[theme] }]}>{deal.location}</Text>
            </View>

            <View style={styles.qrContainer}>
                <Text style={[styles.qrTitle, { color: Colours.text[theme] }]}>Your QR Code</Text>
                <QRCode
                    value={deal.userDealID}
                    size={200}
                    color={Colours.text[theme]}
                    backgroundColor={Colours.background[theme]}
                />
            </View>

            { deal.discountType === 0 && 
                (deal.points === deal.maxPoints ? (
                    <View style={styles.redeemContainer}>
                        <Text style={styles.redeemNotice}>You can redeem this discount!</Text>
                        <Button
                            title="Redeem Discount"
                            onPress={() => setModalVisible(true)}
                            buttonStyle={[styles.redeemButton, { backgroundColor: "red" }]}
                        />
                    </View>
                ) : (
                    <Text style={[styles.notEligibleText, { color: Colours.grey }]}>
                        Collect more points to redeem this deal.
                    </Text>
                ))
            }

            <View style={styles.dealInfoContainer}>
                <Text style={[styles.sectionTitle, { color: Colours.primary[theme] }]}>Description</Text>
                <Text style={[styles.dealDescription, { color: Colours.text[theme] }]}>{deal.description}</Text>
                <Text style={[styles.sectionTitle, { color: Colours.primary[theme] }]}>This deal is available on:</Text>
                <Text style={[styles.dealTimes, { color: Colours.text[theme] }]}>{formatDiscountTimes(deal.discountTimes)}</Text>
                {deal.discountType === 0 && 
                    <Text style={[styles.pointsText, { color: Colours.primary[theme] }]}>
                        Points Collected: {deal.points}/{deal.maxPoints}
                    </Text>
                }
            </View>

            {/* Modal for redeeming the deal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: Colours.background[theme] }]}>
                        <Text style={[styles.modalTitle, { color: Colours.text[theme] }]}>Redeem QR Code</Text>
                        <QRCode
                            value={`${deal.userDealID}-redeem`}
                            size={200}
                            color={Colours.text[theme]}
                            backgroundColor={Colours.background[theme]}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={[styles.closeModalText, { color: Colours.primary[theme] }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 10,
        zIndex: 1,
        borderRadius: 20,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: Colours.background.light,
    },
    shopName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.condensed,
    },
    shopLocation: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        color: Colours.grey,
        marginBottom: 10,
    },
    dealInfoContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    dealDescription: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
        marginBottom: 15,
    },
    dealTimes: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        marginBottom: 15,
    },
    pointsText: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        fontWeight: '600',
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    redeemContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    redeemNotice: {
        fontSize: 18,
        color: "#900",
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.condensed,
    },
    redeemButton: {
        padding: 15,
        borderRadius: 8,
        fontFamily: Fonts.condensed,
    },
    notEligibleText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        fontFamily: Fonts.condensed,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: Fonts.condensed,
    },
    closeModalText: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
});

import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';
import { Button } from '@rneui/themed';
import Colours from '../config/Colours';
import { getUserDeals, UserDeal_t } from '../operations/UserDeal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Fonts from '../config/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { getLogo } from '../operations/Logo';
import { RootStackParamList } from '../navigation/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, parseISO, isAfter, addDays, set } from 'date-fns';
import { enGB } from 'date-fns/locale';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

type AvailabilityStatus = {
  availableNow: boolean;
  alreadyRedeemed: boolean;
  nextAvailable: Date | null;
};

export default function HomeScreen({ session }: { session: Session }) {
  // Get theme
  const { theme } = useTheme();

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [loading, setLoading] = useState<boolean>(true);
  
  // Store deals
  const [deals, setDeals] = useState<UserDeal_t[]>([]);
  
  // Store logos using deal ID as key
  const [logos, setLogos] = useState<{ [key: string]: string }>({});

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const fetchedDeals = await getUserDeals(session, setDeals);
      
      // Fetch logos
      const logoUrls = await Promise.all(
        fetchedDeals?.map(async (deal) => {
          const logoUrl = await getLogo(deal.logoUrl);
          return { id: deal.id, url: logoUrl };
        }) || []
      );

      // Create a map of logos
      const logoMap: { [key: string]: string } = logoUrls.reduce((acc, logo) => {
        acc[logo.id] = logo.url;
        return acc;
      }, {} as { [key: string]: string });

      setLogos(logoMap);
    } catch (error) {
      console.error('Error fetching deals:', error);
      Alert.alert('Error fetching deals');
    } finally {
      setLoading(false);
    }
  };

  // Focus Effect to fetch deals when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDeals();
    }, [session])
  );

  // Check if deal is currently available
  const getAvailabilityStatus = (deal: UserDeal_t): AvailabilityStatus => {
    const now = new Date();
    const todayDate = format(now, 'yyyy-MM-dd', { locale: enGB });
    const todayDay = format(now, 'EEE', { locale: enGB }).toLowerCase(); // e.g., 'mon', 'tue'

    // Check if already redeemed today
    const alreadyRedeemed = deal.redeemedDays.includes(todayDate);

    // Get today's start and end times
    const startTimeString = deal.discountTimes[`${todayDay}_start` as keyof typeof deal.discountTimes];
    const endTimeString = deal.discountTimes[`${todayDay}_end` as keyof typeof deal.discountTimes];

    let availableNow = false;
    let nextAvailable: Date | null = null;

    if (startTimeString && endTimeString) {
      const startTime = parseISO(startTimeString);
      const endTime = parseISO(endTimeString);

      const todayStart = set(now, {
        hours: startTime.getHours(),
        minutes: startTime.getMinutes(),
        seconds: 0,
        milliseconds: 0,
      });

      const todayEnd = set(now, {
        hours: endTime.getHours(),
        minutes: endTime.getMinutes(),
        seconds: 0,
        milliseconds: 0,
      });

      if (isAfter(now, todayStart) && isAfter(todayEnd, now) && !alreadyRedeemed) {
        availableNow = true;
      } else if (isAfter(now, todayEnd) && !alreadyRedeemed) {
        // The deal expired earlier today
        availableNow = false;
      }
    }

    if (availableNow) {
      return { availableNow, alreadyRedeemed, nextAvailable: null };
    }

    // Find next available date and time
    for (let i = 0; i < 8; i++) {

      const checkDate = addDays(now, i);
      const checkDay = format(checkDate, 'EEE', { locale: enGB }).toLowerCase();
      
      const checkStartTimeString = deal.discountTimes[`${checkDay}_start` as keyof typeof deal.discountTimes];
      const checkEndTimeString = deal.discountTimes[`${checkDay}_end` as keyof typeof deal.discountTimes];
      
      if (checkStartTimeString && checkEndTimeString) {
        const checkStartTime = parseISO(checkStartTimeString);
        
        const nextAvailableDate = set(checkDate, {
          hours: checkStartTime.getHours(),
          minutes: checkStartTime.getMinutes(),
          seconds: 0,
          milliseconds: 0,
        });
        
        // Get end time of deal
        const checkEndTime = parseISO(checkEndTimeString);
        const checkEnd = set(checkDate, {
          hours: checkEndTime.getHours(),
          minutes: checkEndTime.getMinutes(),
          seconds: 0,
          milliseconds: 0,
        });

        if ((alreadyRedeemed && i == 0) || isAfter(now, checkEnd)) {
          continue; // Skip today if already redeemed
        }
        
        nextAvailable = nextAvailableDate;
        break;
      }
    }

    return { availableNow, alreadyRedeemed, nextAvailable };
  };

  const formatDateTime = (date: Date): string => {
    return format(date, 'eee dd MMM, h:mm a', { locale: enGB });
  };

  const renderDeal = ({ item }: { item: UserDeal_t }) => {
    const expired = (item.endDate !== null) && isAfter(new Date(), parseISO(item.endDate));

    let availableNow = false;
    let alreadyRedeemed = false;
    let nextAvailable: Date | null = null;
    let availabilityText = 'Expired';
    let availabilityTextColor = Colours.outline[theme];
    
    if (!expired) {
      const {
        availableNow: _availableNow,
        alreadyRedeemed: _alreadyRedeemed,
        nextAvailable: _nextAvailable
      } = getAvailabilityStatus(item);

      availableNow = _availableNow;
      alreadyRedeemed = _alreadyRedeemed;
      nextAvailable = _nextAvailable;

      if (availableNow) {
        availabilityText = 'Available Now';
        availabilityTextColor = Colours.primary[theme];
      } else if (alreadyRedeemed) {
        availabilityText = nextAvailable
          ? `Already redeemed. Next available: ${formatDateTime(nextAvailable)}`
          : 'Already redeemed. No upcoming availability';
      } else {
        availabilityText = nextAvailable
          ? `Next available:\n${formatDateTime(nextAvailable)}`
          : 'Not available';
      }
    }

    const redeemable = item.points === item.maxPoints;
    const redeemTextStyle = redeemable ? styles.redeemText : null;

    return (
      <TouchableOpacity
        style={[styles.dealCard, { backgroundColor: Colours.dealItem[theme] }]}
        onPress={() => navigation.navigate("Deal", { deal: item })}
        disabled={expired}
      >
        {redeemable && (
          <View style={styles.redeemNowLabel}>
            <Text style={[styles.redeemNowText, { color: Colours.text[theme] }]}>Redeem Now</Text>
          </View>
        )}
        <View style={styles.logoContainer}>
          {logos[item.id] ? (
            <Image source={{ uri: logos[item.id] }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
        </View>
        <View style={styles.dealInfoContainer}>
          <Text style={[styles.shopName, { color: Colours.text[theme] }]}>{item.name}</Text>
          <Text style={[styles.dealText, { color: Colours.text[theme] }]}>
            <Text style={[styles.dealDiscount, { color: Colours.gold[theme] }]}>{item.discount}%</Text>
            {' off'}
            {item.discountType === 0 && (
              <Text>
                {' when you come '}
                <Text style={{ fontSize: 20, color: Colours.primary[theme] }}>{item.maxPoints}</Text>
                {' times'}
              </Text>
            )}
          </Text>
          <Text style={[styles.dealAvailability, { color: availabilityTextColor }]}>
            {availabilityText}
          </Text>
          {item.discountType === 0 &&
            <Text style={[styles.points, { color: Colours.primary[theme] }, redeemTextStyle]}>
              {item.points} / {item.maxPoints}
              {'\npoints'}
            </Text>
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[Colours.background[theme], Colours.dealItem[theme]]}
    >
      <View style={[styles.headerContainer, { backgroundColor: Colours.background[theme] }]}>
        <Text style={[styles.header, { color: Colours.text[theme] }]}>Your Deals</Text>
      </View>
      <FlatList
        data={deals}
        renderItem={renderDeal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={[styles.container, { marginTop: 250 }]}>
                <ActivityIndicator size="large" color={Colours.primary[theme]} />
              </View>
            );
          } else {
            return (
              <View style={[styles.container, { marginTop: 250 }]}>
                <Text style={[styles.text, { color: Colours.text[theme] }]}>No deals found.</Text>
                <Button title="Refresh" onPress={fetchDeals} color={Colours.primary[theme]} />
              </View>
            );
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  headerContainer: {
    marginTop: 20,
    padding: 15,
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.condensed,
    marginLeft: 10,
  },
  dealCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
  },
  redeemNowLabel: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 1,
  },
  redeemNowText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  redeemText: {
    fontWeight: 'bold',
  },
  logoContainer: {
    marginRight: 15,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colours.background.light,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colours.lightgrey,
  },
  dealInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.condensed,
    marginBottom: 5,
  },
  dealText: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    marginBottom: 5,
  },
  dealDiscount: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: Fonts.condensed,
  },
  dealAvailability: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '500',
    fontFamily: Fonts.condensed,
  },
  points: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    position: "absolute",
    bottom: 10,
    left: -70,
    fontWeight: "bold",
    textAlign: "center",
  },
});

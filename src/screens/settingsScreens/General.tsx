import { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colours from '../../config/Colours';
import Fonts from '../../config/Fonts';
import { Session } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { confirmPassword, deleteUser } from '../../operations/User';

export default function General({ session }: { session: Session }) {
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const toggleNotifications = () => {
        setNotificationsEnabled((previousState) => !previousState);
        // Add logic to toggle notifications here
    };

    const handleDeleteAccount = () => {
        // This will open the modal
        setModalVisible(true);
    };

    const confirmDeleteAccount = async () => {
        if (password.trim() === '') {
            Alert.alert("Please enter your password.");
            return;
        }

        setLoading(true); // Show confirming modal

        if (await confirmPassword(session, password)) {
            // Simulate network delay for visual effect
            setTimeout(async () => {
                // Delete account
                await deleteUser(session, setLoading);
                Alert.alert("Account deleted", "Your account has been successfully deleted.");
            }, 2000);
        } else {
            setLoading(false); // Hide confirming modal
            Alert.alert("Incorrect Password", "The password you entered is incorrect. Please try again.");
            setPassword('');
        }

        setModalVisible(false);
    };

    return (
        <LinearGradient colors={[Colours.background[theme], Colours.dealItem[theme]]} style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: Colours.background[theme] }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-outline" size={28} color={Colours.text[theme]} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.header, { color: Colours.text[theme] }]}>General</Text>

                {/* Theme Customization */}
                <View style={[styles.settingContainer, { backgroundColor: Colours.background[theme] }]}>
                    <Text style={[styles.settingText, { color: Colours.text[theme] }]}>Dark Theme</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: Colours.primary[theme] }}
                        thumbColor={theme === "dark" ? Colours.dealItem[theme] : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleTheme}
                        value={theme === "dark"}
                    />
                </View>

                {/* Notification Settings */}
                <View style={[styles.settingContainer, { backgroundColor: Colours.background[theme] }]}>
                    <Text style={[styles.settingText, { color: Colours.text[theme] }]}>Enable Notifications</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: Colours.primary[theme] }}
                        thumbColor={notificationsEnabled ? Colours.dealItem[theme] : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleNotifications}
                        value={notificationsEnabled}
                    />
                </View>

                {/* Delete Account */}
                <TouchableOpacity style={[styles.optionContainer, { backgroundColor: Colours.background[theme] }]} onPress={handleDeleteAccount}>
                    <Text style={[styles.optionText, { color: Colours.text[theme] }]}>Delete Account</Text>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </ScrollView>

            {/* Delete Account Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: Colours.background[theme] }]}>
                        <Text style={[styles.modalTitle, { color: Colours.text[theme] }]}>Confirm Delete Account</Text>
                        <Text style={[styles.modalText, { color: Colours.text[theme] }]}>Please enter your password to confirm.</Text>
                        <TextInput
                            style={[styles.inputField, { backgroundColor: Colours.dealItem[theme], color: Colours.text[theme], borderColor: Colours.dealItem[theme] }]}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: Colours.dealItem[theme] }]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonDelete]}
                                onPress={confirmDeleteAccount}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirming Password Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: Colours.background[theme] }]}>
                        <ActivityIndicator size="large" color={Colours.primary[theme]} />
                        <Text style={[styles.modalText, { color: Colours.text[theme], marginTop: 20 }]}>Confirming password...</Text>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
        borderRadius: 20,
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        fontFamily: Fonts.condensed,
        textAlign: 'center',
        marginTop: 30,
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
    },
    settingText: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
    },
    optionText: {
        fontSize: 18,
        fontFamily: Fonts.condensed,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts.condensed,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        fontFamily: Fonts.condensed,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputField: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonDelete: {
        backgroundColor: 'red',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontFamily: Fonts.condensed,
    },
});

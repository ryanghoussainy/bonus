import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Button, Icon, Switch } from '@rneui/themed';
import { useTheme } from '../contexts/ThemeContext';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { supabase } from '../lib/supabase';
import { createUser } from '../operations/User';

export default function Auth() {
  // Get theme
  const { theme, toggleTheme } = useTheme();

  // User details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [preferredTheme, setPreferredTheme] = useState(theme === 'light' ? false : true);
  
  // User can press the 'eye' icon to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Modal for creating an account
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    // Validate that all required fields are filled
    if (!email || !password || !firstName || !surname) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    // Attempt to create the user
    createUser(email, password, firstName, surname, mobileNumber, preferredTheme ? "dark" : "light", setLoading);
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    setEmail('');
    setPassword('');
    setFirstName('');
    setSurname('');
    setMobileNumber('');
  }

  const handleOpenModal = () => {
    setModalVisible(true);
    setEmail('');
    setPassword('');
  }

  return (
    <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
      <Text style={[styles.title, { color: Colours.primary[theme] }]}>Welcome!</Text>
      <Text style={[styles.subtitle, { color: Colours.text[theme] }]}>Log in to your account</Text>

      <Input
        label="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope', color: Colours.text[theme] }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
        containerStyle={styles.inputContainer}
        disabled={loading}
      />

      <Input
        label="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: Colours.text[theme], size: 30, style: { marginRight: 5 } }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
        containerStyle={styles.inputContainer}
        disabled={loading}
        rightIcon={
          <Icon
            type="font-awesome"
            name={passwordVisible ? "eye" : "eye-slash"}
            onPress={() => setPasswordVisible(!passwordVisible)}
            color={Colours.text[theme]}
            size={24}
          />
        }
      />

      <Button
        title={loading ? <ActivityIndicator color="#fff" /> : "Log in"}
        onPress={signInWithEmail}
        disabled={loading}
        buttonStyle={[styles.loginButton, { backgroundColor: Colours.primary[theme] }]}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.loginTitle}
      />

      <TouchableOpacity onPress={handleOpenModal}>
        <Text style={[styles.signupText, { color: Colours.primary[theme] }]}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* Sign Up Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: Colours.background[theme] }]}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: Colours.primary[theme] }]}>Create Account</Text>

              <View style={styles.themeToggleContainer}>
                <Text style={[styles.themeToggleText, { color: Colours.text[theme] }]}>Preferred Theme:</Text>
                <Switch
                  value={preferredTheme}
                  onValueChange={(value) => {
                    setPreferredTheme(value);
                    toggleTheme();
                  }}
                  color={Colours.primary[theme]}
                />
              </View>

              <Input
                label="Email *"
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: Colours.text[theme] }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Password *"
                leftIcon={{ type: 'font-awesome', name: 'lock', color: Colours.text[theme], size: 30, style: { marginRight: 5 } }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={!passwordVisible}
                placeholder="Password"
                autoCapitalize="none"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
                rightIcon={
                  <Icon
                    type="font-awesome"
                    name={passwordVisible ? "eye" : "eye-slash"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    color={Colours.text[theme]}
                    size={24}
                  />
                }
              />

              <Input
                label="First Name *"
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                placeholder="First Name"
                autoCapitalize="words"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Surname *"
                onChangeText={(text) => setSurname(text)}
                value={surname}
                placeholder="Surname"
                autoCapitalize="words"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Mobile Number"
                onChangeText={(text) => setMobileNumber(text)}
                value={mobileNumber}
                placeholder="Mobile Number (Optional)"
                keyboardType="phone-pad"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleCloseModal} style={styles.buttonWidth}>
                  <Text style={[styles.closeModalText, { color: Colours.primary[theme] }]}>Close</Text>

                </TouchableOpacity>
                  <Button
                    title={loading ? <ActivityIndicator color="#fff" /> : "Sign up"}
                    onPress={signUpWithEmail}
                    disabled={loading}
                    buttonStyle={[styles.signupButton, { backgroundColor: Colours.primary[theme] }]}
                    containerStyle={[styles.buttonContainer, styles.buttonWidth]}
                    titleStyle={styles.signupTitle}
                  />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Fonts.condensed,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Fonts.condensed,
  },
  inputContainer: {
    marginBottom: 10,
  },
  loginButton: {
    padding: 15,
    borderRadius: 8,
  },
  loginTitle: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signupText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: Fonts.condensed,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Fonts.condensed,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeToggleText: {
    fontSize: 16,
    fontFamily: Fonts.condensed,
  },
  signupButton: {
    padding: 15,
    borderRadius: 8,
  },
  signupTitle: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    fontWeight: 'bold',
  },
  closeModalText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: Fonts.condensed,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWidth: {
    width: '48%',
  },
});

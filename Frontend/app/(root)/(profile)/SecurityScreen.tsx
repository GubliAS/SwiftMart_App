import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { ChevronLeft, Eye, EyeOff, Shield, Lock, Smartphone, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/constants/env';
import Button from '@/components/Button';

const SecurityScreen = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Security settings
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [transactionNotifications, setTransactionNotifications] = useState(true);

  const handleChangePassword = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setSuccessMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.text();
        setErrorMsg(err || 'Failed to change password.');
      }
    } catch (e) {
      setErrorMsg('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricToggle = async () => {
    try {
      // Here you would typically check if biometric authentication is available
      // and handle the setup process
      setBiometricEnabled(!biometricEnabled);
      Alert.alert(
        biometricEnabled ? 'Biometric Disabled' : 'Biometric Enabled',
        biometricEnabled 
          ? 'Biometric authentication has been disabled'
          : 'Biometric authentication has been enabled'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to configure biometric authentication');
    }
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      // Navigate to 2FA setup screen
      Alert.alert(
        'Two-Factor Authentication',
        'This will redirect you to set up two-factor authentication. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => setTwoFactorEnabled(true) }
        ]
      );
    } else {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', style: 'destructive', onPress: () => setTwoFactorEnabled(false) }
        ]
      );
    }
  };

  const handleDeleteAccount = async () => {
    console.log('Attempting to delete account...');
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${BASE_URL}/api/auth/user`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log('Delete response status:', res.status);
              const text = await res.text();
              console.log('Delete response body:', text);
              if (res.ok) {
                await logout();
                router.replace('/(auth)/Login');
              } else {
                Alert.alert('Error', text || 'Failed to delete account.');
              }
            } catch (e) {
              console.log('Delete network error:', e);
              Alert.alert('Error', 'Network error.');
            }
          },
        },
      ]
    );
  };

  const SecurityOption = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showSwitch = true,
    onPress 
  }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between p-4 bg-white rounded-xl mb-3"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
      onPress={onPress}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
          <Icon size={20} color="#156651" />
        </View>
        <View className="flex-1">
          <Text className="text-BodyBold text-text">{title}</Text>
          <Text className="text-BodySmallRegular text-neutral-60">{subtitle}</Text>
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#156651' }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-neutral-10 pb-12">
      {/* Header */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">
          Security Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Password Change Section */}
        <View className="bg-white rounded-xl p-4 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
              <Lock size={20} color="#156651" />
            </View>
            <Text className="text-Heading4 font-Manrope text-text">Change Password</Text>
          </View>

          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Current Password</Text>
            <View className="flex-row items-center border border-neutral-200 rounded-lg">
              <TextInput
                className="flex-1 p-4 font-Manrope"
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity 
                className="p-4"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-BodyRegular text-neutral-80 mb-2">New Password</Text>
            <View className="flex-row items-center border border-neutral-200 rounded-lg">
              <TextInput
                className="flex-1 p-4 font-Manrope"
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity 
                className="p-4"
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Confirm New Password</Text>
            <View className="flex-row items-center border border-neutral-200 rounded-lg">
              <TextInput
                className="flex-1 p-4 font-Manrope"
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                className="p-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            className={`rounded-lg p-4 items-center ${isLoading ? 'bg-neutral-300' : 'bg-primary'}`}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            <Text className="text-BodyBold font-Manrope text-white">
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
          {successMsg ? <Text className="text-green-600 text-center mt-2">{successMsg}</Text> : null}
          {errorMsg ? <Text className="text-red-600 text-center mt-2">{errorMsg}</Text> : null}
        </View>

        {/* Security Options */}
        <Text className="text-Heading4 font-Manrope text-text mb-4">Security Options</Text>

        <SecurityOption
          icon={Smartphone}
          title="Biometric Authentication"
          subtitle="Use fingerprint or face ID to sign in"
          value={biometricEnabled}
          onToggle={handleBiometricToggle}
        />

        <SecurityOption
          icon={Shield}
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          value={twoFactorEnabled}
          onToggle={handleTwoFactorToggle}
        />

        <SecurityOption
          icon={Bell}
          title="Login Notifications"
          subtitle="Get notified when someone signs in"
          value={loginNotifications}
          onToggle={setLoginNotifications}
        />

        <SecurityOption
          icon={Bell}
          title="Transaction Notifications"
          subtitle="Get notified for all transactions"
          value={transactionNotifications}
          onToggle={setTransactionNotifications}
        />

        {/* Security Tips */}
        <View className="bg-blue-50 rounded-xl p-4 mt-6 mb-8">
          <Text className="text-Heading5 font-Manrope text-blue-800 mb-2">Security Tips</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• Use a strong, unique password</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• Enable two-factor authentication</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• Keep your app updated</Text>
          <Text className="text-BodySmallRegular text-blue-700">• Never share your login credentials</Text>
        </View>
        <Button BtnText="Delete Account" bgColor="bg-alert" onPress={handleDeleteAccount} />
      </ScrollView>
    </View>
  );
};

export default SecurityScreen; 
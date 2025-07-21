import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/constants/env';
import PhoneInput from 'react-native-phone-number-input';
import { useRef } from 'react';

const defaultProfilePic = require('@/assets/images/userPic.jpeg');

const mockUser = {
  name: 'Claire Cooper',
  email: 'claire.cooper@mail.com',
  photo: defaultProfilePic,
};

const requestPermissions = async () => {
  await ImagePicker.requestCameraPermissionsAsync();
  await ImagePicker.requestMediaLibraryPermissionsAsync();
};

const EditProfile = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { token } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [email] = useState(user.email);
  const [photo, setPhoto] = useState<any>(user.photo);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const phoneInputRef = useRef<PhoneInput>(null);
  const [formattedPhone, setFormattedPhone] = useState(phoneNumber || '');

  const handlePhotoPress = async () => {
    await requestPermissions();
    const options = ['Take Photo', 'Choose from Gallery', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    }, async (selectedIndex) => {
      if (selectedIndex === 0) {
        // Take Photo
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setPhoto({ uri: result.assets[0].uri });
        }
      } else if (selectedIndex === 1) {
        // Choose from Gallery
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setPhoto({ uri: result.assets[0].uri });
        }
      }
    });
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First and last name are required.');
      return false;
    }
    // E.164: +[country][number], 8-15 digits total
    if (formattedPhone && !/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
      setErrorMsg('Phone number must be in international format, e.g. +233555123456');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    if (!validateForm()) return;
    setSaving(true);
    console.log('Saving phone number:', formattedPhone);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber: formattedPhone }),
      });
      if (res.ok) {
        setUser((prev) => ({ ...prev, firstName, lastName, phoneNumber, photo }));
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => {
          setSuccessMsg('');
          setSaving(false);
          router.back();
        }, 1500);
      } else {
        let errMsg = 'Failed to update profile.';
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errJson.message || errMsg;
        } catch {
          const errText = await res.text();
          if (errText) errMsg = errText;
        }
        setErrorMsg(errMsg);
        setSaving(false);
      }
    } catch (e) {
      setErrorMsg('Network error.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()} disabled={saving}>
          <Text className="text-2xl text-primary">←</Text>
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">Edit Profile</Text>
        <TouchableOpacity onPress={() => {
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setPhoneNumber(user.phoneNumber || '');
          setPhoto(user.photo);
          setErrorMsg('');
          setSuccessMsg('');
          router.back();
        }} disabled={saving}>
          <Text className="text-lg text-neutral-40">Cancel</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
      {/* Profile Photo */}
      <View className="items-center mt-8 mb-6">
        <TouchableOpacity onPress={handlePhotoPress} className="rounded-full w-28 h-28 overflow-hidden border-4 border-primary bg-neutral-10 items-center justify-center">
          <Image source={photo} style={{ width: 112, height: 112, borderRadius: 56 }} />
          <View className="absolute bottom-2 right-2 bg-primary rounded-full p-2">
            <Text className="text-white text-xs">Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Form */}
      <View className="px-6 gap-6">
        <View>
                <Text className="text-BodySmallBold text-neutral-60 mb-2">First Name</Text>
                <TextInput
                  className="bg-neutral-10 rounded-lg px-4 py-3 text-BodyBold text-text border border-neutral-20"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#C2C2C2"
                />
              </View>
              <View>
                <Text className="text-BodySmallBold text-neutral-60 mb-2">Last Name</Text>
          <TextInput
            className="bg-neutral-10 rounded-lg px-4 py-3 text-BodyBold text-text border border-neutral-20"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
            placeholderTextColor="#C2C2C2"
          />
        </View>
              <View>
                <Text className="text-BodySmallBold text-neutral-60 mb-2">Phone Number</Text>
                <PhoneInput
                  ref={phoneInputRef}
                  defaultValue={phoneNumber}
                  defaultCode="GH"
                  layout="first"
                  onChangeFormattedText={setFormattedPhone}
                  value={formattedPhone}
                  containerStyle={{ backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', height: 56 }}
                  textContainerStyle={{ backgroundColor: '#F5F5F5', borderRadius: 8, height: 56 }}
                  textInputStyle={{ fontSize: 16, color: '#222' }}
                  codeTextStyle={{ fontSize: 16 }}
                  flagButtonStyle={{}}
                  withShadow={false}
                  autoFocus={false}
                  placeholder="Enter your phone number"
                />
              </View>
        <View>
          <Text className="text-BodySmallBold text-neutral-60 mb-2">Email</Text>
          <TextInput
            className="bg-neutral-10 rounded-lg px-4 py-3 text-BodyBold text-neutral-40 border border-neutral-20"
            value={email}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>
              {successMsg ? <Text className="text-green-600 text-center mt-2">{successMsg}</Text> : null}
              {errorMsg ? <Text className="text-red-600 text-center mt-2">{errorMsg}</Text> : null}
      </View>
      {/* Save Button */}
      <View className="px-6 mt-10">
        <TouchableOpacity
          className={`bg-primary rounded-lg py-4 items-center ${saving ? 'opacity-60' : ''}`}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-BodyBold">Save Changes</Text>}
        </TouchableOpacity>
      </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile; 
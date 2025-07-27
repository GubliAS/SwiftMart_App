import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/constants/env';
import { useRef } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { CLOUDINARY_CONFIG, getCloudinaryUploadUrl } from '@/constants/cloudinary';

const defaultProfilePic = require('@/assets/images/userPic.jpeg');

const requestPermissions = async () => {
  await ImagePicker.requestCameraPermissionsAsync();
  await ImagePicker.requestMediaLibraryPermissionsAsync();
};

// Helper function to clean phone number
const cleanPhoneNumber = (phone: string) => {
  // Remove any non-digit characters except the + at the start
  return phone.replace(/[^\d+]/g, '').replace(/^\+*/, '+');
};

const EditProfile = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { token } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email] = useState(user.email);
  const [photo, setPhoto] = useState<any>(user.photo);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null); // Store local photo URI
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+233'); // Default to Ghana
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // Clean and split the phone number when initializing
  useEffect(() => {
    if (user.phoneNumber) {
      const cleaned = cleanPhoneNumber(user.phoneNumber);
      // Split into country code and number
      const match = cleaned.match(/^\+(\d{1,4})(.*)/);
      if (match) {
        setCountryCode(`+${match[1]}`);
        setPhoneNumber(match[2]);
      } else {
        setPhoneNumber(cleaned);
      }
    }
  }, [user.phoneNumber]);

  // Fetch country data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/codes"
        );
        const data = await response.json();

        const countryItems = data.data.map((country: any, index: number) => ({
          label: country.name,
          value: country.dial_code,
          key: `${country.dial_code}_${index}`,
        }));

        setItems(countryItems);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, []);

  const uploadImageToCloudinary = async (imageUri: string) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-photo.jpg',
      } as any);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      
      const response = await fetch(getCloudinaryUploadUrl(), {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      } else {
        const errorText = await response.text();
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePhotoPress = async () => {
    await requestPermissions();
    const options = ['Take Photo', 'Choose from Gallery', 'Remove Photo', 'Cancel'];
    const cancelButtonIndex = 3;
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
          // Store the local URI for later upload
          setSelectedPhotoUri(result.assets[0].uri);
          // Show preview immediately
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
          // Store the local URI for later upload
          setSelectedPhotoUri(result.assets[0].uri);
          // Show preview immediately
          setPhoto({ uri: result.assets[0].uri });
        }
      } else if (selectedIndex === 2) {
        // Remove Photo
        setSelectedPhotoUri('DELETE'); // Special flag to indicate deletion
        setPhoto(null); // Clear the photo preview
      }
    });
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First and last name are required.');
      return false;
    }
    // E.164: +[country][number], 8-15 digits total
    const fullNumber = countryCode + phoneNumber;
    if (fullNumber && !/^\+[1-9]\d{7,14}$/.test(fullNumber)) {
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

    try {
      let photoUrl = null;
      
      // Handle photo operations
      if (selectedPhotoUri === 'DELETE') {
        // User wants to delete the photo
        photoUrl = null; // This will clear the photo in the backend
      } else if (selectedPhotoUri) {
        // Upload new photo to Cloudinary
        photoUrl = await uploadImageToCloudinary(selectedPhotoUri);
      }

      const fullPhoneNumber = phoneNumber ? countryCode + phoneNumber : '';

      const requestBody = { 
        firstName, 
        lastName, 
        phoneNumber: fullPhoneNumber,
        photoUrl: photoUrl || user.photo?.uri || null
      };

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        // Update user context with new data
        const updatedPhoto = selectedPhotoUri === 'DELETE' ? null : (photoUrl ? { uri: photoUrl } : photo);
        setUser((prev) => ({ 
          ...prev, 
          firstName, 
          lastName, 
          phoneNumber: fullPhoneNumber,
          photo: updatedPhoto
        }));
        
        setSuccessMsg('Profile updated successfully! You can now go back to see your changes.');
        setSaving(false);
        // Don't navigate automatically - let user navigate manually to avoid hot reload issues
      } else {
        let errMsg = 'Failed to update profile.';
        try {
          const errText = await res.text();
          if (errText) {
            try {
              const errJson = JSON.parse(errText);
              errMsg = errJson.error || errJson.message || errMsg;
            } catch {
              errMsg = errText;
            }
          }
        } catch (e) {
          errMsg = `HTTP ${res.status}: ${res.statusText}`;
        }
        setErrorMsg(errMsg);
        setSaving(false);
      }
    } catch (e) {
      setErrorMsg('Network error. Please check your connection and try again.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()} disabled={saving}>
          <Feather name="arrow-left" size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">Edit Profile</Text>
        <        TouchableOpacity onPress={() => {
          setFirstName(user.firstName);
          setLastName(user.lastName);
          if (user.phoneNumber) {
            const cleaned = cleanPhoneNumber(user.phoneNumber);
            const match = cleaned.match(/^\+(\d{1,4})(.*)/);
            if (match) {
              setCountryCode(`+${match[1]}`);
              setPhoneNumber(match[2]);
            }
          }
          setPhoto(user.photo);
          setSelectedPhotoUri(null);
          setErrorMsg('');
          setSuccessMsg('');
          router.back();
        }} disabled={saving}>
          <Text className="text-lg text-neutral-60">Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Profile Photo Section */}
            <View className="bg-white px-4 py-6">
              <View className="items-center">
                <View className="relative">
                  <TouchableOpacity 
                    onPress={handlePhotoPress} 
                    disabled={saving}
                    className="rounded-full w-24 h-24 overflow-hidden border-4 border-primary/20 bg-neutral-10 items-center justify-center"
                  >
                    <Image 
                      source={photo && selectedPhotoUri !== 'DELETE' ? photo : defaultProfilePic} 
                      style={{ width: 96, height: 96, borderRadius: 48 }} 
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  
                  {/* Edit Button - Positioned like in main profile */}
                  <TouchableOpacity 
                    onPress={handlePhotoPress}
                    disabled={saving}
                    className="absolute -bottom-1 -right-1 bg-primary rounded-full p-2 shadow-sm"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Feather name="edit-2" size={16} color="white" />
                  </TouchableOpacity>
                </View>
                
                <Text className="text-BodySmallRegular text-neutral-60 mt-3 text-center">
                  Tap to change profile photo
                </Text>
                {selectedPhotoUri && selectedPhotoUri !== 'DELETE' && (
                  <Text className="text-BodySmallRegular text-primary mt-1 text-center">
                    Photo will be uploaded when you save
                  </Text>
                )}
                {selectedPhotoUri === 'DELETE' && (
                  <Text className="text-BodySmallRegular text-alert mt-1 text-center">
                    Photo will be removed when you save
                  </Text>
                )}
              </View>
            </View>

            {/* Form Section */}
            <View className="bg-white mt-2 px-4 py-6">
              <View className="gap-6">
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
                  <View className="flex-row items-center gap-2">
                    {/* Country Code Dropdown */}
                    <View className="w-[40%]">
                      <DropDownPicker
                        open={open}
                        value={countryCode}
                        items={items}
                        setOpen={setOpen}
                        setValue={setCountryCode}
                        setItems={setItems}
                        searchable={true}
                        searchTextInputStyle={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                          color: "#404040",
                        }}
                        placeholder="Select a country"
                        style={{
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                          borderRadius: 8,
                          backgroundColor: "#F8F8F8",
                        }}
                        dropDownContainerStyle={{
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                          borderRadius: 8,
                        }}
                        itemKey="key"
                        listMode="MODAL"
                        modalProps={{
                          presentationStyle: 'pageSheet',
                        }}
                        modalContentContainerStyle={{
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}

                      />
                    </View>

                    {/* Phone Number Input */}
                    <View className="flex-1">
                      <TextInput
                        className="bg-neutral-10 rounded-lg px-4 py-3 text-BodyBold text-text border border-neutral-20"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter phone number"
                        placeholderTextColor="#C2C2C2"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
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
                
                {successMsg ? (
                  <View className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <Text className="text-green-700 text-center text-BodySmallRegular">{successMsg}</Text>
                  </View>
                ) : null}
                
                {errorMsg ? (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <Text className="text-red-700 text-center text-BodySmallRegular">{errorMsg}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Save Button */}
            <View className="px-4 py-6 bg-white mt-2">
              {successMsg ? (
                <View className="gap-4">
                  <TouchableOpacity
                    className="bg-primary rounded-lg py-4 items-center"
                    onPress={() => router.back()}
                    style={{
                      shadowColor: '#156651',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <Text className="text-white text-BodyBold">Go Back to Profile</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className={`bg-primary rounded-lg py-4 items-center ${saving ? 'opacity-60' : ''}`}
                  onPress={handleSave}
                  disabled={saving}
                  style={{
                    shadowColor: '#156651',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-BodyBold">Save Changes</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile; 
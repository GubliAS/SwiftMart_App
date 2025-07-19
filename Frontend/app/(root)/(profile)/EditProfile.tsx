import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';

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
  const { showActionSheetWithOptions } = useActionSheet();
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [photo, setPhoto] = useState<any>(user.photo);
  const [saving, setSaving] = useState(false);

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

  const handleSave = () => {
    setSaving(true);
    setUser((prev) => ({ ...prev, name, photo }));
    setTimeout(() => {
      setSaving(false);
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl text-primary">←</Text>
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

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
          <Text className="text-BodySmallBold text-neutral-60 mb-2">Name</Text>
          <TextInput
            className="bg-neutral-10 rounded-lg px-4 py-3 text-BodyBold text-text border border-neutral-20"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#C2C2C2"
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
      </View>

      {/* Save Button */}
      <View className="px-6 mt-10">
        <TouchableOpacity
          className={`bg-primary rounded-lg py-4 items-center ${saving ? 'opacity-60' : ''}`}
          onPress={handleSave}
          disabled={saving}
        >
          <Text className="text-white text-BodyBold">{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile; 
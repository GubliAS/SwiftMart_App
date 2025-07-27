import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CountryPicker from '@/app/components/AddressCountryPicker';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { fetchAddresses, updateAddress, Address } from '@/app/api/addressApi';
import { BASE_URL } from '@/constants/env';
import { countries } from '@/constants/countries';

const countryNameToId = Object.fromEntries([
  ["Afghanistan", 1], ["Albania", 2], ["Algeria", 3], ["Andorra", 4], ["Angola", 5], ["Antigua and Barbuda", 6], ["Argentina", 7], ["Armenia", 8], ["Australia", 9], ["Austria", 10], ["Azerbaijan", 11], ["Bahamas", 12], ["Bahrain", 13], ["Bangladesh", 14], ["Barbados", 15], ["Belarus", 16], ["Belgium", 17], ["Belize", 18], ["Benin", 19], ["Bhutan", 20], ["Bolivia", 21], ["Bosnia and Herzegovina", 22], ["Botswana", 23], ["Brazil", 24], ["Brunei", 25], ["Bulgaria", 26], ["Burkina Faso", 27], ["Burundi", 28], ["Cabo Verde", 29], ["Cambodia", 30], ["Cameroon", 31], ["Canada", 32], ["Central African Republic", 33], ["Chad", 34], ["Chile", 35], ["China", 36], ["Colombia", 37], ["Comoros", 38], ["Congo, Democratic Republic of the", 39], ["Congo, Republic of the", 40], ["Costa Rica", 41], ["Cote d'Ivoire", 42], ["Croatia", 43], ["Cuba", 44], ["Cyprus", 45], ["Czech Republic", 46], ["Denmark", 47], ["Djibouti", 48], ["Dominica", 49], ["Dominican Republic", 50], ["Ecuador", 51], ["Egypt", 52], ["El Salvador", 53], ["Equatorial Guinea", 54], ["Eritrea", 55], ["Estonia", 56], ["Eswatini", 57], ["Ethiopia", 58], ["Fiji", 59], ["Finland", 60], ["France", 61], ["Gabon", 62], ["Gambia", 63], ["Georgia", 64], ["Germany", 65], ["Ghana", 66], ["Greece", 67], ["Grenada", 68], ["Guatemala", 69], ["Guinea", 70], ["Guinea-Bissau", 71], ["Guyana", 72], ["Haiti", 73], ["Honduras", 74], ["Hungary", 75], ["Iceland", 76], ["India", 77], ["Indonesia", 78], ["Iran", 79], ["Iraq", 80], ["Ireland", 81], ["Israel", 82], ["Italy", 83], ["Jamaica", 84], ["Japan", 85], ["Jordan", 86], ["Kazakhstan", 87], ["Kenya", 88], ["Kiribati", 89], ["Korea, North", 90], ["Korea, South", 91], ["Kosovo", 92], ["Kuwait", 93], ["Kyrgyzstan", 94], ["Laos", 95], ["Latvia", 96], ["Lebanon", 97], ["Lesotho", 98], ["Liberia", 99], ["Libya", 100], ["Liechtenstein", 101], ["Lithuania", 102], ["Luxembourg", 103], ["Madagascar", 104], ["Malawi", 105], ["Malaysia", 106], ["Maldives", 107], ["Mali", 108], ["Malta", 109], ["Marshall Islands", 110], ["Mauritania", 111], ["Mauritius", 112], ["Mexico", 113], ["Micronesia", 114], ["Moldova", 115], ["Monaco", 116], ["Mongolia", 117], ["Montenegro", 118], ["Morocco", 119], ["Mozambique", 120], ["Myanmar", 121], ["Namibia", 122], ["Nauru", 123], ["Nepal", 124], ["Netherlands", 125], ["New Zealand", 126], ["Nicaragua", 127], ["Niger", 128], ["Nigeria", 129], ["North Macedonia", 130], ["Norway", 131], ["Oman", 132], ["Pakistan", 133], ["Palau", 134], ["Palestine", 135], ["Panama", 136], ["Papua New Guinea", 137], ["Paraguay", 138], ["Peru", 139], ["Philippines", 140], ["Poland", 141], ["Portugal", 142], ["Qatar", 143], ["Romania", 144], ["Russia", 145], ["Rwanda", 146], ["Saint Kitts and Nevis", 147], ["Saint Lucia", 148], ["Saint Vincent and the Grenadines", 149], ["Samoa", 150], ["San Marino", 151], ["Sao Tome and Principe", 152], ["Saudi Arabia", 153], ["Senegal", 154], ["Serbia", 155], ["Seychelles", 156], ["Sierra Leone", 157], ["Singapore", 158], ["Slovakia", 159], ["Slovenia", 160], ["Solomon Islands", 161], ["Somalia", 162], ["South Africa", 163], ["South Sudan", 164], ["Spain", 165], ["Sri Lanka", 166], ["Sudan", 167], ["Suriname", 168], ["Sweden", 169], ["Switzerland", 170], ["Syria", 171], ["Taiwan", 172], ["Tajikistan", 173], ["Tanzania", 174], ["Thailand", 175], ["Togo", 176], ["Tonga", 177], ["Trinidad and Tobago", 178], ["Tunisia", 179], ["Turkey", 180], ["Turkmenistan", 181], ["Tuvalu", 182], ["Uganda", 183], ["Ukraine", 184], ["United Arab Emirates", 185], ["United Kingdom", 186], ["United States", 187], ["Uruguay", 188], ["Uzbekistan", 189], ["Vanuatu", 190], ["Vatican City", 191], ["Venezuela", 192], ["Vietnam", 193], ["Yemen", 194], ["Zambia", 195], ["Zimbabwe", 196]
]);
const countryIdToName = Object.fromEntries(Object.entries(countryNameToId).map(([name, id]) => [String(id), name]));

const EditAddressScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editMode = true;
  const returnTo = params.returnTo as string;
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    country: 'Ghana',
    countryCode: '+233',
    name: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    zipCode: '',
    postalCode: '',
    unitNumber: '',
    streetNumber: '',
    addressLine1: '',
    addressLine2: '',
    isDefault: false
  });

  // Load address data for edit mode
  useEffect(() => {
    if (params.addressId && user?.id && token) {
      const loadAddress = async () => {
        try {
          const addresses = await fetchAddresses(user.id as string, token);
          const address = addresses.find((a: any) => String(a.id) === String(params.addressId));
          if (address) {
            const countryName = countryIdToName[String(address.countryId)];
            const countryObj = countries.find(c => c.name === countryName);
            setFormData({
              country: countryName || '',
              countryCode: countryObj ? countryObj.code : '+233',
              name: address.name ? String(address.name) : '',
              phone: address.phone ? String(address.phone) : '',
              street: address.street ? String(address.street) : '',
              city: address.city ? String(address.city) : '',
              region: address.region ? String(address.region) : '',
              postalCode: address.postalCode ? String(address.postalCode) : '',
              zipCode: address.postalCode ? String(address.postalCode) : '',
              unitNumber: address.unitNumber ? String(address.unitNumber) : '',
              streetNumber: address.streetNumber ? String(address.streetNumber) : '',
              addressLine1: address.addressLine1 ? String(address.addressLine1) : '',
              addressLine2: address.addressLine2 ? String(address.addressLine2) : '',
              isDefault: !!address.isDefault
            });
          }
        } catch (error) {
          setErrorMsg('Failed to load address for editing.');
        }
      };
      loadAddress();
    }
  }, [params.addressId, user, token]);

  const validateForm = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.city.trim() || !formData.region.trim() || !formData.postalCode.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return false;
    }
    if (!/^[0-9+]{8,15}$/.test(formData.phone)) {
      setErrorMsg('Phone number must be 8-15 digits.');
      return false;
    }
    if (!/^\d{3,10}$/.test(formData.postalCode)) {
      setErrorMsg('ZIP code must be 3-10 digits.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !token) return;
    if (!user?.id) {
      setErrorMsg('User ID is missing. Please log in again.');
      return;
    }
    try {
      const addressPayload: Partial<Address> = {
        ...formData,
        countryId: countryNameToId[formData.country] || 66,
        id: params.addressId,
      };
      await updateAddress(addressPayload, token);
      router.back();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to update address. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            router.back();
          }}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">Back</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">
          Edit Address
        </Text>
      </View>

      <ScrollView className="px-4 pt-4 pb-40" keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Country/Region */}
        <View className="mb-1">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            Country/Region
          </Text>
          <CountryPicker
            selectedCountry={formData.country}
            onSelect={(country, code, flag) =>
              setFormData({ ...formData, country, countryCode: code })
            }
          />
        </View>

        {/* Contact Information */}
        <Text className="text-BodyBold font-Manrope text-neutral-80 mb-2">
          Contact Information
        </Text>
        
        <View className="mb-3">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            Contact name*
          </Text>
          <TextInput
            className="border border-neutral-200 rounded-lg p-4 font-Manrope"
            placeholder="Enter contact name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />
        </View>

        <View className="mb-3">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            Phone number*
          </Text>
          <View className="flex-row">
            <View className="border border-neutral-200 rounded-l-lg p-4 justify-center w-20">
              <Text className="font-Manrope">{formData.countryCode}</Text>
            </View>
            <TextInput
              className="flex-1 border border-neutral-200 rounded-r-lg p-4 font-Manrope border-l-0"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>
        </View>

        {/* Address */}
        <Text className="text-BodyBold font-Manrope text-neutral-80 mb-2">
          Address
        </Text>
        
        <View className="mb-3">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            Street, house/apartment/unit*
          </Text>
          <TextInput
            className="border border-neutral-200 rounded-lg p-4 font-Manrope"
            placeholder="Enter street address"
            value={formData.street}
            onChangeText={(text) => setFormData({...formData, street: text})}
          />
        </View>

        <View className="mb-3">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            City*
          </Text>
          <TextInput
            className="border border-neutral-200 rounded-lg p-4 font-Manrope"
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
          />
        </View>

        <View className="mb-3">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            State/Province*
          </Text>
          <TextInput
            className="border border-neutral-200 rounded-lg p-4 font-Manrope"
            placeholder="Enter state/province"
            value={formData.region}
            onChangeText={(text) => setFormData({...formData, region: text})}
          />
        </View>

        <View className="mb-4">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-1">
            ZIP code*
          </Text>
          <TextInput
            className="border border-neutral-200 rounded-lg p-4 font-Manrope"
            placeholder="Enter ZIP code"
            keyboardType="numeric"
            value={formData.postalCode}
            onChangeText={(text) => setFormData({...formData, postalCode: text})}
          />
        </View>

        {/* Set as Default */}
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => setFormData({...formData, isDefault: !formData.isDefault})}
        >
          <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
            formData.isDefault ? 'bg-primary border-primary' : 'border-neutral-400'
          }`}>
            {formData.isDefault && (
              <View className="w-2 h-2 rounded-full bg-white m-auto" />
            )}
          </View>
          <Text className="text-BodyRegular font-Manrope text-text">
            Set as default address
          </Text>
        </TouchableOpacity>
        {errorMsg ? <Text className="text-alert text-center mt-2">{errorMsg}</Text> : null}
      </ScrollView>

      {/* Save Button */}
      <View className="p-4 bg-white border-t border-neutral-200">
        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center"
          onPress={handleSave}
        >
          <Text className="text-BodyBold font-Manrope text-neutral-10">
            Update Address
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditAddressScreen; 
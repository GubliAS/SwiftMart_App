import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AlignLeft, Calendar, Shield } from 'lucide-react-native'; // Update import
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Checkout: { savedCard?: any; savedMobile?: any };
  // ...other routes if needed
};

// Image imports
const visaIcon = require('../../../assets/images/visa.png');
const mastercardIcon = require('../../../assets/images/mastercard.png');
const visaMastercardIcon = require('../../../assets/images/visa-mastercard.png');
const mtnIcon = require('../../../assets/images/mtn.png');
const vodafoneIcon = require('../../../assets/images/vodafone.png');
const airteltigoIcon = require('../../../assets/images/airteltigo.png');

type PaymentFormProps = {
  type: 'card' | 'mobile';
  onSave: (data: any) => void;
  onCancel: () => void;
};

const PaymentFormScreen = ({ type, onSave, onCancel }: PaymentFormProps) => {
  const [card, setCard] = useState({
    type: 'VISA',
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mobileMoney, setMobileMoney] = useState({
    network: 'MTN',
    phone: ''
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginLeft: 16 }}>{'<'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getCardIcon = () => {
    switch (card.type) {
      case 'VISA': return visaIcon;
      case 'MasterCard': return mastercardIcon;
      case 'VISA/MasterCard': return visaMastercardIcon;
      default: return null;
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case 'MTN': return mtnIcon;
      case 'Vodafone': return vodafoneIcon;
      case 'AirtelTigo': return airteltigoIcon;
      default: return null;
    }
  };

  const handleSave = () => {
    if (type === 'card') {
      const cardData = {
        type: card.type,
        last4: card.number.slice(-4),
        number: card.number,
        expiry: card.expiry,
      };
      onSave && onSave(cardData);
      navigation.navigate('Checkout', {
        savedCard: {
          type: card.type,
          last4: card.number.slice(-4),
          number: card.number,
          expiry: card.expiry,
        }
      });
    } else {
      const mobileData = {
        type: 'MobileMoney',
        network: mobileMoney.network,
        last4: mobileMoney.phone.slice(-4),
        phone: mobileMoney.phone,
      };
      onSave && onSave(mobileData);
      navigation.navigate('Checkout', { savedCard: mobileData }); // <-- Use savedCard here!
    }
  };

  const isCardValid = card.number && card.expiry && card.cvv;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View className="flex-1">
        <ScrollView className="px-4 pt-4 pb-24">
          {type === 'card' ? (
            <>
              {/* Card Type Selector */}
              <View className="mb-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">Card Type</Text>
                <View className="flex-row space-x-2">
                  {[
                    { type: 'VISA', icon: visaIcon },
                    { type: 'MasterCard', icon: mastercardIcon }
                  ].map(({ type: cardType, icon }) => (
                    <TouchableOpacity
                      key={cardType}
                      className={`p-3 rounded-lg flex-1 items-center ${
                        card.type === cardType ? 'bg-primary/10 border border-primary' : 'bg-neutral-10'
                      }`}
                      onPress={() => setCard({ ...card, type: cardType })}
                    >
                      <Image
                        source={icon}
                        className="w-12 h-8 mb-1"
                        resizeMode="contain"
                      />
                      <Text className={`font-Manrope ${
                        card.type === cardType ? 'text-primary' : 'text-text'
                      }`}>
                        {cardType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Card Number */}
              <View className="mb-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">Card Number</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(244, 237, 216, 0.5)',
                    borderColor: '#156651',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <AlignLeft color="#156651" size={20} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: 'Manrope-Regular',
                      fontSize: 16,
                      color: '#222',
                      backgroundColor: 'transparent',
                      paddingVertical: 18, // Increased from 10 to 18
                      minHeight: 48,       // Ensures a minimum height
                    }}
                    placeholder="Enter Card Number"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="numeric"
                    value={card.number}
                    onChangeText={(text) => setCard({ ...card, number: text })}
                  />
                </View>
              </View>

              {/* Expiry */}
              <View className="mb-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">Expiry</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(244, 237, 216, 0.5)',
                    borderColor: '#156651',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <Calendar color="#156651" size={20} style={{ marginRight: 8 }} /> {/* Changed icon */}
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: 'Manrope-Regular',
                      fontSize: 16,
                      color: '#222',
                      backgroundColor: 'transparent',
                      paddingVertical: 18, // Increased
                      minHeight: 48,       // Ensures a minimum height
                    }}
                    placeholder="MM/YY"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="numeric"
                    value={card.expiry}
                    onChangeText={(text) => setCard({ ...card, expiry: text })}
                  />
                </View>
              </View>

              {/* CVV */}
              <View className="mb-6">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">CVV</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(244, 237, 216, 0.5)',
                    borderColor: '#156651',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <Shield color="#156651" size={20} style={{ marginRight: 8 }} /> {/* Changed icon */}
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: 'Manrope-Regular',
                      fontSize: 16,
                      color: '#222',
                      backgroundColor: 'transparent',
                      paddingVertical: 18, // Increased
                      minHeight: 48,       // Ensures a minimum height
                    }}
                    placeholder="CVV"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="numeric"
                    secureTextEntry
                    value={card.cvv}
                    onChangeText={(text) => setCard({ ...card, cvv: text })}
                  />
                </View>
              </View>

            
              
            </>
          ) : (
            <>
              {/* Network Selector */}
              <View className="mb-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">Network Type</Text>
                <View className="flex-row space-x-2">
                  {['MTN', 'Vodafone', 'AirtelTigo'].map(network => (
                    <TouchableOpacity
                      key={network}
                      className={`p-3 rounded-lg flex-1 items-center ${
                        mobileMoney.network === network ? 'bg-primary/10 border border-primary' : 'bg-neutral-10'
                      }`}
                      onPress={() => setMobileMoney({...mobileMoney, network})}
                    >
                      <Image 
                        source={getNetworkIcon(network)} // Pass network here
                        className="w-12 h-8 mb-1" 
                        resizeMode="contain"
                      />
                      <Text className={`font-Manrope ${
                        mobileMoney.network === network ? 'text-primary' : 'text-text'
                      }`}>
                        {network}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Phone Number */}
              <View className="mb-6">
                <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-2">Phone Number</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(244, 237, 216, 0.5)',
                    borderColor: '#156651',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <AlignLeft color="#156651" size={20} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: 'Manrope-Regular',
                      fontSize: 16,
                      color: '#222',
                      backgroundColor: 'transparent',
                      paddingVertical: 10,
                    }}
                    placeholder="Enter Phone Number"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="phone-pad"
                    value={mobileMoney.phone}
                    onChangeText={(text) => setMobileMoney({ ...mobileMoney, phone: text })}
                  />
                </View>
              </View>
            </>
          )}

          {/* Save Button */}
          <View style={{ marginTop: 32 }}>
            <TouchableOpacity
              className="bg-primary rounded-lg p-4 items-center"
              onPress={handleSave}
            >
              <Text className="text-BodyBold font-Manrope text-neutral-10">
                {type === 'card' ? 'Add Card' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PaymentFormScreen;
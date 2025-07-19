import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock,
  Send,
  MessageSquare
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const ContactUsScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to send the message
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      Alert.alert(
        'Message Sent!', 
        'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+233558970004');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@swiftmart.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=233558970004&text=Hello, I need help with SwiftMart');
  };

  const handleLocation = () => {
    // Open Google Maps with the office location
    Linking.openURL('https://maps.google.com/?q=Accra,Ghana');
  };

  const ContactOption = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    action, 
    color = "#156651",
    bgColor = "#F4EDD8"
  }) => (
    <TouchableOpacity 
      className="flex-row items-center p-4 bg-white rounded-xl mb-3"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
      onPress={action}
    >
      <View className={`w-12 h-12 ${bgColor} rounded-lg items-center justify-center mr-4`}>
        <Icon size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-BodyBold text-text">{title}</Text>
        <Text className="text-BodySmallRegular text-neutral-60">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const ContactInfo = ({ icon: Icon, title, value, color = "#156651" }) => (
    <View className="flex-row items-center mb-4">
      <View className="w-8 h-8 bg-primary/10 rounded-lg items-center justify-center mr-3">
        <Icon size={16} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-BodySmallRegular text-neutral-60">{title}</Text>
        <Text className="text-BodyRegular text-text">{value}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-neutral-10"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
          Get in Touch
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Quick Contact Options */}
        <Text className="text-Heading4 font-Manrope text-text mb-4">Quick Contact</Text>

        <ContactOption
          icon={Phone}
          title="Call Us"
          subtitle="+233 55 897 0004"
          action={handleCall}
          color="#156651"
          bgColor="#F4EDD8"
        />

        <ContactOption
          icon={Mail}
          title="Email Us"
          subtitle="support@swiftmart.com"
          action={handleEmail}
          color="#156651"
          bgColor="#F4EDD8"
        />

        <ContactOption
          icon={MessageCircle}
          title="WhatsApp"
          subtitle="Chat with us instantly"
          action={handleWhatsApp}
          color="#25D366"
          bgColor="#E8F5E8"
        />

        <ContactOption
          icon={MapPin}
          title="Visit Us"
          subtitle="Accra, Ghana"
          action={handleLocation}
          color="#156651"
          bgColor="#F4EDD8"
        />

        {/* Office Information */}
        <View className="bg-white rounded-xl p-4 mt-6 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Text className="text-Heading4 font-Manrope text-text mb-4">Office Information</Text>
          
          <ContactInfo
            icon={MapPin}
            title="Address"
            value="123 Main Street, Accra, Ghana"
          />
          
          <ContactInfo
            icon={Phone}
            title="Phone"
            value="+233 55 897 0004"
          />
          
          <ContactInfo
            icon={Mail}
            title="Email"
            value="support@swiftmart.com"
          />
          
          <ContactInfo
            icon={Clock}
            title="Business Hours"
            value="Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM"
          />
        </View>

        {/* Contact Form */}
        <View className="bg-white rounded-xl p-4 mb-6" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
              <MessageSquare size={20} color="#156651" />
            </View>
            <Text className="text-Heading4 font-Manrope text-text">Send us a Message</Text>
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Full Name *</Text>
            <TextInput
              className="border border-neutral-200 rounded-lg p-4 font-Manrope"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Email Address *</Text>
            <TextInput
              className="border border-neutral-200 rounded-lg p-4 font-Manrope"
              placeholder="Enter your email address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Subject */}
          <View className="mb-4">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Subject *</Text>
            <TextInput
              className="border border-neutral-200 rounded-lg p-4 font-Manrope"
              placeholder="What is this about?"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Message */}
          <View className="mb-6">
            <Text className="text-BodyRegular text-neutral-80 mb-2">Message *</Text>
            <TextInput
              className="border border-neutral-200 rounded-lg p-4 font-Manrope"
              placeholder="Tell us how we can help you..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            className={`rounded-lg p-4 items-center flex-row justify-center ${isLoading ? 'bg-neutral-300' : 'bg-primary'}`}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <Send size={20} color="white" className="mr-2" />
            <Text className="text-BodyBold font-Manrope text-white ml-2">
              {isLoading ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View className="bg-blue-50 rounded-xl p-4 mb-8">
          <Text className="text-Heading5 font-Manrope text-blue-800 mb-3">Frequently Asked Questions</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• How do I track my order?</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• How can I return a product?</Text>
          <Text className="text-BodySmallRegular text-blue-700 mb-2">• What payment methods do you accept?</Text>
          <Text className="text-BodySmallRegular text-blue-700">• How long does delivery take?</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ContactUsScreen; 
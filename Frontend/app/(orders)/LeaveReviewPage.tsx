import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, Camera, X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const LeaveReviewPage = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(orders)/TransactionPage');
    }
  };

  // Mock order data for review
  const orderData = {
    id: orderId || 'SWM93284',
    items: [
      {
        id: 1,
        name: 'EXERO Wireless Earbuds',
        price: 230.00,
        image: 'product-placeholder'
      }
    ]
  };

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos.');
      return false;
    }
    return true;
  };

  const handleAddPhotos = () => {
    Alert.alert(
      'Add Photos',
      'Choose how you want to add photos',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickFromGallery }
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length, // Limit total to 5 images
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
      return;
    }

    if (reviewText.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters for your review.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback! Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  const StarRating = () => (
    <View className="flex-row justify-center mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleStarPress(star)}
          className="mx-1"
        >
          <Star
            size={40}
            color={star <= rating ? '#156651' : '#E5E7EB'}
            fill={star <= rating ? '#156651' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Tap to rate';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 relative">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="absolute left-4"
        >
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text">Leave Review</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Order Info */}
        <View className="bg-white border border-neutral-200 rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-BodyBold font-Manrope text-text mb-2">Order #{orderData.id}</Text>
          {orderData.items.map((item, index) => (
            <View key={index} className="flex-row items-center">
              <View className="w-12 h-12 bg-neutral-100 rounded-lg mr-3 items-center justify-center">
                <Text className="text-xs font-Manrope text-neutral-60">IMG</Text>
              </View>
              <View className="flex-1">
                <Text className="text-BodyBold font-Manrope text-text">{item.name}</Text>
                <Text className="text-BodyRegular font-Manrope text-neutral-60">${item.price.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Rating Section */}
        <View className="bg-white border border-neutral-200 rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-BodyBold font-Manrope text-text text-center mb-4">
            How would you rate this product?
          </Text>
          <StarRating />
          <Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">
            {getRatingText()}
          </Text>
        </View>

        {/* Review Text */}
        <View className="bg-white border border-neutral-200 rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-BodyBold font-Manrope text-text mb-3">
            Write your review
          </Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Share your experience with this product..."
            multiline
            numberOfLines={6}
            className="border border-neutral-200 rounded-lg p-3 text-BodyRegular font-Manrope text-text"
            style={{ textAlignVertical: 'top' }}
            maxLength={500}
          />
          <Text className="text-xs font-Manrope text-neutral-60 mt-2 text-right">
            {reviewText.length}/500
          </Text>
        </View>

        {/* Add Photos Section */}
        <View className="bg-white border border-neutral-200 rounded-lg p-4 mb-6 shadow-sm">
          <Text className="text-BodyBold font-Manrope text-text mb-3">
            Add photos (optional)
          </Text>
          
          {/* Selected Images Grid */}
          {selectedImages.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {selectedImages.map((imageUri, index) => (
                <View key={index} className="relative mr-2 mb-2">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-20 h-20 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-alert rounded-full w-6 h-6 items-center justify-center"
                  >
                    <X size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Photo Button */}
          {selectedImages.length < 5 && (
            <TouchableOpacity 
              onPress={handleAddPhotos}
              className="border-2 border-dashed border-neutral-300 rounded-lg p-6 items-center justify-center"
            >
              <Camera size={32} color="#9CA3AF" />
              <Text className="text-BodyRegular font-Manrope text-neutral-60 mt-2">
                Tap to add photos
              </Text>
              <Text className="text-xs font-Manrope text-neutral-60 mt-1">
                Help others by showing your product ({selectedImages.length}/5)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Guidelines */}
        <View className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
          <Text className="text-BodyBold font-Manrope text-text mb-2">Review Guidelines</Text>
          <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">
            • Be honest and helpful to other customers
          </Text>
          <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">
            • Focus on the product quality and your experience
          </Text>
          <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">
            • Avoid personal information or inappropriate content
          </Text>
          <Text className="text-BodyRegular font-Manrope text-neutral-60">
            • Reviews are moderated and may take time to appear
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitReview}
          disabled={isSubmitting}
          className={`py-4 rounded-lg ${
            isSubmitting ? 'bg-neutral-300' : 'bg-primary'
          }`}
        >
          <Text className="text-white text-center font-Manrope font-medium">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveReviewPage;

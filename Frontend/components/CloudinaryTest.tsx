import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CLOUDINARY_CONFIG, isCloudinaryConfigured, getCloudinaryUploadUrl } from '@/constants/cloudinary';

const CloudinaryTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConfiguration = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      console.log('Testing Cloudinary configuration...');
      console.log('Cloud Name:', CLOUDINARY_CONFIG.cloudName);
      console.log('Upload Preset:', CLOUDINARY_CONFIG.uploadPreset);
      console.log('Is Configured:', isCloudinaryConfigured());

      // Check if configuration is set up
      if (!isCloudinaryConfigured()) {
        setTestResult('❌ Cloudinary not configured. Please update cloudinary.ts with your cloud name.');
        Alert.alert(
          'Configuration Error',
          `Current cloud name: ${CLOUDINARY_CONFIG.cloudName}\n\nPlease update the cloud name in Frontend/constants/cloudinary.ts with your actual Cloudinary cloud name.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Test the upload URL
      const uploadUrl = getCloudinaryUploadUrl();
      console.log('Upload URL:', uploadUrl);

      // Try a simple test upload
      const testFormData = new FormData();
      testFormData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      testFormData.append('file', {
        uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        type: 'image/jpeg',
        name: 'test.jpg',
      } as any);

      console.log('Sending test upload to:', uploadUrl);
      console.log('Form data:', testFormData);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: testFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload success:', data);
        setTestResult('✅ Cloudinary configuration is working perfectly!');
        Alert.alert(
          'Success!',
          `Cloudinary is configured correctly!\n\nCloud Name: ${CLOUDINARY_CONFIG.cloudName}\nUpload Preset: ${CLOUDINARY_CONFIG.uploadPreset}\n\nTest upload successful!`,
          [{ text: 'OK' }]
        );
      } else {
        const errorText = await response.text();
        console.error('Upload test failed:', errorText);
        
        if (errorText.includes('upload_preset')) {
          setTestResult('❌ Upload preset not found. Please create preset: swiftmart_profile');
          Alert.alert(
            'Upload Preset Error',
            'The upload preset "swiftmart_profile" was not found. Please create it in your Cloudinary dashboard:\n\n1. Go to Settings → Upload\n2. Add upload preset\n3. Name: swiftmart_profile\n4. Signing Mode: Unsigned\n5. Access Mode: Public',
            [{ text: 'OK' }]
          );
        } else if (errorText.includes('cloud_name')) {
          setTestResult('❌ Cloud name not found. Please check your cloud name.');
          Alert.alert(
            'Cloud Name Error',
            'The cloud name was not found. Please verify your cloud name in the Cloudinary dashboard.',
            [{ text: 'OK' }]
          );
        } else {
          setTestResult(`❌ Upload test failed: ${errorText.substring(0, 100)}...`);
          Alert.alert(
            'Upload Test Failed',
            `Error: ${errorText.substring(0, 200)}`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      Alert.alert(
        'Test Error',
        `An error occurred during testing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5', margin: 10, borderRadius: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        Cloudinary Configuration Test
      </Text>
      
      <TouchableOpacity
        onPress={testConfiguration}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : '#156651',
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isLoading ? 'Testing...' : 'Test Configuration'}
        </Text>
      </TouchableOpacity>
      
      {testResult ? (
        <Text style={{ fontSize: 14, color: testResult.includes('❌') ? '#d32f2f' : '#388e3c' }}>
          {testResult}
        </Text>
      ) : null}
      
      <Text style={{ fontSize: 12, color: '#666', marginTop: 10 }}>
        Cloud Name: {CLOUDINARY_CONFIG.cloudName}
      </Text>
      <Text style={{ fontSize: 12, color: '#666' }}>
        Upload Preset: {CLOUDINARY_CONFIG.uploadPreset}
      </Text>
      <Text style={{ fontSize: 12, color: '#666' }}>
        Upload URL: {getCloudinaryUploadUrl()}
      </Text>
      <Text style={{ fontSize: 12, color: '#666' }}>
        Is Configured: {isCloudinaryConfigured() ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

export default CloudinaryTest; 
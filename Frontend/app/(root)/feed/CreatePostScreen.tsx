import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeed } from '../../context/FeedContext';

const CreatePostScreen = () => {
  const router = useRouter();
  const { mediaUri, mediaType } = useLocalSearchParams();
  const { addPost } = useFeed();
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = () => {
    setPosting(true);
    // Add new post to feed
    addPost({
      type: mediaType,
      videoUrl: mediaType === 'video' ? mediaUri : undefined,
      imageUrl: mediaType === 'image' ? mediaUri : undefined,
      thumbnail: mediaType === 'video' ? undefined : mediaUri,
      duration: '',
      title: description,
      comments: 0,
      likes: '0',
      shares: 0,
      user: {
        id: 'me',
        username: 'You',
        avatar: require('@/assets/images/userPic.jpeg'),
        followers: '0',
        isFollowing: false,
      },
      product: null,
      isLiked: false,
    });
    setTimeout(() => {
      setPosting(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, padding: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                <Text style={{ fontSize: 18, color: '#156651' }}>{'←'}</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#222' }}>Create Post</Text>
            </View>
            {/* Media Preview */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {mediaType === 'video' ? (
                <Video
                  source={{ uri: mediaUri as string }}
                  style={{ width: 280, height: 280, borderRadius: 16, backgroundColor: '#eee' }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: mediaUri as string }}
                  style={{ width: 280, height: 280, borderRadius: 16, backgroundColor: '#eee' }}
                  resizeMode="cover"
                />
              )}
            </View>
            {/* Description Input */}
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Description</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 12,
                padding: 12,
                fontSize: 15,
                minHeight: 80,
                marginBottom: 24,
                backgroundColor: '#FAFAFA',
              }}
              placeholder="Write something about your post..."
              multiline
              value={description}
              onChangeText={setDescription}
            />
            {/* Post Button */}
            <TouchableOpacity
              style={{
                backgroundColor: posting ? '#A7F3D0' : '#156651',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}
              onPress={handlePost}
              disabled={posting}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePostScreen; 
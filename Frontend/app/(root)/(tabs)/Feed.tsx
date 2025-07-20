import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { 
  MessageCircle, 
  User, 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Play,
  X,
  ThumbsUp,
  QrCode,
  Copy,
  Shield,
  Flag,
  UserX,
  ShoppingBag,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useFeed } from '../../context/FeedContext';

const followingUsers = [
  { id: 'f1', username: 'Alice', avatar: require('@/assets/images/userPic.jpeg') },
  { id: 'f2', username: 'Bob', avatar: require('@/assets/images/userPic.jpeg') },
  { id: 'f3', username: 'Charlie', avatar: require('@/assets/images/userPic.jpeg') },
];
const followersUsers = [
  { id: 'r1', username: 'Diana', avatar: require('@/assets/images/userPic.jpeg') },
  { id: 'r2', username: 'Eve', avatar: require('@/assets/images/userPic.jpeg') },
  { id: 'r3', username: 'Frank', avatar: require('@/assets/images/userPic.jpeg') },
];
const suggestedUsers = [
  {
    id: 'suggested1',
    username: 'Anonymous67348086',
    avatar: require('@/assets/images/userPic.jpeg'),
    followers: '0.5K',
  },
  {
    id: 'suggested2',
    username: 'ProductReviewer',
    avatar: require('@/assets/images/userPic.jpeg'),
    followers: '1.2K',
  },
];

const Feed: React.FC = () => {
  const router = useRouter();
  const { posts, setPosts } = useFeed();
  const [activeTab, setActiveTab] = useState<'inspiration' | 'following'>('inspiration');
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleLike = (postId: string) => {
    setPosts((prevPosts: any[]) =>
      prevPosts.map((post: any) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? (parseInt(post.likes) - 1).toString() : (parseInt(post.likes) + 1).toString() }
          : post
      )
    );
  };

  const handleFollow = (userId: string) => {
    setPosts((prevPosts: any[]) =>
      prevPosts.map((post: any) =>
        post.user && post.user.id === userId
          ? { ...post, user: { ...post.user, isFollowing: !post.user.isFollowing } }
          : post
      )
    );
  };

  const handleFollowSuggested = (userId: string) => {
    Alert.alert('Success', 'User followed successfully!');
  };

  const handleRemoveSuggestion = (userId: string) => {
    Alert.alert('Removed', 'Suggestion removed from your feed');
  };

  const handleComment = () => {
    if (comment.trim()) {
      setComment('');
      setShowComments(false);
      Alert.alert('Success', 'Comment added successfully!');
    }
  };

  const handleShare = (platform: string) => {
    Alert.alert('Shared', `Shared to ${platform}`);
    setShowShare(false);
  };

  const handleReport = (type: string) => {
    Alert.alert('Reported', `${type} reported successfully`);
    setShowOptions(false);
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos or videos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      router.push({
        pathname: '/(root)/feed/CreatePostScreen',
        params: { mediaUri: result.assets[0].uri, mediaType: result.assets[0].type },
      });
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/(root)/feed/PostDetailModal', params: { post: JSON.stringify(item) } })}
      style={{ width: '48%', marginBottom: 16 }}
    >
      <View className="bg-white rounded-2xl overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
      <View className="relative">
          <Image source={item.thumbnail || item.imageUrl} className="w-full h-40" resizeMode="cover" />
        {item.type === 'video' && (
            <>
              <View className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1">
                <Text className="text-white text-xs font-bold">{item.duration}</Text>
              </View>
              <View className="absolute inset-0 items-center justify-center flex">
                <Play size={36} color="white" />
          </View>
            </>
          )}
          <View className="absolute left-2 right-2 bottom-2 bg-primary rounded-lg p-2 flex-row items-center" style={{ zIndex: 2 }}>
          <ShoppingBag size={16} color="white" className="mr-2" />
          <View className="flex-1">
              <Text className="text-white text-xs font-bold" numberOfLines={1}>{item.product?.name}</Text>
              <Text className="text-white text-xs">{item.product ? `$${item.product.price}` : ''}</Text>
            </View>
          </View>
        </View>
        <View className="px-3 pt-3 pb-2">
          <Text className="text-BodySmallRegular text-text mb-2" numberOfLines={2}>{item.title}</Text>
        <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity className="flex-row items-center" onPress={() => handleLike(item.id)}>
              <Heart size={16} color={item.isLiked ? '#EF4444' : '#6B7280'} fill={item.isLiked ? '#EF4444' : 'none'} />
            <Text className="text-xs text-neutral-60 ml-1">{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center" onPress={() => { setSelectedPost(item); setShowComments(true); }}>
            <MessageSquare size={16} color="#6B7280" />
            <Text className="text-xs text-neutral-60 ml-1">{item.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center" onPress={() => { setSelectedPost(item); setShowShare(true); }}>
            <Share2 size={16} color="#6B7280" />
            <Text className="text-xs text-neutral-60 ml-1">{item.shares}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center mt-1">
          <Image source={item.user.avatar} className="w-6 h-6 rounded-full mr-2" />
          <View className="flex-1">
              <Text className="text-xs text-text font-medium" numberOfLines={1}>{item.user.username}</Text>
            <Text className="text-xs text-neutral-60">{item.user.followers} followers</Text>
            </View>
          </View>
        </View>
      </View>
          </TouchableOpacity>
  );

  // ...renderSuggestedUser and other UI code would go here...

  const inspirationPosts: any[] = posts;
  const followingPosts: any[] = [];

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 bg-white">
        <Text className="text-Heading2 text-center flex-1 text-text">Feed</Text>
        <View className="absolute right-4 items-center gap-4">
          <TouchableOpacity onPress={handleCameraPress} className="mr-2">
            <Image source={require('@/assets/images/camera-icon.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/Profile')}>
          <User size={24} color="#156651" />
        </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-white ">
        <TouchableOpacity
          className="flex-1 py-4 items-center"
          onPress={() => setActiveTab('inspiration')}
        >
          <Text className={`text-BodyBold ${activeTab === 'inspiration' ? 'text-primary' : 'text-neutral-60'}`}>Inspiration</Text>
          {activeTab === 'inspiration' && (
            <View className="h-1 bg-primary mt-2 w-8" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-4 items-center"
          onPress={() => setActiveTab('following')}
        >
          <Text className={`text-BodyBold ${activeTab === 'following' ? 'text-primary' : 'text-neutral-60'}`}>Following</Text>
          {activeTab === 'following' && (
            <View className="h-1 bg-primary mt-2 w-8" />
          )}
        </TouchableOpacity>
      </View>

      {/* Suggested Users */}
      {activeTab === 'following' && showSuggestions && (
        <View className="bg-white pt-4 pb-2 flex-1">
          <Text className="text-BodyBold text-text mb-3 px-4">Suggested For You</Text>
          <ScrollView className='h-fit  bg-white' contentContainerClassName='h-[170px] bg-white' horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {suggestedUsers.map((item) => (
              <View key={item.id} className="w-40 bg-white rounded-xl p-3 mr-4 " style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <View className="relative">
                  <TouchableOpacity 
                    className="absolute top-1 right-1 z-10"
                    onPress={() => handleRemoveSuggestion(item.id)}
                  >
                    <X size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <View className="items-center">
                    <Image source={item.avatar} className="w-12 h-12 rounded-full mb-2" />
                    <Text className="text-BodySmallRegular text-text text-center mb-1">{item.username}</Text>
                    <Text className="text-xs text-neutral-60 mb-3">{item.followers} followers</Text>
                    <TouchableOpacity
                      className="bg-primary px-4 py-2 rounded-full w-full"
                      onPress={() => handleFollowSuggested(item.id)}
                    >
                      <Text className="text-BodyBold text-white text-center">Follow</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Feed Content */}
      {activeTab === 'inspiration' && (
        <FlatList
          data={inspirationPosts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 32 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderPost}
        />
      )}
      {activeTab === 'following' && (
        <FlatList
          data={followingPosts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 0, paddingBottom: 32, backgroundColor: '#FFFFFF' }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ backgroundColor: '#FFFFFF', paddingTop: 16, paddingBottom: 8 }}>
              {/* Following Section */}
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#222', marginLeft: 20, marginBottom: 8 }}>Following</Text>
              <ScrollView className='overflow-visible' contentContainerClassName='overflow-visible' horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }} style={{ height: 140 }}>
                {followingUsers.map((user) => (
                  <View key={user.id} style={{ width: 140, backgroundColor: '#fff', borderRadius: 20, padding: 12, marginRight: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 3 }}>
                    <Image source={user.avatar} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 6 }} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#222', textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{user.username}</Text>
                    <Text style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>1.2K followers</Text>
                    <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#156651', paddingVertical: 6, paddingHorizontal: 18, width: '100%' }} onPress={() => {/* Unfollow logic here */}}>
                      <Text style={{ color: '#156651', fontWeight: '700', fontSize: 13, textAlign: 'center' }}>Unfollow</Text>
                </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              {/* Followers Section */}
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#222', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>Followers</Text>
              <ScrollView className='overflow-visible' horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }} style={{ height: 140 }}>
                {followersUsers.map((user) => (
                  <View key={user.id} style={{ width: 140, backgroundColor: '#fff', borderRadius: 20, padding: 12, marginRight: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 3 }}>
                    <Image source={user.avatar} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 6 }} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#222', textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{user.username}</Text>
                    <Text style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>1.2K followers</Text>
            </View>
          ))}
      </ScrollView>
              {/* Suggested For You Section */}
              {showSuggestions && suggestedUsers.length > 0 && (
                <>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#222', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>Suggested For You</Text>
                  <ScrollView className='overflow-visible' horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }} style={{ height: 140, marginBottom: 8 }}>
                    {suggestedUsers.map((item) => (
                      <View key={item.id} style={{ width: 140, backgroundColor: '#fff', borderRadius: 20, padding: 12, marginRight: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 3 }}>
                        <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                          <TouchableOpacity onPress={() => handleRemoveSuggestion(item.id)}>
                            <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
                        <Image source={item.avatar} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 6 }} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#222', textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{item.username}</Text>
                        <Text style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{item.followers} followers</Text>
                        <TouchableOpacity style={{ backgroundColor: '#156651', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 18, width: '100%' }} onPress={() => handleFollowSuggested(item.id)}>
                          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13, textAlign: 'center' }}>Follow</Text>
                   </TouchableOpacity>
                 </View>
               ))}
             </ScrollView>
                </>
              )}
            </View>
          }
          renderItem={renderPost}
        />
      )}
    </SafeAreaView>
  );
};

export default Feed;
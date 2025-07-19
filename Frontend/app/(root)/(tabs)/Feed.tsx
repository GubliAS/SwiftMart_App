import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
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
  Gift,
  ShoppingBag,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Mock data for feed posts
const feedData = [
  {
    id: '1',
    type: 'video',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: require('@/assets/images/electronics.png'),
    duration: '00:26',
    title: 'Stylish headphones with good sound quality',
    comments: 251,
    likes: '3K',
    shares: 45,
    user: {
      id: 'user1',
      username: 'Anonymous67348086',
      avatar: require('@/assets/images/userPic.jpeg'),
      followers: '2.5K',
      isFollowing: false,
    },
    product: {
      id: 'prod1',
      name: 'Dazzling Bluetooth Headset Headband Wireless Gaming Headset Universal, Multicolor',
      price: 250.00,
      originalPrice: 500.00,
      discount: 50,
      image: require('@/assets/images/electronics.png'),
    },
    isLiked: false,
  },
  {
    id: '2',
    type: 'video',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: require('@/assets/images/smartphone.jpg'),
    duration: '00:15',
    title: 'Amazing wireless earbuds review',
    comments: 189,
    likes: '2.1K',
    shares: 32,
    user: {
      id: 'user2',
      username: 'TechReviewer',
      avatar: require('@/assets/images/userPic.jpeg'),
      followers: '1.8K',
      isFollowing: true,
    },
    product: {
      id: 'prod2',
      name: 'Premium Wireless Earbuds with Noise Cancellation',
      price: 180.00,
      originalPrice: 300.00,
      discount: 40,
      image: require('@/assets/images/smartphone.jpg'),
    },
    isLiked: true,
  },
  {
    id: '3',
    type: 'image',
    imageUrl: require('@/assets/images/sneakers.jpeg'),
    title: 'Perfect fit for my new sneakers',
    comments: 89,
    likes: '1.2K',
    shares: 18,
    user: {
      id: 'user3',
      username: 'FashionLover',
      avatar: require('@/assets/images/userPic.jpeg'),
      followers: '3.2K',
      isFollowing: false,
    },
    product: {
      id: 'prod3',
      name: 'Comfortable Running Shoes for All Terrains',
      price: 120.00,
      originalPrice: 200.00,
      discount: 40,
      image: require('@/assets/images/sneakers.jpeg'),
    },
    isLiked: false,
  },
];

// Mock suggested users
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

const Feed = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('inspiration');
  const [posts, setPosts] = useState(feedData);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? (parseInt(post.likes) - 1).toString() : (parseInt(post.likes) + 1).toString() }
          : post
      )
    );
  };

  const handleFollow = (userId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.user.id === userId
          ? { ...post, user: { ...post.user, isFollowing: !post.user.isFollowing } }
          : post
      )
    );
  };

  const handleFollowSuggested = (userId: string) => {
    // Handle following suggested users
    Alert.alert('Success', 'User followed successfully!');
  };

  const handleRemoveSuggestion = (userId: string) => {
    // Handle removing suggestion
    Alert.alert('Removed', 'Suggestion removed from your feed');
  };

  const handleComment = () => {
    if (comment.trim()) {
      // Add comment logic here
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

  const renderPost = ({ item }: { item: any }) => (
    <View className="w-[48%] mb-4 bg-white rounded-xl overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
      {/* Video/Image Content */}
      <View className="relative">
        <Image source={item.thumbnail || item.imageUrl} className="w-full h-48" resizeMode="cover" />
        {item.type === 'video' && (
          <View className="absolute top-2 right-2 bg-black/50 rounded px-1 py-1">
            <Text className="text-white text-xs">{item.duration}</Text>
          </View>
        )}
        <TouchableOpacity className="absolute inset-0 items-center justify-center">
          {item.type === 'video' && <Play size={32} color="white" />}
        </TouchableOpacity>
      </View>

      {/* Product Overlay */}
      <View className="absolute bottom-16 left-2 right-2 bg-primary rounded-lg p-2">
        <View className="flex-row items-center">
          <ShoppingBag size={16} color="white" className="mr-2" />
          <View className="flex-1">
            <Text className="text-white text-xs font-bold" numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text className="text-white text-xs">${item.product.price}</Text>
          </View>
        </View>
      </View>

      {/* Post Title */}
      <View className="p-3">
        <Text className="text-BodySmallRegular text-text mb-2">{item.title}</Text>
        
        {/* Social Engagement */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Heart size={16} color={item.isLiked ? "#EF4444" : "#6B7280"} fill={item.isLiked ? "#EF4444" : "none"} />
            <Text className="text-xs text-neutral-60 ml-1">{item.likes}</Text>
          </View>
          <View className="flex-row items-center">
            <MessageSquare size={16} color="#6B7280" />
            <Text className="text-xs text-neutral-60 ml-1">{item.comments}</Text>
          </View>
          <View className="flex-row items-center">
            <Share2 size={16} color="#6B7280" />
            <Text className="text-xs text-neutral-60 ml-1">{item.shares}</Text>
          </View>
        </View>

        {/* User Info */}
        <View className="flex-row items-center">
          <Image source={item.user.avatar} className="w-6 h-6 rounded-full mr-2" />
          <View className="flex-1">
            <Text className="text-xs text-text font-medium">{item.user.username}</Text>
            <Text className="text-xs text-neutral-60">{item.user.followers} followers</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSuggestedUser = ({ item }: { item: any }) => (
    <View className="w-[48%] bg-white rounded-xl p-3 mb-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
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
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white">
        <View className="flex-row items-center flex-1 bg-neutral-100 rounded-full px-4 py-2 mr-3">
          <Search size={20} color="#6B7280" />
          <Text className="text-BodyRegular text-neutral-60 ml-2 flex-1">Q Come Earn Freebies</Text>
          <Gift size={20} color="#156651" />
        </View>
        <TouchableOpacity className="mr-3">
          <MessageCircle size={24} color="#156651" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/Profile')}>
          <User size={24} color="#156651" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-white border-b border-neutral-200">
        <TouchableOpacity
          className="flex-1 py-4 items-center"
          onPress={() => setActiveTab('inspiration')}
        >
          <Text className={`text-BodyBold ${activeTab === 'inspiration' ? 'text-primary' : 'text-neutral-60'}`}>
            Inspiration
          </Text>
          {activeTab === 'inspiration' && (
            <View className="h-1 bg-primary mt-2 w-8" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-4 items-center"
          onPress={() => setActiveTab('following')}
        >
          <Text className={`text-BodyBold ${activeTab === 'following' ? 'text-primary' : 'text-neutral-60'}`}>
            Following
          </Text>
          {activeTab === 'following' && (
            <View className="h-1 bg-primary mt-2 w-8" />
          )}
        </TouchableOpacity>
      </View>

      {/* Suggested Users */}
      {activeTab === 'following' && showSuggestions && (
        <View className="bg-white p-4 border-b border-neutral-200">
          <Text className="text-BodyBold text-text mb-3">Suggested For You</Text>
          <View className="flex-row justify-between">
            {suggestedUsers.map((item) => (
              <View key={item.id} className="w-[48%] bg-white rounded-xl p-3 mb-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
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
          </View>
        </View>
      )}

      {/* Feed Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between px-4 py-4">
          {posts.map((item) => (
            <View key={item.id} className="w-[48%] mb-4 bg-white rounded-xl overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
              {/* Video/Image Content */}
              <View className="relative">
                <Image source={item.thumbnail || item.imageUrl} className="w-full h-48" resizeMode="cover" />
                {item.type === 'video' && (
                  <View className="absolute top-2 right-2 bg-black/50 rounded px-1 py-1">
                    <Text className="text-white text-xs">{item.duration}</Text>
                  </View>
                )}
                <TouchableOpacity className="absolute inset-0 items-center justify-center">
                  {item.type === 'video' && <Play size={32} color="white" />}
                </TouchableOpacity>
              </View>

              {/* Product Overlay */}
              <View className="absolute bottom-16 left-2 right-2 bg-primary rounded-lg p-2">
                <View className="flex-row items-center">
                  <ShoppingBag size={16} color="white" className="mr-2" />
                  <View className="flex-1">
                    <Text className="text-white text-xs font-bold" numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text className="text-white text-xs">${item.product.price}</Text>
                  </View>
                </View>
              </View>

              {/* Post Title */}
              <View className="p-3">
                <Text className="text-BodySmallRegular text-text mb-2">{item.title}</Text>
                
                {/* Social Engagement */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Heart size={16} color={item.isLiked ? "#EF4444" : "#6B7280"} fill={item.isLiked ? "#EF4444" : "none"} />
                    <Text className="text-xs text-neutral-60 ml-1">{item.likes}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MessageSquare size={16} color="#6B7280" />
                    <Text className="text-xs text-neutral-60 ml-1">{item.comments}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Share2 size={16} color="#6B7280" />
                    <Text className="text-xs text-neutral-60 ml-1">{item.shares}</Text>
                  </View>
                </View>

                {/* User Info */}
                <View className="flex-row items-center">
                  <Image source={item.user.avatar} className="w-6 h-6 rounded-full mr-2" />
                  <View className="flex-1">
                    <Text className="text-xs text-text font-medium">{item.user.username}</Text>
                    <Text className="text-xs text-neutral-60">{item.user.followers} followers</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comments Modal */}
      <Modal visible={showComments} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="flex-row items-center justify-between p-4 border-b border-neutral-200">
              <Text className="text-Heading4 font-Manrope text-text">Comments (4)</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View className="p-4 border-b border-neutral-200">
              <Text className="text-BodySmallRegular text-neutral-60">Comments have been auto translated</Text>
              <TouchableOpacity className="mt-2">
                <Text className="text-primary text-BodyBold">Show Original</Text>
              </TouchableOpacity>
            </View>
                         <ScrollView className="flex-1 p-4">
               {[1, 2, 3, 4].map((_, index) => (
                 <View key={index} className="flex-row items-start mb-4">
                   <Image source={require('@/assets/images/userPic.jpeg')} className="w-8 h-8 rounded-full mr-3" />
                   <View className="flex-1">
                     <Text className="text-BodyBold text-text">1062User_6284028137</Text>
                     <Text className="text-BodyRegular text-text">Nice headset. Love it !!</Text>
                     <Text className="text-Caption text-neutral-40">19 Feb 2025</Text>
                   </View>
                   <TouchableOpacity>
                     <ThumbsUp size={16} color="#6B7280" />
                   </TouchableOpacity>
                 </View>
               ))}
             </ScrollView>
            <View className="flex-row items-center p-4 border-t border-neutral-200">
              <TextInput
                className="flex-1 border border-neutral-200 rounded-full px-4 py-2 mr-3"
                placeholder="Leave a comment..."
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity onPress={handleComment} className="bg-primary px-4 py-2 rounded-full">
                <Text className="text-white text-BodyBold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={showShare} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="flex-row items-center justify-between p-4 border-b border-neutral-200">
              <Text className="text-Heading4 font-Manrope text-text">Share</Text>
              <TouchableOpacity onPress={() => setShowShare(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View className="p-6">
              <View className="flex-row justify-around mb-8">
                <TouchableOpacity className="items-center" onPress={() => handleShare('WhatsApp')}>
                  <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-2">
                    <Text className="text-white text-2xl">W</Text>
                  </View>
                  <Text className="text-BodyRegular text-text">WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => handleShare('Facebook')}>
                  <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mb-2">
                    <Text className="text-white text-2xl">f</Text>
                  </View>
                  <Text className="text-BodyRegular text-text">Facebook</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-around">
                <TouchableOpacity className="items-center" onPress={() => handleShare('Copy')}>
                  <Copy size={32} color="#6B7280" />
                  <Text className="text-BodySmallRegular text-neutral-60 mt-2">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => handleShare('QR Code')}>
                  <QrCode size={32} color="#6B7280" />
                  <Text className="text-BodySmallRegular text-neutral-60 mt-2">QR code</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => handleShare('Message')}>
                  <MessageCircle size={32} color="#6B7280" />
                  <Text className="text-BodySmallRegular text-neutral-60 mt-2">Message</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={() => handleShare('More')}>
                  <MoreHorizontal size={32} color="#6B7280" />
                  <Text className="text-BodySmallRegular text-neutral-60 mt-2">More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal visible={showOptions} transparent animationType="slide">
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="p-6">
              <TouchableOpacity 
                className="flex-row items-center mb-6" 
                onPress={() => handleReport('Remove the post')}
              >
                <Heart size={24} color="#EF4444" className="mr-4" />
                <View className="flex-1">
                  <Text className="text-BodyBold text-text">Remove the post</Text>
                  <Text className="text-BodySmallRegular text-neutral-60">Please reduce the amount of content</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center mb-6" 
                onPress={() => handleReport('Block the creator')}
              >
                <UserX size={24} color="#6B7280" className="mr-4" />
                <View className="flex-1">
                  <Text className="text-BodyBold text-text">Block the creator</Text>
                  <Text className="text-BodySmallRegular text-neutral-60">I no longer want to see posts from this store</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center" 
                onPress={() => handleReport('Report the profile/post')}
              >
                <Flag size={24} color="#F59E0B" className="mr-4" />
                <View className="flex-1">
                  <Text className="text-BodyBold text-text">Report the profile/post</Text>
                  <Text className="text-BodySmallRegular text-neutral-60">I am concerned about this creator or post</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

export default Feed;
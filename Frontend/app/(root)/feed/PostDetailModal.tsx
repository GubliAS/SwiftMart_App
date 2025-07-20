import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageSquare, Share2, MoreHorizontal, X } from 'lucide-react-native';

const mockComments = [
  { id: '1', user: 'UserA', avatar: require('@/assets/images/userPic.jpeg'), text: 'Nice post!', date: '1d' },
  { id: '2', user: 'UserB', avatar: require('@/assets/images/userPic.jpeg'), text: 'Love this!', date: '2d' },
  { id: '3', user: 'UserC', avatar: require('@/assets/images/userPic.jpeg'), text: '🔥🔥🔥', date: '3d' },
];

const PostDetailModal = () => {
  const router = useRouter();
  const { post } = useLocalSearchParams();
  const postObj = post ? JSON.parse(post as string) : null;
  const [liked, setLiked] = useState(postObj?.isLiked || false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [showMore, setShowMore] = useState(false);

  if (!postObj) return null;

  const handleLike = () => setLiked((prev) => !prev);
  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([{ id: Date.now().toString(), user: 'You', avatar: require('@/assets/images/userPic.jpeg'), text: comment, date: 'now' }, ...comments]);
      setComment('');
    }
  };

  return (
    <Modal visible animationType="slide" onRequestClose={() => router.back()}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Close Button */}
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 32, right: 24, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <X size={24} color="#222" />
        </TouchableOpacity>
        {/* Media */}
        <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 16 }}>
          {postObj.type === 'video' ? (
            <Video
              source={{ uri: postObj.videoUrl }}
              style={{ width: 320, height: 320, borderRadius: 16, backgroundColor: '#eee' }}
              resizeMode="cover"
              useNativeControls
              isLooping
            />
          ) : (
            <Image
              source={postObj.thumbnail || postObj.imageUrl}
              style={{ width: 320, height: 320, borderRadius: 16, backgroundColor: '#eee' }}
              resizeMode="cover"
            />
          )}
        </View>
        {/* User Info & Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 8 }}>
          <Image source={postObj.user.avatar} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{postObj.user.username}</Text>
            <Text style={{ color: '#888', fontSize: 13 }}>{postObj.user.followers} followers</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#156651', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 18 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Follow</Text>
          </TouchableOpacity>
        </View>
        {/* Description */}
        <Text style={{ marginHorizontal: 24, marginBottom: 8, fontSize: 15 }}>{postObj.title}</Text>
        {/* Product Info */}
        {postObj.product && (
          <View style={{ marginHorizontal: 24, marginBottom: 12, backgroundColor: '#F4EDD8', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={postObj.product.image} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', fontSize: 14 }}>{postObj.product.name}</Text>
              <Text style={{ color: '#156651', fontWeight: '700', fontSize: 14 }}>${postObj.product.price}</Text>
            </View>
          </View>
        )}
        {/* Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
          <TouchableOpacity onPress={handleLike} style={{ alignItems: 'center' }}>
            <Heart size={28} color={liked ? '#EF4444' : '#6B7280'} fill={liked ? '#EF4444' : 'none'} />
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <MessageSquare size={28} color="#6B7280" />
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Share2 size={28} color="#6B7280" />
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMore(true)} style={{ alignItems: 'center' }}>
            <MoreHorizontal size={28} color="#6B7280" />
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>More</Text>
          </TouchableOpacity>
        </View>
        {/* Comments */}
        <View style={{ flex: 1, marginHorizontal: 24, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                <Image source={item.avatar} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14 }}>{item.user}</Text>
                  <Text style={{ fontSize: 14 }}>{item.text}</Text>
                  <Text style={{ color: '#aaa', fontSize: 12 }}>{item.date}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#aaa', fontSize: 14 }}>No comments yet.</Text>}
            style={{ maxHeight: 160 }}
          />
          {/* Add Comment */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 10, fontSize: 15, backgroundColor: '#FAFAFA' }}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity onPress={handleAddComment} style={{ marginLeft: 8, backgroundColor: '#156651', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* More Modal */}
        <Modal visible={showMore} transparent animationType="fade">
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setShowMore(false)} activeOpacity={1}>
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} onPress={() => { setShowMore(false); Alert.alert('Reported', 'Post reported.'); }}>
                <Text style={{ fontSize: 18, color: '#EF4444', fontWeight: '700', marginRight: 12 }}>🚩</Text>
                <Text style={{ fontSize: 16, color: '#222' }}>Report Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} onPress={() => { setShowMore(false); Alert.alert('Blocked', 'User blocked.'); }}>
                <Text style={{ fontSize: 18, color: '#888', fontWeight: '700', marginRight: 12 }}>🚫</Text>
                <Text style={{ fontSize: 16, color: '#222' }}>Block User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowMore(false)}>
                <Text style={{ fontSize: 18, color: '#888', fontWeight: '700', marginRight: 12 }}>❌</Text>
                <Text style={{ fontSize: 16, color: '#222' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default PostDetailModal; 
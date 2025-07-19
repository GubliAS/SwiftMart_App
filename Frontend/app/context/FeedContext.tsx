import React, { createContext, useContext, useState } from 'react';

// Initial mock data for the feed
const initialFeedData: any[] = [
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

const FeedContext = createContext<any>(null);

export const FeedProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<any[]>(initialFeedData);
  const addPost = (post: any) => setPosts((prev: any[]) => [{ ...post, id: Date.now().toString() }, ...prev]);
  return (
    <FeedContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);

export default FeedProvider; 
import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, HStack } from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import HeaderCard from '../components/HeaderCard';
import Card2 from '../components/Card2';
import CardSkeleton from '../components/CardSkeleton';
import { postAPI } from '../services/api';
import { FiRefreshCw, FiCompass } from 'react-icons/fi';

const INITIAL_FALLBACK_POSTS = [
  {
    id: 1,
    content: "Just pitched our camp under the stars at Mount Rainier! Nothing beats crisp mountain air and a warm campfire with great friends. 🏕️🔥",
    feeling: "🏕️ Camping",
    location: "Mount Rainier National Park",
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
    author_name: "Elena Vance",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    likes_count: 24,
    dislikes_count: 0,
    comments_count: 3,
    user_reaction: 'like',
    comments: [
      {
        id: 101,
        content: "Looks absolutely magical! Enjoy every minute.",
        author_name: "Marcus Cole",
        author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    content: "Reflecting on modern web design today. Clean aesthetics, glassmorphism, and instant responsiveness make web apps feel like real software.",
    feeling: "💡 Curious",
    location: "Tech Hub, Seattle",
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    author_name: "Harsh Maurya",
    author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    likes_count: 48,
    dislikes_count: 1,
    comments_count: 2,
    user_reaction: null,
    comments: [],
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
];

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Feed Posts
  const fetchPosts = async () => {
    try {
      const res = await postAPI.getAllPosts();
      if (res.success && res.posts && res.posts.length > 0) {
        setPosts(res.posts);
      } else {
        setPosts(INITIAL_FALLBACK_POSTS);
      }
    } catch (err) {
      console.warn('API error fetching posts, using fallback demo feed:', err.message);
      setPosts(INITIAL_FALLBACK_POSTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Post Created Callback
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Post Deleted Callback
  const handleDeletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  };

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)">
      <Navbar2 title="CampApp" />

      <Box className="main-app-container">
        <Sidebar />

        <Box className="feed-content-wrapper">
          {/* Post Creation Box */}
          <HeaderCard onPostCreated={handlePostCreated} />

          {/* Feed Header */}
          <HStack justify="space-between" mb={4} px={1}>
            <Text fontSize="xs" fontWeight="700" color="var(--text-muted)" textTransform="uppercase" letterSpacing="0.5px">
              Recent Camp Updates
            </Text>
            <Button
              size="2xs"
              variant="ghost"
              color="var(--text-secondary)"
              loading={refreshing}
              onClick={() => {
                setRefreshing(true);
                fetchPosts();
              }}
            >
              <FiRefreshCw style={{ marginRight: 4 }} /> Refresh
            </Button>
          </HStack>

          {/* Posts Feed */}
          {loading ? (
            <VStack gap={4} align="stretch">
              <CardSkeleton />
              <CardSkeleton />
            </VStack>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card2
                key={post.id}
                post={post}
                onDeletePost={handleDeletePost}
              />
            ))
          ) : (
            <Box
              p={10}
              textAlign="center"
              borderRadius="2xl"
              bg="var(--bg-surface)"
              border="1px dashed var(--border-color)"
            >
              <FiCompass size={36} color="var(--brand-primary)" style={{ margin: "0 auto 12px auto" }} />
              <Text fontWeight="700" fontSize="md" color="var(--text-primary)" mb={1}>
                No stories yet!
              </Text>
              <Text fontSize="xs" color="var(--text-muted)">
                Be the first camper to share a moment at the campfire above.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
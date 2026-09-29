import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Text, Button, HStack, Badge } from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import HeaderCard from '../components/HeaderCard';
import Card2 from '../components/Card2';
import CardSkeleton from '../components/CardSkeleton';
import TrendingWidget from '../components/TrendingWidget';
import WhoToFollow from '../components/WhoToFollow';
import BottomNav from '../components/BottomNav';
import { postAPI } from '../services/api';
import { FiRefreshCw, FiCompass, FiHash, FiX } from 'react-icons/fi';

const FALLBACK_POSTS = [
  {
    id: 1,
    content: "Just pitched our tent under the northern lights at Mount Rainier! Nothing beats crisp mountain air and a starry night sky. 🏕️✨ #Camping #Adventure #NightSky",
    feeling: "🏕️ Camping",
    location: "Mount Rainier National Park",
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
    author_name: "Elena Vance",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    likes_count: 24,
    reposts_count: 3,
    comments_count: 2,
    views_count: 1420,
    user_reaction: 'like',
    is_pinned: true,
    comments: [
      {
        id: 101,
        content: "This shot looks unreal! Did you take this on a 35mm lens?",
        author_name: "Marcus Cole",
        author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    content: "Building a microblogging platform in 2026 requires real-time fanout, crisp glassmorphism UI, and effortless interactions. What are your favorite microblogging features? #WebDev #BuildInPublic",
    feeling: "🚀 Productive",
    location: "Tech Hub, Seattle",
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    author_name: "Marcus Cole",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    likes_count: 48,
    reposts_count: 8,
    comments_count: 2,
    views_count: 3105,
    user_reaction: null,
    is_pinned: false,
    comments: [],
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 3,
    content: "Early morning coffee brew overlooking the misty hills of Kyoto. Starting the day with gratitude and quiet reflection. ☕🍵 #Coffee #Travel #Kyoto",
    feeling: "☕ Chill",
    location: "Kyoto, Japan",
    image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80",
    author_name: "Aria Chen",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    likes_count: 19,
    reposts_count: 2,
    comments_count: 0,
    views_count: 890,
    user_reaction: null,
    is_pinned: false,
    comments: [],
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
];

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedType, setFeedType] = useState('for-you'); // 'for-you' | 'following'
  const [activeTag, setActiveTag] = useState(null);
  const [quotePost, setQuotePost] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await postAPI.getAllPosts(feedType, activeTag);
      if (res.success && res.posts && res.posts.length > 0) {
        setPosts(res.posts);
      } else {
        setPosts(FALLBACK_POSTS);
      }
    } catch (err) {
      console.warn('API unavailable, using demo feed:', err.message);
      if (activeTag) {
        // Filter fallback posts by tag
        const filtered = FALLBACK_POSTS.filter(p =>
          p.content.toLowerCase().includes(`#${activeTag.toLowerCase()}`)
        );
        setPosts(filtered.length > 0 ? filtered : FALLBACK_POSTS);
      } else {
        setPosts(FALLBACK_POSTS);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [feedType, activeTag]);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await postAPI.deletePost(postId);
    } catch {
      // Optimistic delete already applied
    }
  };

  const handleSelectTag = (tag) => {
    setActiveTag(tag);
    setLoading(true);
  };

  const handleQuotePost = (post) => {
    setQuotePost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)" pb={{ base: '75px', md: '20px' }}>
      <Navbar2 title="CampApp" />

      <Box className="microblog-container">
        {/* Left Sidebar Navigation */}
        <Box className="microblog-left-sidebar">
          <Sidebar onOpenComposer={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </Box>

        {/* Center Feed */}
        <Box className="microblog-center-feed">
          {/* Post Composer */}
          <HeaderCard
            onPostCreated={handlePostCreated}
            quotePost={quotePost}
            onCancelQuote={() => setQuotePost(null)}
          />

          {/* Feed Type Toggle */}
          <HStack
            bg="var(--bg-surface)"
            border="1px solid var(--border-color)"
            borderRadius="full"
            p={1}
            mb={4}
          >
            {['for-you', 'following'].map((type) => (
              <Button
                key={type}
                flex="1"
                size="sm"
                borderRadius="full"
                fontSize="xs"
                fontWeight="700"
                variant={feedType === type ? 'solid' : 'ghost'}
                bg={feedType === type ? 'var(--brand-primary)' : 'transparent'}
                color={feedType === type ? 'white' : 'var(--text-secondary)'}
                _hover={{ opacity: 0.9 }}
                onClick={() => setFeedType(type)}
              >
                {type === 'for-you' ? '✨ For You' : '👥 Following'}
              </Button>
            ))}
          </HStack>

          {/* Active Tag Filter Banner */}
          {activeTag && (
            <HStack
              mb={4}
              p={3}
              borderRadius="xl"
              bg="var(--brand-glow)"
              border="1px solid var(--brand-primary)"
              justify="space-between"
            >
              <HStack gap={2}>
                <FiHash size={15} color="var(--brand-primary)" />
                <Text fontSize="xs" fontWeight="700" color="var(--brand-primary)">
                  Showing posts tagged #{activeTag}
                </Text>
              </HStack>
              <Button
                size="2xs"
                variant="ghost"
                color="var(--brand-primary)"
                onClick={() => handleSelectTag(null)}
              >
                <FiX size={13} />
              </Button>
            </HStack>
          )}

          {/* Feed Header Row */}
          <HStack justify="space-between" mb={3} px={1}>
            <Text fontSize="xs" fontWeight="700" color="var(--text-muted)" textTransform="uppercase" letterSpacing="0.5px">
              {activeTag ? `#${activeTag}` : feedType === 'for-you' ? 'Camp Updates' : 'Following Feed'}
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
              <CardSkeleton />
            </VStack>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card2
                key={post.id}
                post={post}
                onDeletePost={handleDeletePost}
                onQuotePost={handleQuotePost}
                onSelectTag={handleSelectTag}
              />
            ))
          ) : (
            <Box
              p={10}
              textAlign="center"
              borderRadius="2xl"
              bg="var(--bg-surface)"
              border="1px solid var(--border-color)"
            >
              <FiCompass size={36} color="var(--brand-primary)" style={{ margin: "0 auto 12px auto" }} />
              <Text fontWeight="700" fontSize="md" color="var(--text-primary)" mb={1}>
                {feedType === 'following' ? 'Follow some campers first!' : 'No stories yet!'}
              </Text>
              <Text fontSize="xs" color="var(--text-muted)">
                {feedType === 'following'
                  ? 'Go to "For You" and follow interesting campers to see their posts here.'
                  : 'Be the first camper to share a moment at the campfire above.'}
              </Text>
            </Box>
          )}
        </Box>

        {/* Right Widgets Panel */}
        <Box className="microblog-right-widgets">
          <TrendingWidget activeTag={activeTag} onSelectTag={handleSelectTag} />
          <WhoToFollow />
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenComposer={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </Box>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Text, Button, HStack, Badge } from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import Card2 from '../components/Card2';
import CardSkeleton from '../components/CardSkeleton';
import TrendingWidget from '../components/TrendingWidget';
import WhoToFollow from '../components/WhoToFollow';
import BottomNav from '../components/BottomNav';
import { postAPI } from '../services/api';
import { FiBookmark, FiRefreshCw, FiArrowLeft, FiCompass } from 'react-icons/fi';
import { useNavigate } from 'react-router';

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await postAPI.getAllPosts('bookmarks');
      if (res.success && res.posts) {
        setPosts(res.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.warn('Could not fetch bookmarks:', err.message);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookmarks();
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <Box minH="100vh" bg="var(--bg-primary)" pb={{ base: '70px', md: 8 }}>
      {/* Top Navigation */}
      <Navbar2 />

      {/* Main Responsive Layout */}
      <Box maxW="1280px" mx="auto" px={{ base: 3, sm: 4, md: 6 }} pt={{ base: 3, md: 6 }}>
        <Box display="flex" gap={{ base: 4, lg: 6 }} position="relative">
          
          {/* Left Navigation Sidebar */}
          <Box
            as="aside"
            display={{ base: 'none', md: 'block' }}
            w={{ md: '220px', lg: '250px' }}
            flexShrink={0}
            position="sticky"
            top="80px"
            h="calc(100vh - 100px)"
          >
            <Sidebar />
          </Box>

          {/* Middle Main Content Feed */}
          <Box flex="1" maxW={{ base: '100%', lg: '640px' }} minW="0">
            
            {/* Page Title & Stats Card */}
            <Box
              p={4}
              mb={4}
              borderRadius="2xl"
              bg="var(--bg-surface)"
              border="1px solid var(--border-color)"
              className="glass-panel"
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Button
                    size="xs"
                    variant="ghost"
                    borderRadius="full"
                    display={{ base: 'flex', md: 'none' }}
                    onClick={() => navigate('/home')}
                    p={1}
                  >
                    <FiArrowLeft size={18} />
                  </Button>
                  <Box
                    p={2}
                    borderRadius="xl"
                    bg="var(--brand-glow)"
                    color="var(--brand-primary)"
                  >
                    <FiBookmark size={20} />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="800" color="var(--text-primary)">
                      Bookmarks
                    </Text>
                    <Text fontSize="2xs" color="var(--text-muted)">
                      {posts.length} {posts.length === 1 ? 'saved post' : 'saved posts'}
                    </Text>
                  </Box>
                </HStack>

                <Button
                  size="xs"
                  variant="ghost"
                  borderRadius="full"
                  onClick={handleRefresh}
                  loading={refreshing}
                  color="var(--text-secondary)"
                  _hover={{ color: 'var(--brand-primary)', bg: 'var(--brand-glow)' }}
                >
                  <FiRefreshCw size={14} style={{ marginRight: 4 }} /> Refresh
                </Button>
              </HStack>
            </Box>

            {/* Bookmarks List */}
            {loading ? (
              <VStack gap={4} align="stretch">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </VStack>
            ) : posts.length > 0 ? (
              <VStack gap={3} align="stretch">
                {posts.map((post) => (
                  <Card2
                    key={post.id}
                    post={post}
                    onDeletePost={handleDeletePost}
                  />
                ))}
              </VStack>
            ) : (
              <Box
                p={8}
                textAlign="center"
                bg="var(--bg-surface)"
                borderRadius="2xl"
                border="1px dashed var(--border-color)"
                my={6}
              >
                <Box
                  w={14}
                  h={14}
                  borderRadius="full"
                  bg="var(--brand-glow)"
                  color="var(--brand-primary)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={3}
                >
                  <FiBookmark size={26} />
                </Box>
                <Text fontSize="md" fontWeight="800" color="var(--text-primary)" mb={1}>
                  Save posts for later
                </Text>
                <Text fontSize="xs" color="var(--text-muted)" maxW="320px" mx="auto" mb={4}>
                  Don't let the good ones fly away! Tap the bookmark icon on any post to save it here for quick reference.
                </Text>
                <Button
                  className="brand-button"
                  borderRadius="full"
                  size="sm"
                  onClick={() => navigate('/home')}
                >
                  <FiCompass style={{ marginRight: 6 }} size={16} /> Explore Feed
                </Button>
              </Box>
            )}
          </Box>

          {/* Right Sidebar - Widgets */}
          <Box
            as="aside"
            display={{ base: 'none', lg: 'block' }}
            w="300px"
            flexShrink={0}
            position="sticky"
            top="80px"
            h="calc(100vh - 100px)"
          >
            <VStack gap={4} align="stretch">
              <TrendingWidget onSelectTag={() => navigate('/home')} />
              <WhoToFollow />
            </VStack>
          </Box>

        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </Box>
  );
}

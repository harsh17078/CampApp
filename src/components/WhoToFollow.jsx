import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Avatar, Text, Button, Heading } from '@chakra-ui/react';
import { FiUsers, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { userAPI } from '../services/api';

export default function WhoToFollow() {
  const [suggestions, setSuggestions] = useState([
    {
      id: 2,
      name: 'Marcus Cole',
      bio: 'Fullstack dev & UI designer',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      is_following: false,
    },
    {
      id: 3,
      name: 'Aria Chen',
      bio: 'Digital nomad & coffee lover',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      is_following: false,
    },
  ]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await userAPI.getSuggestions();
        if (res.success && res.suggestions && res.suggestions.length > 0) {
          setSuggestions(res.suggestions);
        }
      } catch (err) {
        console.warn('Suggestions fallback:', err.message);
      }
    };
    fetchSuggestions();
  }, []);

  const handleToggleFollow = async (user) => {
    const targetId = user.id;
    const currentlyFollowing = user.is_following;

    // Optimistic UI update
    setSuggestions((prev) =>
      prev.map((u) => (u.id === targetId ? { ...u, is_following: !currentlyFollowing } : u))
    );

    try {
      if (currentlyFollowing) {
        await userAPI.unfollow(targetId);
      } else {
        await userAPI.follow(targetId);
      }
    } catch {
      // Revert if API failed
      setSuggestions((prev) =>
        prev.map((u) => (u.id === targetId ? { ...u, is_following: currentlyFollowing } : u))
      );
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <Box
      className="glass-card"
      p={4}
      borderRadius="2xl"
      bg="var(--bg-surface)"
      border="1px solid var(--border-color)"
    >
      <HStack justify="space-between" mb={3.5} px={1}>
        <HStack gap={2}>
          <Box p={1.5} borderRadius="lg" bg="var(--brand-glow)" color="var(--brand-primary)">
            <FiUsers size={16} />
          </Box>
          <Heading as="h3" fontSize="sm" fontWeight="800" color="var(--text-primary)">
            Who to Follow
          </Heading>
        </HStack>
      </HStack>

      <VStack align="stretch" gap={3}>
        {suggestions.map((u) => (
          <HStack key={u.id} justify="space-between" align="center">
            <HStack gap={2.5} overflow="hidden">
              <Avatar.Root size="sm" shape="full">
                <Avatar.Image src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} />
                <Avatar.Fallback name={u.name} />
              </Avatar.Root>
              <Box overflow="hidden" maxW="130px">
                <Text fontSize="xs" fontWeight="700" isTruncated color="var(--text-primary)">
                  {u.name}
                </Text>
                <Text fontSize="3xs" color="var(--text-muted)" isTruncated>
                  {u.bio || '@camper'}
                </Text>
              </Box>
            </HStack>

            <Button
              size="2xs"
              variant={u.is_following ? 'outline' : 'solid'}
              className={u.is_following ? '' : 'brand-button'}
              borderRadius="full"
              px={3}
              fontSize="2xs"
              fontWeight="700"
              borderColor="var(--border-color)"
              color={u.is_following ? 'var(--text-secondary)' : 'white'}
              onClick={() => handleToggleFollow(u)}
            >
              {u.is_following ? (
                <>
                  <FiUserCheck style={{ marginRight: 4 }} /> Following
                </>
              ) : (
                <>
                  <FiUserPlus style={{ marginRight: 4 }} /> Follow
                </>
              )}
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

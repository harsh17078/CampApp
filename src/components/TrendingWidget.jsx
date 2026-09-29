import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Heading, Badge } from '@chakra-ui/react';
import { FiTrendingUp, FiHash } from 'react-icons/fi';
import { postAPI } from '../services/api';

export default function TrendingWidget({ activeTag, onSelectTag }) {
  const [trending, setTrending] = useState([
    { tag: 'Camping', count: '14.2K', category: 'Outdoor & Nature' },
    { tag: 'WebDev', count: '9.8K', category: 'Technology' },
    { tag: 'Adventure', count: '8.4K', category: 'Travel' },
    { tag: 'BuildInPublic', count: '5.1K', category: 'Software' },
    { tag: 'Coffee', count: '4.3K', category: 'Lifestyle' },
  ]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await postAPI.getTrending();
        if (res.success && res.trending && res.trending.length > 0) {
          setTrending(res.trending);
        }
      } catch (err) {
        console.warn('Trending fallback:', err.message);
      }
    };
    fetchTrending();
  }, []);

  return (
    <Box
      className="glass-card"
      p={4}
      borderRadius="2xl"
      bg="var(--bg-surface)"
      border="1px solid var(--border-color)"
      mb={5}
    >
      <HStack justify="space-between" mb={3.5} px={1}>
        <HStack gap={2}>
          <Box p={1.5} borderRadius="lg" bg="var(--brand-glow)" color="var(--brand-primary)">
            <FiTrendingUp size={16} />
          </Box>
          <Heading as="h3" fontSize="sm" fontWeight="800" color="var(--text-primary)">
            What's Happening
          </Heading>
        </HStack>
        {activeTag && (
          <Badge
            size="xs"
            colorPalette="red"
            variant="subtle"
            cursor="pointer"
            onClick={() => onSelectTag(null)}
          >
            Clear #{activeTag} ✕
          </Badge>
        )}
      </HStack>

      <VStack align="stretch" gap={1.5}>
        {trending.map((item, idx) => {
          const isSelected = activeTag?.toLowerCase() === item.tag.toLowerCase();

          return (
            <Box
              key={idx}
              p={2.5}
              borderRadius="xl"
              cursor="pointer"
              bg={isSelected ? 'var(--brand-glow)' : 'transparent'}
              _hover={{ bg: 'var(--brand-glow)' }}
              transition="all 0.15s ease"
              onClick={() => onSelectTag(isSelected ? null : item.tag)}
            >
              <HStack justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="3xs" color="var(--text-muted)" textTransform="uppercase" fontWeight="600">
                    {item.category || 'Trending Topic'}
                  </Text>
                  <HStack gap={1} mt={0.5}>
                    <FiHash size={13} color="var(--brand-primary)" />
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color={isSelected ? 'var(--brand-primary)' : 'var(--text-primary)'}
                    >
                      {item.tag}
                    </Text>
                  </HStack>
                </Box>
                <Text fontSize="3xs" color="var(--text-muted)" fontWeight="500">
                  {item.count} posts
                </Text>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

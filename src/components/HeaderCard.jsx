import React, { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Input,
  Textarea,
  Button,
  Text,
  Badge,
  Popover,
  Portal,
} from '@chakra-ui/react';
import { FiImage, FiSmile, FiMapPin, FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const FEELINGS = ['😊 Happy', '🔥 Excited', '🏕️ Camping', '🚀 Productive', '✨ Inspired', '☕ Chill', '💡 Curious'];

export default function HeaderCard({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await postAPI.createPost({
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        feeling: feeling || null,
        location: location.trim() || null,
      });

      if (res.success && res.post) {
        setContent('');
        setImageUrl('');
        setFeeling('');
        setLocation('');
        setShowImageInput(false);
        setShowLocationInput(false);
        if (onPostCreated) {
          onPostCreated(res.post);
        }
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      // Fallback mock post if offline
      const mockPost = {
        id: Date.now(),
        content: content.trim(),
        image_url: imageUrl || null,
        feeling: feeling || null,
        location: location || null,
        author_name: user?.name || 'Camp Explorer',
        author_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
        comments: [],
        created_at: new Date().toISOString(),
      };
      setContent('');
      setImageUrl('');
      setFeeling('');
      setLocation('');
      if (onPostCreated) {
        onPostCreated(mockPost);
      }
    } finally {
      setLoading(false);
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
  ];

  return (
    <Box
      className="glass-card"
      p={4}
      mb={6}
      bg="var(--bg-surface)"
      borderRadius="2xl"
      border="1px solid var(--border-color)"
    >
      <HStack align="flex-start" gap={3} mb={3}>
        <Avatar.Root size="md" shape="full">
          <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
          <Avatar.Fallback name={user?.name || "User"} />
        </Avatar.Root>
        <VStack align="stretch" flex="1" gap={2}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user?.name ? user.name.split(' ')[0] : 'friend'}?`}
            rows={content.length > 50 ? 3 : 2}
            resize="none"
            border="none"
            _focus={{ outline: "none", boxShadow: "none" }}
            fontSize="sm"
            p={2}
            color="var(--text-primary)"
          />

          {/* Active Badges */}
          <HStack gap={2} wrap="wrap">
            {feeling && (
              <Badge colorPalette="pink" variant="subtle" borderRadius="full" px={2.5} py={0.5}>
                Feeling {feeling}
                <Box as="span" ml={1} cursor="pointer" onClick={() => setFeeling('')}>×</Box>
              </Badge>
            )}
            {location && (
              <Badge colorPalette="cyan" variant="subtle" borderRadius="full" px={2.5} py={0.5}>
                📍 {location}
                <Box as="span" ml={1} cursor="pointer" onClick={() => setLocation('')}>×</Box>
              </Badge>
            )}
            {imageUrl && (
              <Badge colorPalette="purple" variant="subtle" borderRadius="full" px={2.5} py={0.5}>
                🖼️ Image attached
                <Box as="span" ml={1} cursor="pointer" onClick={() => setImageUrl('')}>×</Box>
              </Badge>
            )}
          </HStack>

          {/* Expandable Image URL Input */}
          {showImageInput && (
            <VStack align="stretch" gap={1.5} p={2} bg="var(--bg-primary)" borderRadius="lg">
              <HStack>
                <Input
                  size="xs"
                  placeholder="Paste Image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  borderRadius="md"
                />
                <Button size="xs" variant="ghost" onClick={() => setShowImageInput(false)}>
                  <FiX />
                </Button>
              </HStack>
              <HStack gap={1}>
                <Text fontSize="2xs" color="var(--text-muted)">Presets:</Text>
                {sampleImages.map((src, idx) => (
                  <Button
                    key={idx}
                    size="2xs"
                    variant="outline"
                    onClick={() => setImageUrl(src)}
                  >
                    Image {idx + 1}
                  </Button>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Expandable Location Input */}
          {showLocationInput && (
            <HStack p={2} bg="var(--bg-primary)" borderRadius="lg">
              <Input
                size="xs"
                placeholder="Where are you? (e.g. Yosemite National Park)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                borderRadius="md"
              />
              <Button size="xs" variant="ghost" onClick={() => setShowLocationInput(false)}>
                <FiX />
              </Button>
            </HStack>
          )}
        </VStack>
      </HStack>

      {/* Action Footer */}
      <HStack justify="space-between" pt={2} borderTop="1px solid var(--border-color)">
        <HStack gap={1}>
          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            color="var(--text-secondary)"
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <FiImage style={{ marginRight: 4 }} /> Photo
          </Button>

          {/* Feeling Popover */}
          <Popover.Root positioning={{ placement: "bottom-start" }}>
            <Popover.Trigger asChild>
              <Button size="xs" variant="ghost" borderRadius="lg" color="var(--text-secondary)">
                <FiSmile style={{ marginRight: 4 }} /> Feeling
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content p={2} borderRadius="xl" bg="var(--bg-surface)" boxShadow="var(--shadow-xl)">
                  <HStack wrap="wrap" gap={1.5} maxW="220px">
                    {FEELINGS.map((f) => (
                      <Button
                        key={f}
                        size="2xs"
                        variant={feeling === f ? "solid" : "outline"}
                        onClick={() => setFeeling(f)}
                      >
                        {f}
                      </Button>
                    ))}
                  </HStack>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            color="var(--text-secondary)"
            onClick={() => setShowLocationInput(!showLocationInput)}
          >
            <FiMapPin style={{ marginRight: 4 }} /> Location
          </Button>
        </HStack>

        <Button
          size="sm"
          className="brand-button"
          borderRadius="full"
          px={5}
          disabled={!content.trim() || loading}
          loading={loading}
          onClick={handleSubmit}
        >
          <FiSend style={{ marginRight: 6 }} /> Share
        </Button>
      </HStack>
    </Box>
  );
}

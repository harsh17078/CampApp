import React, { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Textarea,
  Button,
  Text,
  Badge,
  Popover,
  Portal,
  Input,
} from '@chakra-ui/react';
import {
  FiImage,
  FiSmile,
  FiMapPin,
  FiSend,
  FiX,
  FiHash,
  FiRepeat,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const MAX_CHARS = 280;
const FEELINGS = ['😊 Happy', '🔥 Excited', '🏕️ Camping', '🚀 Productive', '✨ Inspired', '☕ Chill', '💡 Curious'];
const POPULAR_TAGS = ['Camping', 'WebDev', 'Adventure', 'BuildInPublic', 'Nature'];

export default function HeaderCard({ onPostCreated, quotePost, onCancelQuote }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Character Count & Radial Progress Calculation
  const charCount = content.length;
  const remainingChars = MAX_CHARS - charCount;
  const progressPercent = Math.min(100, (charCount / MAX_CHARS) * 100);

  // Circle SVG metrics (radius = 12, circumference = 2 * PI * 12 ≈ 75.4)
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  let ringColor = 'var(--brand-primary)';
  if (remainingChars <= 20) ringColor = '#ef4444'; // Red
  else if (remainingChars <= 50) ringColor = '#f59e0b'; // Amber

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!content.trim() || charCount > MAX_CHARS) return;

    setLoading(true);
    try {
      const res = await postAPI.createPost({
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        feeling: feeling || null,
        location: location.trim() || null,
        quote_post_id: quotePost ? quotePost.id : null,
      });

      if (res.success && res.post) {
        setContent('');
        setImageUrl('');
        setFeeling('');
        setLocation('');
        setShowImageInput(false);
        setShowLocationInput(false);
        if (onCancelQuote) onCancelQuote();
        if (onPostCreated) onPostCreated(res.post);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertTag = (tag) => {
    const formatted = `#${tag} `;
    if (content.length + formatted.length <= MAX_CHARS) {
      setContent((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + formatted);
    }
  };

  return (
    <Box
      className="glass-card"
      p={4}
      mb={4}
      bg="var(--bg-surface)"
      borderRadius="2xl"
      border="1px solid var(--border-color)"
    >
      {/* Quote Banner if active */}
      {quotePost && (
        <HStack justify="space-between" mb={3} p={2.5} bg="var(--bg-primary)" borderRadius="xl" border="1px dashed var(--border-color)">
          <HStack gap={2}>
            <FiRepeat color="var(--brand-primary)" />
            <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
              Quoting {quotePost.author_name}'s post
            </Text>
          </HStack>
          <Button size="2xs" variant="ghost" onClick={onCancelQuote}>
            <FiX />
          </Button>
        </HStack>
      )}

      <HStack align="flex-start" gap={3} mb={3}>
        <Avatar.Root size="md" shape="full">
          <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
          <Avatar.Fallback name={user?.name || "User"} />
        </Avatar.Root>

        <VStack align="stretch" flex="1" gap={2}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${user?.name ? user.name.split(' ')[0] : 'friend'}?`}
            rows={content.length > 60 || quotePost ? 3 : 2}
            maxLength={MAX_CHARS}
            resize="none"
            border="none"
            _focus={{ outline: "none", boxShadow: "none" }}
            fontSize="sm"
            p={1}
            color="var(--text-primary)"
          />

          {/* Quote Post Preview Box */}
          {quotePost && (
            <Box p={3} borderRadius="xl" border="1px solid var(--border-color)" bg="var(--bg-surface)">
              <HStack gap={2} mb={1}>
                <Avatar.Root size="2xs" shape="full">
                  <Avatar.Image src={quotePost.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                  <Avatar.Fallback name={quotePost.author_name} />
                </Avatar.Root>
                <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
                  {quotePost.author_name}
                </Text>
              </HStack>
              <Text fontSize="2xs" color="var(--text-secondary)" isTruncated>
                {quotePost.content}
              </Text>
            </Box>
          )}

          {/* Quick Tag Suggestions */}
          {content.length < 200 && (
            <HStack gap={1.5} wrap="wrap">
              <Text fontSize="3xs" color="var(--text-muted)">Tags:</Text>
              {POPULAR_TAGS.map((t) => (
                <Badge
                  key={t}
                  size="xs"
                  variant="subtle"
                  colorPalette="gray"
                  borderRadius="full"
                  cursor="pointer"
                  _hover={{ bg: "var(--brand-glow)", color: "var(--brand-primary)" }}
                  onClick={() => handleInsertTag(t)}
                >
                  #{t}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Active Badges */}
          <HStack gap={2} wrap="wrap">
            {feeling && (
              <Badge colorPalette="pink" variant="subtle" borderRadius="full" px={2.5} py={0.5}>
                {feeling}
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
            <HStack p={2} bg="var(--bg-primary)" borderRadius="lg">
              <Input
                size="xs"
                placeholder="Paste Image URL (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                borderRadius="md"
              />
              <Button size="xs" variant="ghost" onClick={() => setShowImageInput(false)}>
                <FiX />
              </Button>
            </HStack>
          )}

          {/* Expandable Location Input */}
          {showLocationInput && (
            <HStack p={2} bg="var(--bg-primary)" borderRadius="lg">
              <Input
                size="xs"
                placeholder="Tag a location..."
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

      {/* Action Bar with Radial Character Ring */}
      <HStack justify="space-between" pt={2.5} borderTop="1px solid var(--border-color)">
        <HStack gap={1}>
          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            color="var(--text-secondary)"
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <FiImage size={15} style={{ marginRight: 4 }} /> Media
          </Button>

          {/* Feeling Popover */}
          <Popover.Root positioning={{ placement: "bottom-start" }}>
            <Popover.Trigger asChild>
              <Button size="xs" variant="ghost" borderRadius="lg" color="var(--text-secondary)">
                <FiSmile size={15} style={{ marginRight: 4 }} /> Feeling
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
            <FiMapPin size={15} style={{ marginRight: 4 }} /> Location
          </Button>
        </HStack>

        <HStack gap={3}>
          {/* Radial Progress Character Ring */}
          {charCount > 0 && (
            <HStack gap={1.5}>
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="3"
                />
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 16 16)"
                  style={{ transition: 'stroke-dashoffset 0.1s ease, stroke 0.2s ease' }}
                />
              </svg>
              {remainingChars <= 20 && (
                <Text fontSize="2xs" fontWeight="700" color={ringColor}>
                  {remainingChars}
                </Text>
              )}
            </HStack>
          )}

          <Button
            size="sm"
            className="brand-button"
            borderRadius="full"
            px={5}
            disabled={!content.trim() || charCount > MAX_CHARS || loading}
            loading={loading}
            onClick={handleSubmit}
          >
            <FiSend style={{ marginRight: 6 }} /> Post
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

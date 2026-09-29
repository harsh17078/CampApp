import React, { useState, useRef } from 'react';
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
  Image,
  Spinner,
} from '@chakra-ui/react';
import {
  FiImage,
  FiSmile,
  FiMapPin,
  FiSend,
  FiX,
  FiRepeat,
  FiLink,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { postAPI, uploadAPI } from '../services/api';

const MAX_CHARS = 280;
const FEELINGS = ['😊 Happy', '🔥 Excited', '🏕️ Camping', '🚀 Productive', '✨ Inspired', '☕ Chill', '💡 Curious'];
const POPULAR_TAGS = ['Camping', 'WebDev', 'Adventure', 'BuildInPublic', 'Nature'];

export default function HeaderCard({ onPostCreated, quotePost, onCancelQuote }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Character Count & Radial Progress Calculation
  const charCount = content.length;
  const remainingChars = MAX_CHARS - charCount;
  const progressPercent = Math.min(100, (charCount / MAX_CHARS) * 100);

  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  let ringColor = 'var(--brand-primary)';
  if (remainingChars <= 20) ringColor = '#ef4444';
  else if (remainingChars <= 50) ringColor = '#f59e0b';

  // Handle Image File Selection & Upload
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploadingImage(true);

    try {
      const res = await uploadAPI.uploadMedia(file);
      if (res.success && res.url) {
        setImageUrl(res.url);
      } else {
        // Fallback to base64 if server upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload endpoint error, using base64 fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if ((!content.trim() && !imageUrl) || charCount > MAX_CHARS || uploadingImage) return;

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
        setImagePreview('');
        setFeeling('');
        setLocation('');
        setShowUrlInput(false);
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
      border={isDragging ? '2px dashed var(--brand-primary)' : '1px solid var(--border-color)'}
      transition="border-color 0.2s ease"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

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

      <HStack align="flex-start" gap={3} mb={2}>
        <Avatar.Root size="md" shape="full">
          <Avatar.Image src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} />
          <Avatar.Fallback name={user?.name || 'User'} />
        </Avatar.Root>

        <VStack align="stretch" flex="1" gap={2}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${user?.name ? user.name.split(' ')[0] : 'camper'}?`}
            rows={content.length > 60 || quotePost || imagePreview ? 3 : 2}
            maxLength={MAX_CHARS}
            resize="none"
            border="none"
            _focus={{ outline: 'none', boxShadow: 'none' }}
            fontSize="sm"
            p={1}
            color="var(--text-primary)"
          />

          {/* Image Upload Preview Box */}
          {(imagePreview || imageUrl) && (
            <Box position="relative" borderRadius="xl" overflow="hidden" maxH="280px" border="1px solid var(--border-color)" bg="var(--bg-primary)">
              <Image
                src={imagePreview || imageUrl}
                alt="Upload preview"
                width="100%"
                maxH="280px"
                objectFit="cover"
              />
              {uploadingImage && (
                <HStack
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="rgba(0,0,0,0.5)"
                  justify="center"
                  align="center"
                  gap={2}
                  color="white"
                >
                  <Spinner size="sm" />
                  <Text fontSize="xs" fontWeight="600">Uploading photo...</Text>
                </HStack>
              )}
              <Button
                position="absolute"
                top={2}
                right={2}
                size="2xs"
                variant="solid"
                bg="rgba(0,0,0,0.65)"
                color="white"
                borderRadius="full"
                _hover={{ bg: "rgba(0,0,0,0.85)" }}
                onClick={handleRemoveImage}
              >
                <FiX size={14} />
              </Button>
            </Box>
          )}

          {/* Quote Post Preview Box */}
          {quotePost && (
            <Box p={3} borderRadius="xl" border="1px solid var(--border-color)" bg="var(--bg-surface)">
              <HStack gap={2} mb={1}>
                <Avatar.Root size="2xs" shape="full">
                  <Avatar.Image src={quotePost.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} />
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
          {content.length > 0 && content.length < 200 && (
            <HStack gap={1.5} wrap="wrap" pt={1}>
              <Text fontSize="3xs" color="var(--text-muted)">Tags:</Text>
              {POPULAR_TAGS.map((t) => (
                <Badge
                  key={t}
                  size="xs"
                  variant="subtle"
                  colorPalette="gray"
                  borderRadius="full"
                  cursor="pointer"
                  _hover={{ bg: 'var(--brand-glow)', color: 'var(--brand-primary)' }}
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
          </HStack>

          {/* Optional Image URL Input */}
          {showUrlInput && (
            <HStack p={2} bg="var(--bg-primary)" borderRadius="lg">
              <Input
                size="xs"
                placeholder="Or paste image URL (https://...)"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                borderRadius="md"
              />
              <Button size="xs" variant="ghost" onClick={() => setShowUrlInput(false)}>
                <FiX />
              </Button>
            </HStack>
          )}

          {/* Location Input */}
          {showLocationInput && (
            <HStack p={2} bg="var(--bg-primary)" borderRadius="lg">
              <Input
                size="xs"
                placeholder="Tag a location (e.g. Yosemite National Park)..."
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

      {/* Action Bar */}
      <HStack justify="space-between" pt={2.5} borderTop="1px solid var(--border-color)">
        <HStack gap={1} wrap="wrap">
          {/* File Upload Button */}
          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            color="var(--text-secondary)"
            _hover={{ bg: "var(--brand-glow)", color: "var(--brand-primary)" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <FiImage size={15} style={{ marginRight: 5 }} color="var(--brand-primary)" /> Photo
          </Button>

          {/* Image URL fallback button */}
          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            color="var(--text-secondary)"
            onClick={() => setShowUrlInput(!showUrlInput)}
            title="Attach image via URL"
          >
            <FiLink size={14} style={{ marginRight: 4 }} /> URL
          </Button>

          {/* Feeling Popover */}
          <Popover.Root positioning={{ placement: 'bottom-start' }}>
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
                        variant={feeling === f ? 'solid' : 'outline'}
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

          {/* Location Button */}
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
              <svg width="26" height="26" viewBox="0 0 32 32">
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
            disabled={(!content.trim() && !imageUrl) || charCount > MAX_CHARS || loading || uploadingImage}
            loading={loading || uploadingImage}
            onClick={handleSubmit}
          >
            <FiSend style={{ marginRight: 6 }} /> Post
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

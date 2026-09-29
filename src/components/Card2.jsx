import React, { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Text,
  IconButton,
  Button,
  Input,
  Badge,
  Image,
  Menu,
  Portal,
} from '@chakra-ui/react';
import {
  FiHeart,
  FiRepeat,
  FiMessageCircle,
  FiBookmark,
  FiShare2,
  FiBarChart2,
  FiTrash2,
  FiSend,
  FiEdit2,
  FiCheck,
  FiUserPlus,
  FiUserCheck,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postAPI, userAPI } from '../services/api';
import CardSkeleton from './CardSkeleton';

// Helper: Parse and highlight #hashtags and @mentions into clickable links
export const renderContentWithTags = (content, onSelectTag) => {
  if (!content) return null;
  const parts = content.split(/(\s+)/);

  return parts.map((word, index) => {
    if (word.startsWith('#') && word.length > 1) {
      const tagClean = word.replace(/[^a-zA-Z0-9_]/g, '');
      return (
        <span
          key={index}
          className="hashtag-link"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectTag) onSelectTag(tagClean);
          }}
        >
          {word}
        </span>
      );
    }
    if (word.startsWith('@') && word.length > 1) {
      return (
        <span key={index} className="mention-link">
          {word}
        </span>
      );
    }
    return word;
  });
};

export default function Card2({ post, loading, onDeletePost, onQuotePost, onSelectTag }) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [userReaction, setUserReaction] = useState(post?.user_reaction || null);
  const [repostsCount, setRepostsCount] = useState(post?.reposts_count || 0);
  const [isReposted, setIsReposted] = useState(post?.is_reposted || false);
  const [isBookmarked, setIsBookmarked] = useState(post?.is_bookmarked || false);
  const [showReplies, setShowReplies] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post?.is_following_author || false);
  const [followHover, setFollowHover] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Sync initial isFollowing if post updates
  React.useEffect(() => {
    if (post?.is_following_author !== undefined) {
      setIsFollowing(Boolean(post.is_following_author));
    }
  }, [post?.is_following_author]);

  if (loading) return <CardSkeleton />;
  if (!post) return null;

  // Follow / Unfollow Author Action
  const handleToggleFollow = async (e) => {
    e?.stopPropagation();
    if (!user) return;
    if (!post.user_id) return;

    const prev = isFollowing;
    setIsFollowing(!prev);
    setFollowLoading(true);

    try {
      if (prev) {
        await userAPI.unfollow(post.user_id);
      } else {
        await userAPI.follow(post.user_id);
      }
    } catch (err) {
      console.error('Follow error:', err);
      setIsFollowing(prev);
    } finally {
      setFollowLoading(false);
    }
  };

  // Like Action
  const handleLike = async () => {
    const prevReaction = userReaction;
    const prevLikes = likesCount;

    if (userReaction === 'like') {
      setUserReaction(null);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      setUserReaction('like');
      setLikesCount((c) => c + 1);
    }

    try {
      const res = await postAPI.reactToPost(post.id, 'like');
      if (res.success) {
        setUserReaction(res.user_reaction);
        setLikesCount(res.likes_count);
      }
    } catch {
      setUserReaction(prevReaction);
      setLikesCount(prevLikes);
    }
  };

  // Repost Action
  const handleRepost = async () => {
    const nextState = !isReposted;
    setIsReposted(nextState);
    setRepostsCount((c) => (nextState ? c + 1 : Math.max(0, c - 1)));

    try {
      const res = await postAPI.repost(post.id);
      if (res.success) {
        setIsReposted(res.is_reposted);
        setRepostsCount(res.reposts_count);
      }
    } catch {
      setIsReposted(!nextState);
    }
  };

  // Bookmark Action
  const handleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      const res = await postAPI.bookmark(post.id);
      if (res.success) {
        setIsBookmarked(res.is_bookmarked);
      }
    } catch {
      setIsBookmarked(!nextState);
    }
  };

  // Reply Submit
  const handleAddReply = async (e) => {
    e?.preventDefault();
    if (!newReply.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await postAPI.addComment(post.id, newReply.trim());
      if (res.success && res.comment) {
        setComments([...comments, res.comment]);
        setNewReply('');
      }
    } catch {
      const mockC = {
        id: Date.now(),
        content: newReply.trim(),
        author_name: user?.name || 'You',
        author_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        created_at: new Date().toISOString(),
      };
      setComments([...comments, mockC]);
      setNewReply('');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/home?post=${post.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const diffHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const isOwner = user && (user.id === post.user_id || post.author_name === user.name);

  return (
    <Box
      className="glass-card"
      p={{ base: 4, sm: 5 }}
      mb={4}
      bg="var(--bg-surface)"
      borderRadius="2xl"
      border="1px solid var(--border-color)"
    >
      {/* Pinned Post Badge */}
      {post.is_pinned && (
        <HStack gap={1.5} mb={2} color="var(--brand-primary)" fontSize="2xs" fontWeight="700">
          <Text>📌 Pinned Post</Text>
        </HStack>
      )}

      {/* Author Header */}
      <HStack justify="space-between" mb={2.5}>
        <HStack gap={3}>
          <Avatar.Root size="md" shape="full">
            <Avatar.Image src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
            <Avatar.Fallback name={post.author_name || "Camp User"} />
          </Avatar.Root>
          <Box>
            <HStack gap={2}>
              <Text fontWeight="800" fontSize="sm" color="var(--text-primary)">
                {post.author_name || "Camp Explorer"}
              </Text>
              <Text fontSize="2xs" color="var(--text-muted)">
                @{post.author_name ? post.author_name.toLowerCase().replace(/\s+/g, '') : 'camper'}
              </Text>
              <Text fontSize="2xs" color="var(--text-muted)">
                • {formatTime(post.created_at)}
              </Text>
            </HStack>
            {post.location && (
              <Text fontSize="3xs" color="var(--text-muted)">
                📍 {post.location}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack gap={2}>
          {!isOwner && post.user_id && (
            <Button
              size="2xs"
              variant={isFollowing ? "outline" : "solid"}
              borderRadius="full"
              fontSize="3xs"
              fontWeight="700"
              px={2.5}
              py={1}
              color={
                isFollowing
                  ? followHover
                    ? "red.500"
                    : "var(--text-secondary)"
                  : "white"
              }
              borderColor={isFollowing ? (followHover ? "red.300" : "var(--border-color)") : "transparent"}
              bg={
                isFollowing
                  ? followHover
                    ? "rgba(239, 68, 68, 0.08)"
                    : "var(--bg-secondary)"
                  : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
              }
              _hover={{
                transform: "scale(1.02)",
                bg: isFollowing
                  ? "rgba(239, 68, 68, 0.12)"
                  : "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                color: isFollowing ? "red.500" : "white",
              }}
              loading={followLoading}
              onMouseEnter={() => setFollowHover(true)}
              onMouseLeave={() => setFollowHover(false)}
              onClick={handleToggleFollow}
            >
              {isFollowing ? (
                followHover ? (
                  "Unfollow"
                ) : (
                  <HStack gap={1}>
                    <FiUserCheck size={11} />
                    <Text>Following</Text>
                  </HStack>
                )
              ) : (
                <HStack gap={1}>
                  <FiUserPlus size={11} />
                  <Text>Follow</Text>
                </HStack>
              )}
            </Button>
          )}

          {isOwner && onDeletePost && (
            <IconButton
              size="2xs"
              variant="ghost"
              color="var(--text-muted)"
              _hover={{ color: "red.500" }}
              onClick={() => onDeletePost(post.id)}
              aria-label="Delete Post"
            >
              <FiTrash2 />
            </IconButton>
          )}
        </HStack>
      </HStack>

      {/* Post Text with Hashtag & Mention Parsing */}
      <Text
        fontSize="sm"
        lineHeight="1.6"
        color="var(--text-primary)"
        mb={post.image_url || post.quote_post ? 3 : 2}
        whiteSpace="pre-wrap"
      >
        {renderContentWithTags(post.content || post.body, onSelectTag)}
      </Text>

      {/* Image Media Preview */}
      {post.image_url && (
        <Box mb={3} borderRadius="xl" overflow="hidden" maxHeight="400px" bg="var(--bg-primary)">
          <Image
            src={post.image_url}
            alt="Media"
            width="100%"
            height="auto"
            maxH="400px"
            objectFit="cover"
            borderRadius="xl"
            loading="lazy"
          />
        </Box>
      )}

      {/* Quote Post Card Preview */}
      {post.quote_post && (
        <Box
          p={3.5}
          mb={3}
          borderRadius="xl"
          border="1px solid var(--border-color)"
          bg="var(--bg-primary)"
          _hover={{ borderColor: "var(--brand-primary)" }}
        >
          <HStack gap={2} mb={1.5}>
            <Avatar.Root size="2xs" shape="full">
              <Avatar.Image src={post.quote_post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
              <Avatar.Fallback name={post.quote_post.author_name} />
            </Avatar.Root>
            <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
              {post.quote_post.author_name}
            </Text>
            <Text fontSize="3xs" color="var(--text-muted)">
              • {formatTime(post.quote_post.created_at)}
            </Text>
          </HStack>
          <Text fontSize="xs" color="var(--text-secondary)" lineHeight="1.5">
            {renderContentWithTags(post.quote_post.content, onSelectTag)}
          </Text>
        </Box>
      )}

      {/* Microblogging Action Bar */}
      <HStack
        justify="space-between"
        pt={2.5}
        mt={1}
        borderTop="1px solid var(--border-color)"
        color="var(--text-secondary)"
      >
        {/* Reply Action */}
        <HStack
          gap={1.5}
          cursor="pointer"
          _hover={{ color: "var(--brand-primary)" }}
          onClick={() => setShowReplies(!showReplies)}
        >
          <IconButton size="xs" variant="ghost" borderRadius="full" color="inherit">
            <FiMessageCircle size={16} />
          </IconButton>
          <Text fontSize="xs" fontWeight="600">
            {comments.length || post.comments_count || 0}
          </Text>
        </HStack>

        {/* Repost & Quote Post Menu */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <HStack
              gap={1.5}
              cursor="pointer"
              color={isReposted ? "green.500" : "inherit"}
              _hover={{ color: "green.500" }}
            >
              <IconButton size="xs" variant="ghost" borderRadius="full" color="inherit">
                <FiRepeat size={16} />
              </IconButton>
              <Text fontSize="xs" fontWeight="600">{repostsCount}</Text>
            </HStack>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content bg="var(--bg-surface)" borderColor="var(--border-color)" borderRadius="xl" p={1}>
                <Menu.Item
                  value="repost"
                  onClick={handleRepost}
                  borderRadius="lg"
                  p={2}
                  color={isReposted ? "green.500" : "var(--text-primary)"}
                >
                  <HStack gap={2}>
                    <FiRepeat size={15} />
                    <Text fontSize="xs" fontWeight="600">{isReposted ? 'Undo Repost' : 'Repost'}</Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item
                  value="quote"
                  onClick={() => onQuotePost && onQuotePost(post)}
                  borderRadius="lg"
                  p={2}
                  color="var(--text-primary)"
                >
                  <HStack gap={2}>
                    <FiEdit2 size={15} />
                    <Text fontSize="xs" fontWeight="600">Quote Post</Text>
                  </HStack>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        {/* Like Action */}
        <HStack
          gap={1.5}
          cursor="pointer"
          color={userReaction === 'like' ? '#ec4899' : 'inherit'}
          _hover={{ color: '#ec4899' }}
          onClick={handleLike}
        >
          <IconButton size="xs" variant="ghost" borderRadius="full" color="inherit">
            {userReaction === 'like' ? <FaHeart size={16} color="#ec4899" /> : <FiHeart size={16} />}
          </IconButton>
          <Text fontSize="xs" fontWeight="600">{likesCount}</Text>
        </HStack>

        {/* View Impressions */}
        <HStack gap={1.5} color="var(--text-muted)" display={{ base: 'none', sm: 'flex' }}>
          <FiBarChart2 size={15} />
          <Text fontSize="xs" fontWeight="500">
            {post.views_count ? `${post.views_count >= 1000 ? (post.views_count / 1000).toFixed(1) + 'K' : post.views_count}` : '1.2K'}
          </Text>
        </HStack>

        {/* Bookmark & Share */}
        <HStack gap={1}>
          <IconButton
            size="xs"
            variant="ghost"
            borderRadius="full"
            color={isBookmarked ? "var(--brand-primary)" : "inherit"}
            _hover={{ color: "var(--brand-primary)" }}
            onClick={handleBookmark}
            aria-label="Bookmark"
          >
            <FiBookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
          </IconButton>

          <IconButton
            size="xs"
            variant="ghost"
            borderRadius="full"
            color={copiedLink ? "green.500" : "inherit"}
            _hover={{ color: "var(--brand-primary)" }}
            onClick={handleCopyLink}
            aria-label="Share"
          >
            {copiedLink ? <FiCheck size={15} /> : <FiShare2 size={15} />}
          </IconButton>
        </HStack>
      </HStack>

      {/* Linear Reply Stream */}
      {showReplies && (
        <VStack align="stretch" gap={3} mt={4} pt={3} borderTop="1px dashed var(--border-color)">
          {/* Reply Form */}
          <HStack as="form" onSubmit={handleAddReply} gap={2}>
            <Avatar.Root size="xs" shape="full">
              <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
              <Avatar.Fallback name={user?.name || "Me"} />
            </Avatar.Root>
            <Input
              size="xs"
              placeholder="Post your reply..."
              borderRadius="full"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              bg="var(--bg-primary)"
              color="var(--text-primary)"
            />
            <Button
              size="2xs"
              type="submit"
              className="brand-button"
              borderRadius="full"
              px={3}
              disabled={!newReply.trim() || submittingReply}
              loading={submittingReply}
            >
              <FiSend size={11} style={{ marginRight: 4 }} /> Reply
            </Button>
          </HStack>

          {/* Chronological Linear Replies */}
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <HStack key={c.id || i} align="flex-start" gap={2.5} p={2.5} bg="var(--bg-primary)" borderRadius="xl">
                <Avatar.Root size="2xs" shape="full">
                  <Avatar.Image src={c.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                  <Avatar.Fallback name={c.author_name || "Camper"} />
                </Avatar.Root>
                <Box flex="1">
                  <HStack justify="space-between">
                    <Text fontSize="2xs" fontWeight="700" color="var(--text-primary)">
                      {c.author_name || "Camper"}
                    </Text>
                    <Text fontSize="3xs" color="var(--text-muted)">
                      {formatTime(c.created_at)}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="var(--text-secondary)" mt={0.5}>
                    {renderContentWithTags(c.content, onSelectTag)}
                  </Text>
                </Box>
              </HStack>
            ))
          ) : (
            <Text fontSize="2xs" color="var(--text-muted)" textAlign="center" py={1.5}>
              No replies yet. Start the conversation!
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}

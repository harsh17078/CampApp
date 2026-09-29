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
  Separator,
} from '@chakra-ui/react';
import {
  BiLike,
  BiSolidLike,
  BiDislike,
  BiSolidDislike,
  BiCommentDetail,
} from 'react-icons/bi';
import { FiTrash2, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import CardSkeleton from './CardSkeleton';

export default function Card2({ post, loading, onDeletePost }) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [dislikesCount, setDislikesCount] = useState(post?.dislikes_count || 0);
  const [userReaction, setUserReaction] = useState(post?.user_reaction || null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  if (loading) {
    return <CardSkeleton />;
  }

  if (!post) return null;

  // Handle Reactions
  const handleReaction = async (type) => {
    // Optimistic UI updates
    const prevReaction = userReaction;
    const prevLikes = likesCount;
    const prevDislikes = dislikesCount;

    if (userReaction === type) {
      setUserReaction(null);
      if (type === 'like') setLikesCount((c) => Math.max(0, c - 1));
      if (type === 'dislike') setDislikesCount((c) => Math.max(0, c - 1));
    } else {
      if (prevReaction === 'like') setLikesCount((c) => Math.max(0, c - 1));
      if (prevReaction === 'dislike') setDislikesCount((c) => Math.max(0, c - 1));
      setUserReaction(type);
      if (type === 'like') setLikesCount((c) => c + 1);
      if (type === 'dislike') setDislikesCount((c) => c + 1);
    }

    try {
      const res = await postAPI.reactToPost(post.id, type);
      if (res.success) {
        setUserReaction(res.user_reaction);
        setLikesCount(res.likes_count);
        setDislikesCount(res.dislikes_count);
      }
    } catch {
      // Revert if API fails
      setUserReaction(prevReaction);
      setLikesCount(prevLikes);
      setDislikesCount(prevDislikes);
    }
  };

  // Handle Comment Submission
  const handleAddComment = async (e) => {
    e?.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await postAPI.addComment(post.id, newComment.trim());
      if (res.success && res.comment) {
        setComments([...comments, res.comment]);
        setNewComment('');
      }
    } catch {
      // Mock comment fallback
      const mockC = {
        id: Date.now(),
        content: newComment.trim(),
        author_name: user?.name || 'You',
        author_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        created_at: new Date().toISOString(),
      };
      setComments([...comments, mockC]);
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Format Time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOwner = user && (user.id === post.user_id || post.author_name === user.name);

  return (
    <Box
      className="glass-card"
      p={{ base: 4, sm: 5 }}
      mb={6}
      bg="var(--bg-surface)"
      borderRadius="2xl"
      border="1px solid var(--border-color)"
    >
      {/* Post Author Header */}
      <HStack justify="space-between" mb={3}>
        <HStack gap={3}>
          <Avatar.Root size="md" shape="full">
            <Avatar.Image src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
            <Avatar.Fallback name={post.author_name || "Camp User"} />
          </Avatar.Root>
          <Box>
            <HStack gap={2}>
              <Text fontWeight="700" fontSize="sm" color="var(--text-primary)">
                {post.author_name || "Camp Explorer"}
              </Text>
              {post.feeling && (
                <Badge size="xs" colorPalette="pink" variant="subtle" borderRadius="full">
                  {post.feeling}
                </Badge>
              )}
            </HStack>
            <HStack gap={2} fontSize="xs" color="var(--text-muted)">
              <Text>{formatTime(post.created_at)}</Text>
              {post.location && <Text>• 📍 {post.location}</Text>}
            </HStack>
          </Box>
        </HStack>

        {isOwner && onDeletePost && (
          <IconButton
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => onDeletePost(post.id)}
            aria-label="Delete Post"
          >
            <FiTrash2 />
          </IconButton>
        )}
      </HStack>

      {/* Post Body */}
      {post.title && (
        <Text fontWeight="700" fontSize="md" mb={2} color="var(--text-primary)">
          {post.title}
        </Text>
      )}

      <Text
        fontSize="sm"
        lineHeight="1.6"
        color="var(--text-primary)"
        mb={post.image_url ? 3 : 2}
        whiteSpace="pre-wrap"
      >
        {post.content || post.body}
      </Text>

      {/* Post Image Attachment */}
      {post.image_url && (
        <Box
          mb={4}
          borderRadius="xl"
          overflow="hidden"
          maxHeight="420px"
          bg="var(--bg-primary)"
        >
          <Image
            src={post.image_url}
            alt="Post image"
            width="100%"
            height="auto"
            maxH="420px"
            objectFit="cover"
            borderRadius="xl"
            loading="lazy"
          />
        </Box>
      )}

      {/* Actions & Reactions */}
      <HStack justify="space-between" pt={3} borderTop="1px solid var(--border-color)">
        <HStack gap={2}>
          {/* Like Button */}
          <Button
            size="xs"
            variant={userReaction === 'like' ? 'solid' : 'ghost'}
            colorPalette={userReaction === 'like' ? 'indigo' : 'gray'}
            borderRadius="full"
            onClick={() => handleReaction('like')}
          >
            {userReaction === 'like' ? <BiSolidLike size={16} /> : <BiLike size={16} />}
            <Text ml={1.5} fontSize="xs" fontWeight="600">{likesCount}</Text>
          </Button>

          {/* Dislike Button */}
          <Button
            size="xs"
            variant={userReaction === 'dislike' ? 'solid' : 'ghost'}
            colorPalette={userReaction === 'dislike' ? 'red' : 'gray'}
            borderRadius="full"
            onClick={() => handleReaction('dislike')}
          >
            {userReaction === 'dislike' ? <BiSolidDislike size={16} /> : <BiDislike size={16} />}
            <Text ml={1.5} fontSize="xs" fontWeight="600">{dislikesCount}</Text>
          </Button>

          {/* Comment Toggle */}
          <Button
            size="xs"
            variant="ghost"
            borderRadius="full"
            color="var(--text-secondary)"
            onClick={() => setShowComments(!showComments)}
          >
            <BiCommentDetail size={16} />
            <Text ml={1.5} fontSize="xs" fontWeight="600">
              {comments.length || post.comments_count || 0}
            </Text>
          </Button>
        </HStack>
      </HStack>

      {/* Comments Section */}
      {showComments && (
        <VStack align="stretch" gap={3} mt={4} pt={3} borderTop="1px dashed var(--border-color)">
          {/* Comment Form */}
          <HStack as="form" onSubmit={handleAddComment} gap={2}>
            <Avatar.Root size="xs" shape="full">
              <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
              <Avatar.Fallback name={user?.name || "Me"} />
            </Avatar.Root>
            <Input
              size="xs"
              placeholder="Write a comment..."
              borderRadius="full"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              bg="var(--bg-primary)"
              color="var(--text-primary)"
            />
            <IconButton
              size="xs"
              type="submit"
              className="brand-button"
              borderRadius="full"
              disabled={!newComment.trim() || submittingComment}
              loading={submittingComment}
              aria-label="Send Comment"
            >
              <FiSend size={12} />
            </IconButton>
          </HStack>

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <HStack key={c.id || i} align="flex-start" gap={2.5} p={2} bg="var(--bg-primary)" borderRadius="xl">
                <Avatar.Root size="2xs" shape="full">
                  <Avatar.Image src={c.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                  <Avatar.Fallback name={c.author_name || "User"} />
                </Avatar.Root>
                <Box flex="1">
                  <HStack justify="space-between">
                    <Text fontSize="2xs" fontWeight="700" color="var(--text-primary)">
                      {c.author_name || "Camp Camper"}
                    </Text>
                    <Text fontSize="3xs" color="var(--text-muted)">
                      {formatTime(c.created_at)}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="var(--text-secondary)" mt={0.5}>
                    {c.content}
                  </Text>
                </Box>
              </HStack>
            ))
          ) : (
            <Text fontSize="2xs" color="var(--text-muted)" textAlign="center" py={2}>
              No comments yet. Be the first to spark the conversation!
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}

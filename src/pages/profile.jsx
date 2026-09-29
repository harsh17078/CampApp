import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  Tabs,
  Badge,
  Dialog,
  Portal,
  CloseButton,
  Spinner,
  Image,
} from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Card2 from '../components/Card2';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI, uploadAPI } from '../services/api';
import {
  FiEdit2,
  FiMapPin,
  FiCalendar,
  FiShare2,
  FiCheck,
  FiCamera,
  FiUploadCloud,
  FiImage,
} from 'react-icons/fi';

export default function Profile() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const avatarInputRef = useRef(null);
  const modalAvatarInputRef = useRef(null);

  const [profileData, setProfileData] = useState(user || {});
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    country: user?.country || '',
    avatar_url: user?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        country: user.country || '',
        avatar_url: user.avatar_url || '',
      });
      setAvatarPreview(user.avatar_url || '');
    }

    const loadProfileAndPosts = async () => {
      try {
        const [profileRes, postsRes] = await Promise.allSettled([
          userAPI.getProfile('me'),
          postAPI.getAllPosts(),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.success) {
          setProfileData(profileRes.value.user);
          setAvatarPreview(profileRes.value.user.avatar_url || '');
        }

        if (postsRes.status === 'fulfilled' && postsRes.value.success) {
          const myPosts = postsRes.value.posts.filter(
            (p) => p.user_id === user?.id || p.author_name === user?.name
          );
          setUserPosts(myPosts);
        }
      } catch (err) {
        console.warn('Profile load error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndPosts();
  }, [user]);

  // Handle direct Avatar file change
  const handleAvatarFile = async (file) => {
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setUploadingAvatar(true);

    try {
      const res = await updateAvatar(file);
      if (res.success) {
        setProfileData((prev) => ({ ...prev, avatar_url: res.avatar_url }));
        setEditForm((prev) => ({ ...prev, avatar_url: res.avatar_url }));
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Profile Update Save
  const handleSaveProfile = async () => {
    setSaving(true);
    const res = await updateProfile(editForm);
    setSaving(false);
    if (res.success) {
      setProfileData(res.user);
      setEditOpen(false);
    }
  };

  // Share profile link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const mediaPosts = userPosts.filter((p) => p.image_url);

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)" pb={{ base: '70px', md: '20px' }}>
      <Navbar2 title="CampApp" />

      {/* Hidden file input for direct avatar upload */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleAvatarFile(e.target.files[0]);
          }
        }}
      />

      <Box className="microblog-container">
        {/* Left Sidebar */}
        <Box className="microblog-left-sidebar">
          <Sidebar />
        </Box>

        {/* Center Profile View */}
        <Box className="microblog-center-feed" maxW="780px">
          {/* Profile Card */}
          <Box
            className="glass-card"
            borderRadius="3xl"
            overflow="hidden"
            bg="var(--bg-surface)"
            border="1px solid var(--border-color)"
            mb={6}
          >
            {/* Cover Banner */}
            <Box
              height={{ base: '140px', sm: '190px' }}
              bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)"
              position="relative"
            >
              <Box
                position="absolute"
                inset="0"
                opacity="0.15"
                backgroundImage="radial-gradient(#ffffff 1px, transparent 1px)"
                backgroundSize="16px 16px"
              />
            </Box>

            {/* Profile Action Bar & Avatar Overlap */}
            <Box px={{ base: 4, sm: 6 }} pb={6}>
              <HStack
                justify="space-between"
                align="flex-start"
                mb={4}
              >
                {/* Avatar with Camera Overlay */}
                <Box
                  position="relative"
                  mt={{ base: '-45px', sm: '-60px' }}
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Click to update profile photo"
                  role="group"
                >
                  <Avatar.Root
                    size={{ base: 'xl', sm: '2xl' }}
                    shape="full"
                    border="4px solid var(--bg-surface)"
                    boxShadow="var(--shadow-lg)"
                    bg="var(--bg-surface)"
                  >
                    <Avatar.Image
                      src={avatarPreview || profileData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    />
                    <Avatar.Fallback name={profileData.name || 'User'} />
                  </Avatar.Root>

                  {/* Camera overlay hover badge */}
                  <Box
                    position="absolute"
                    inset="0"
                    borderRadius="full"
                    bg="rgba(0, 0, 0, 0.45)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    opacity={uploadingAvatar ? 1 : 0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.2s ease"
                  >
                    {uploadingAvatar ? <Spinner size="sm" /> : <FiCamera size={22} />}
                  </Box>

                  {/* Camera Icon Pill at Bottom Corner */}
                  <Box
                    position="absolute"
                    bottom="2px"
                    right="2px"
                    p={1.5}
                    borderRadius="full"
                    bg="var(--brand-primary)"
                    color="white"
                    boxShadow="var(--shadow-md)"
                    border="2px solid var(--bg-surface)"
                  >
                    <FiCamera size={13} />
                  </Box>
                </Box>

                {/* Edit Profile & Share Buttons cleanly in card body */}
                <HStack gap={2} pt={3}>
                  {/* Edit Profile Dialog */}
                  <Dialog.Root open={editOpen} onOpenChange={(e) => setEditOpen(e.open)}>
                    <Dialog.Trigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        borderColor="var(--border-color)"
                        color="var(--text-primary)"
                        fontWeight="700"
                        _hover={{ bg: 'var(--brand-glow)', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
                      >
                        <FiEdit2 style={{ marginRight: 6 }} /> Edit Profile
                      </Button>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content
                          p={6}
                          borderRadius="2xl"
                          bg="var(--bg-surface)"
                          borderColor="var(--border-color)"
                          maxW="480px"
                        >
                          <Dialog.Header>
                            <Dialog.Title fontSize="lg" fontWeight="800">
                              Edit Profile
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                          </Dialog.Header>

                          <Dialog.Body>
                            {/* Hidden modal file input */}
                            <input
                              type="file"
                              ref={modalAvatarInputRef}
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleAvatarFile(e.target.files[0]);
                                }
                              }}
                            />

                            {/* Avatar Editor Section */}
                            <HStack gap={4} p={3} mb={3} borderRadius="xl" bg="var(--bg-primary)" align="center">
                              <Avatar.Root size="lg" shape="full">
                                <Avatar.Image src={avatarPreview || editForm.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} />
                                <Avatar.Fallback name={editForm.name || 'User'} />
                              </Avatar.Root>
                              <VStack align="flex-start" gap={1}>
                                <Text fontSize="xs" fontWeight="700" color="var(--text-primary)">
                                  Profile Picture
                                </Text>
                                <HStack gap={2}>
                                  <Button
                                    size="2xs"
                                    className="brand-button"
                                    borderRadius="full"
                                    loading={uploadingAvatar}
                                    onClick={() => modalAvatarInputRef.current?.click()}
                                  >
                                    <FiUploadCloud style={{ marginRight: 4 }} /> Upload Photo
                                  </Button>
                                  {editForm.avatar_url && (
                                    <Button
                                      size="2xs"
                                      variant="ghost"
                                      color="red.500"
                                      onClick={() => {
                                        setEditForm({ ...editForm, avatar_url: '' });
                                        setAvatarPreview('');
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </HStack>
                              </VStack>
                            </HStack>

                            <VStack gap={3} align="stretch">
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Display Name</Text>
                                <Input
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  borderRadius="lg"
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Bio</Text>
                                <Textarea
                                  value={editForm.bio}
                                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                  borderRadius="lg"
                                  rows={3}
                                  placeholder="Tell your camp community about your adventures..."
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Location / Country</Text>
                                <Input
                                  value={editForm.country}
                                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                  placeholder="e.g. Seattle, WA"
                                  borderRadius="lg"
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Or Avatar Image URL</Text>
                                <Input
                                  value={editForm.avatar_url}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, avatar_url: e.target.value });
                                    setAvatarPreview(e.target.value);
                                  }}
                                  placeholder="https://..."
                                  borderRadius="lg"
                                  fontSize="xs"
                                />
                              </Box>
                            </VStack>
                          </Dialog.Body>

                          <Dialog.Footer mt={4}>
                            <Button size="sm" variant="ghost" onClick={() => setEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="brand-button"
                              borderRadius="full"
                              px={5}
                              loading={saving}
                              onClick={handleSaveProfile}
                            >
                              <FiCheck style={{ marginRight: 6 }} /> Save Changes
                            </Button>
                          </Dialog.Footer>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>

                  <Button
                    size="sm"
                    variant="ghost"
                    borderRadius="full"
                    color="var(--text-secondary)"
                    onClick={handleShare}
                    title="Share profile link"
                  >
                    {copiedLink ? <FiCheck color="green" /> : <FiShare2 />}
                  </Button>
                </HStack>
              </HStack>

              {/* Name & Handle */}
              <Box mb={3}>
                <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl' }} fontWeight="800" color="var(--text-primary)">
                  {profileData.name || 'Camp Explorer'}
                </Heading>
                <Text fontSize="xs" color="var(--text-muted)">
                  @{profileData.name ? profileData.name.toLowerCase().replace(/\s+/g, '') : 'camper'} • {profileData.email}
                </Text>
              </Box>

              {/* Bio */}
              <Text fontSize="sm" color="var(--text-secondary)" mb={4} lineHeight="1.6">
                {profileData.bio || 'Outdoor enthusiast, hiker, and storyteller. Exploring the wonders of nature one campsite at a time. 🌲✨'}
              </Text>

              {/* Metadata Badges */}
              <HStack gap={4} wrap="wrap" fontSize="xs" color="var(--text-muted)" mb={5}>
                {profileData.country && (
                  <HStack gap={1}>
                    <FiMapPin color="var(--brand-primary)" />
                    <Text>{profileData.country}</Text>
                  </HStack>
                )}
                <HStack gap={1}>
                  <FiCalendar />
                  <Text>Joined {new Date(profileData.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</Text>
                </HStack>
              </HStack>

              {/* Stats Counters */}
              <HStack gap={8} pt={4} borderTop="1px solid var(--border-color)">
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {userPosts.length}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase" fontWeight="600">
                    Posts
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {profileData.followersCount ?? 42}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase" fontWeight="600">
                    Followers
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {profileData.followingCount ?? 18}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase" fontWeight="600">
                    Following
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Box>

          {/* Profile Navigation Tabs (Posts | Media) */}
          <HStack
            bg="var(--bg-surface)"
            border="1px solid var(--border-color)"
            borderRadius="full"
            p={1}
            mb={4}
          >
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              variant={activeTab === 'posts' ? 'solid' : 'ghost'}
              bg={activeTab === 'posts' ? 'var(--brand-primary)' : 'transparent'}
              color={activeTab === 'posts' ? 'white' : 'var(--text-secondary)'}
              onClick={() => setActiveTab('posts')}
            >
              Stories ({userPosts.length})
            </Button>
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              variant={activeTab === 'media' ? 'solid' : 'ghost'}
              bg={activeTab === 'media' ? 'var(--brand-primary)' : 'transparent'}
              color={activeTab === 'media' ? 'white' : 'var(--text-secondary)'}
              onClick={() => setActiveTab('media')}
            >
              <FiImage style={{ marginRight: 5 }} /> Media ({mediaPosts.length})
            </Button>
          </HStack>

          {/* User Posts Stream */}
          {activeTab === 'posts' && (
            <Box>
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <Card2
                    key={post.id}
                    post={post}
                    onDeletePost={(id) => setUserPosts(userPosts.filter((p) => p.id !== id))}
                  />
                ))
              ) : (
                <Box
                  p={8}
                  textAlign="center"
                  borderRadius="2xl"
                  bg="var(--bg-surface)"
                  border="1px dashed var(--border-color)"
                >
                  <Text fontSize="sm" fontWeight="600" color="var(--text-primary)" mb={1}>
                    No stories posted yet
                  </Text>
                  <Text fontSize="xs" color="var(--text-muted)">
                    Share your first camping story or photo from the feed!
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Media Grid */}
          {activeTab === 'media' && (
            <Box>
              {mediaPosts.length > 0 ? (
                <Box
                  display="grid"
                  gridTemplateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }}
                  gap={3}
                >
                  {mediaPosts.map((post) => (
                    <Box
                      key={post.id}
                      borderRadius="xl"
                      overflow="hidden"
                      height="160px"
                      position="relative"
                      bg="var(--bg-surface)"
                      border="1px solid var(--border-color)"
                      _hover={{ transform: 'scale(1.02)' }}
                      transition="transform 0.2s ease"
                    >
                      <Image
                        src={post.image_url}
                        alt="Media"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  p={8}
                  textAlign="center"
                  borderRadius="2xl"
                  bg="var(--bg-surface)"
                  border="1px dashed var(--border-color)"
                >
                  <FiImage size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px auto' }} />
                  <Text fontSize="sm" fontWeight="600" color="var(--text-primary)">
                    No media uploaded yet
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
} from '@chakra-ui/react';
import Navbar2 from '../components/Navbar2';
import Sidebar from '../components/Sidebar';
import Card2 from '../components/Card2';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import { FiEdit2, FiMapPin, FiMail, FiCalendar, FiShare2, FiCheck } from 'react-icons/fi';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(user || {});
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    country: user?.country || '',
    avatar_url: user?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);

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
    }

    const loadProfileAndPosts = async () => {
      try {
        const [profileRes, postsRes] = await Promise.allSettled([
          userAPI.getProfile('me'),
          postAPI.getAllPosts(),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.success) {
          setProfileData(profileRes.value.user);
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

  // Handle Profile Update
  const handleSaveProfile = async () => {
    setSaving(true);
    const res = await updateProfile(editForm);
    setSaving(false);
    if (res.success) {
      setProfileData(res.user);
      setEditOpen(false);
    }
  };

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)">
      <Navbar2 title="CampApp" />

      <Box className="microblog-container">
        <Box className="microblog-left-sidebar">
          <Sidebar />
        </Box>

        <Box className="microblog-center-feed" maxW="780px">
          {/* Profile Header Card */}
          <Box
            className="glass-card"
            borderRadius="3xl"
            overflow="hidden"
            bg="var(--bg-surface)"
            border="1px solid var(--border-color)"
            mb={6}
          >
            {/* Cover Image Banner */}
            <Box
              height="160px"
              bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
              position="relative"
            />

            {/* Profile Info Row */}
            <Box px={{ base: 5, md: 8 }} pb={6} position="relative">
              <HStack
                justify="space-between"
                align={{ base: 'flex-start', sm: 'flex-end' }}
                direction={{ base: 'column', sm: 'row' }}
                mt="-50px"
                mb={4}
                gap={4}
              >
                <Avatar.Root
                  size="2xl"
                  shape="full"
                  border="4px solid var(--bg-surface)"
                  boxShadow="var(--shadow-lg)"
                >
                  <Avatar.Image src={profileData.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"} />
                  <Avatar.Fallback name={profileData.name || "User"} />
                </Avatar.Root>

                <HStack gap={2}>
                  {/* Edit Profile Dialog */}
                  <Dialog.Root open={editOpen} onOpenChange={(e) => setEditOpen(e.open)}>
                    <Dialog.Trigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        borderColor="var(--border-color)"
                        color="var(--text-primary)"
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
                            <Dialog.Title fontSize="lg" fontWeight="700">
                              Edit Profile Details
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                          </Dialog.Header>

                          <Dialog.Body>
                            <VStack gap={3} mt={3} align="stretch">
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Name</Text>
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
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Country / Location</Text>
                                <Input
                                  value={editForm.country}
                                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                  borderRadius="lg"
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="600" mb={1}>Avatar URL</Text>
                                <Input
                                  value={editForm.avatar_url}
                                  onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                                  placeholder="https://..."
                                  borderRadius="lg"
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
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Profile link copied!");
                      }
                    }}
                  >
                    <FiShare2 />
                  </Button>
                </HStack>
              </HStack>

              {/* Name & Bio */}
              <Box mb={4}>
                <Heading as="h1" fontSize="xl" fontWeight="800" color="var(--text-primary)">
                  {profileData.name || "Camp Explorer"}
                </Heading>
                <Text fontSize="xs" color="var(--text-muted)">
                  {profileData.email}
                </Text>
              </Box>

              <Text fontSize="sm" color="var(--text-secondary)" mb={4} lineHeight="1.6">
                {profileData.bio || "No bio added yet. Tell your fellow campers about yourself!"}
              </Text>

              {/* Metadata Badges */}
              <HStack gap={4} wrap="wrap" fontSize="xs" color="var(--text-muted)" mb={5}>
                {profileData.country && (
                  <HStack gap={1}>
                    <FiMapPin />
                    <Text>{profileData.country}</Text>
                  </HStack>
                )}
                <HStack gap={1}>
                  <FiCalendar />
                  <Text>Joined {new Date(profileData.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</Text>
                </HStack>
              </HStack>

              {/* Stats Counters */}
              <HStack gap={6} pt={4} borderTop="1px solid var(--border-color)">
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {userPosts.length}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase">
                    Posts
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {profileData.followersCount || 42}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase">
                    Followers
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="800" color="var(--text-primary)">
                    {profileData.followingCount || 18}
                  </Text>
                  <Text fontSize="2xs" color="var(--text-muted)" textTransform="uppercase">
                    Following
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Box>

          {/* User Posts List */}
          <Box>
            <Text fontSize="sm" fontWeight="700" color="var(--text-primary)" mb={4}>
              Posts by {profileData.name?.split(' ')[0] || 'You'} ({userPosts.length})
            </Text>

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
                  No posts yet
                </Text>
                <Text fontSize="xs" color="var(--text-muted)">
                  Share your first camp story on the home feed.
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import React from 'react';
import { Box, VStack, Button, Text, HStack, Avatar, IconButton } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router';
import {
  FiHome,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiCompass,
  FiEdit3,
  FiBookmark,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onOpenComposer }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Camp Feed', path: '/home', icon: FiHome },
    { label: 'Explore', path: '/home', icon: FiCompass },
    { label: 'Bookmarks', path: '/bookmarks', icon: FiBookmark },
    { label: 'Messages', path: '/messaging', icon: FiMessageSquare },
    { label: 'My Profile', path: '/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleName = user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : '@camper';

  return (
    <Box as="aside" width="100%" height="100%" display="flex" flexDirection="column" justifyContent="space-between">
      {/* Top Nav Items */}
      <VStack gap={2} align="stretch" pt={1}>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={index}
              variant="ghost"
              justifyContent="flex-start"
              py={3.5}
              px={4}
              borderRadius="full"
              fontSize="sm"
              fontWeight={isActive ? '800' : '600'}
              bg={isActive ? 'var(--brand-glow)' : 'transparent'}
              color={isActive ? 'var(--brand-primary)' : 'var(--text-primary)'}
              _hover={{
                bg: 'var(--brand-glow)',
                color: 'var(--brand-primary)',
                transform: 'translateX(4px)',
              }}
              transition="all 0.15s ease"
              onClick={() => navigate(item.path)}
            >
              <HStack gap={3.5} width="100%">
                <IconComponent size={20} />
                <Text>{item.label}</Text>
              </HStack>
            </Button>
          );
        })}

        {/* Primary Post Button */}
        <Button
          className="brand-button"
          borderRadius="full"
          py={6}
          mt={4}
          fontSize="sm"
          fontWeight="800"
          boxShadow="0 4px 16px rgba(99, 102, 241, 0.35)"
          onClick={onOpenComposer || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        >
          <FiEdit3 style={{ marginRight: 8 }} size={18} /> Post to Camp
        </Button>
      </VStack>

      {/* User Info & Quick Logout Card */}
      <Box
        p={2.5}
        mt={4}
        borderRadius="full"
        bg="var(--bg-surface)"
        border="1px solid var(--border-color)"
        boxShadow="var(--shadow-sm)"
        transition="all 0.2s ease"
        _hover={{ borderColor: 'var(--brand-primary)', bg: 'var(--brand-glow)' }}
      >
        <HStack justify="space-between" align="center" gap={2}>
          <HStack
            gap={2.5}
            flex="1"
            minW="0"
            cursor="pointer"
            onClick={() => navigate('/profile')}
          >
            <Avatar.Root size="sm" shape="full">
              <Avatar.Image src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} />
              <Avatar.Fallback name={user?.name || 'User'} />
            </Avatar.Root>
            <Box flex="1" minW="0">
              <Text fontSize="xs" fontWeight="700" color="var(--text-primary)" noOfLines={1}>
                {user?.name || 'Camp Explorer'}
              </Text>
              <Text fontSize="3xs" color="var(--text-muted)" noOfLines={1}>
                {handleName}
              </Text>
            </Box>
          </HStack>

          <IconButton
            size="xs"
            variant="ghost"
            borderRadius="full"
            color="var(--text-muted)"
            _hover={{ color: 'red.500', bg: 'red.50' }}
            onClick={handleLogout}
            aria-label="Sign Out"
            title="Sign Out"
          >
            <FiLogOut size={16} />
          </IconButton>
        </HStack>
      </Box>
    </Box>
  );
}
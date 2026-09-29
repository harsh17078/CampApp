import React from 'react';
import {
  Box,
  HStack,
  Input,
  Text,
  IconButton,
  Avatar,
  Menu,
  Portal,
  Button,
} from '@chakra-ui/react';
import { IoSearchOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { FiCompass, FiMessageSquare, FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Navbar2({ title = "CampApp" }) {
  const navigate = useNavigate();
  const { user, logout, themeMode, toggleTheme } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      height="68px"
      zIndex="1100"
      className="glass-panel"
      borderBottom="1px solid var(--border-color)"
      px={{ base: 4, md: 8 }}
      display="flex"
      alignItems="center"
    >
      <HStack justify="space-between" width="100%" maxW="1400px" mx="auto">
        {/* Brand */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <HStack gap={2.5}>
            <Box
              p={2}
              borderRadius="xl"
              bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 10px rgba(99, 102, 241, 0.25)"
            >
              <FiCompass size={20} />
            </Box>
            <Text
              fontSize="xl"
              fontWeight="800"
              className="gradient-text"
              letterSpacing="-0.5px"
            >
              {title}
            </Text>
          </HStack>
        </Link>

        {/* Global Search */}
        <Box
          display={{ base: 'none', md: 'block' }}
          position="relative"
          width="420px"
          maxW="100%"
        >
          <Box
            position="absolute"
            left="14px"
            top="50%"
            transform="translateY(-50%)"
            color="var(--text-muted)"
            pointerEvents="none"
          >
            <IoSearchOutline size={18} />
          </Box>
          <Input
            placeholder="Search creators, stories, and camps..."
            pl="42px"
            pr="16px"
            py="8px"
            borderRadius="full"
            bg="var(--bg-surface)"
            color="var(--text-primary)"
            borderColor="var(--border-color)"
            _hover={{ borderColor: "var(--brand-primary)" }}
            _focus={{ borderColor: "var(--brand-primary)", boxShadow: "0 0 0 2px var(--brand-glow)" }}
            fontSize="sm"
          />
        </Box>

        {/* Actions & Profile */}
        <HStack gap={{ base: 1, sm: 3 }}>
          {/* Theme Switcher */}
          <IconButton
            variant="ghost"
            borderRadius="full"
            color="var(--text-primary)"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {themeMode === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
          </IconButton>

          {/* Messages Link */}
          <IconButton
            variant="ghost"
            borderRadius="full"
            color="var(--text-primary)"
            onClick={() => navigate('/messaging')}
            aria-label="Messages"
          >
            <FiMessageSquare size={19} />
          </IconButton>

          {/* Notifications */}
          <IconButton
            variant="ghost"
            borderRadius="full"
            color="var(--text-primary)"
            aria-label="Notifications"
          >
            <FiBell size={19} />
          </IconButton>

          {/* User Profile Menu */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" p={1} borderRadius="full" aria-label="Profile options">
                <HStack gap={2}>
                  <Avatar.Root size="sm" shape="full">
                    <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                    <Avatar.Fallback name={user?.name || "User"} />
                  </Avatar.Root>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="var(--text-primary)"
                    display={{ base: 'none', lg: 'block' }}
                  >
                    {user?.name?.split(' ')[0] || 'Account'}
                  </Text>
                </HStack>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  bg="var(--bg-surface)"
                  borderColor="var(--border-color)"
                  boxShadow="var(--shadow-xl)"
                  borderRadius="xl"
                  p={1.5}
                  minW="180px"
                >
                  <Menu.Item
                    value="profile"
                    onClick={() => navigate('/profile')}
                    borderRadius="lg"
                    p={2.5}
                    cursor="pointer"
                    color="var(--text-primary)"
                    _hover={{ bg: "var(--brand-glow)", color: "var(--brand-primary)" }}
                  >
                    <HStack gap={2}>
                      <FiUser size={16} />
                      <Text fontSize="sm">My Profile</Text>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item
                    value="logout"
                    onClick={handleLogout}
                    borderRadius="lg"
                    p={2.5}
                    cursor="pointer"
                    color="red.500"
                    _hover={{ bg: "red.50", color: "red.600" }}
                  >
                    <HStack gap={2}>
                      <FiLogOut size={16} />
                      <Text fontSize="sm">Sign Out</Text>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      </HStack>
    </Box>
  );
}

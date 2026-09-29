import React from 'react';
import { Box, VStack, Button, Text, HStack, Avatar } from '@chakra-ui/react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { FiHome, FiMessageSquare, FiUser, FiLogOut, FiCompass, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Camp Feed', path: '/home', icon: FiHome },
    { label: 'Messages', path: '/messaging', icon: FiMessageSquare },
    { label: 'Explore', path: '/home', icon: FiTrendingUp },
    { label: 'My Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <Box
      as="aside"
      display={{ base: 'none', md: 'block' }}
      position="fixed"
      left="0"
      top="68px"
      bottom="0"
      width="260px"
      className="glass-panel"
      borderRight="1px solid var(--border-color)"
      p={4}
      zIndex="900"
    >
      <VStack justify="space-between" height="100%" align="stretch">
        {/* Navigation Links */}
        <VStack gap={1.5} align="stretch" pt={3}>
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Button
                key={index}
                variant="ghost"
                justifyContent="flex-start"
                py={3}
                px={4}
                borderRadius="xl"
                fontSize="sm"
                fontWeight={isActive ? "700" : "500"}
                bg={isActive ? "var(--brand-glow)" : "transparent"}
                color={isActive ? "var(--brand-primary)" : "var(--text-primary)"}
                _hover={{
                  bg: "var(--brand-glow)",
                  color: "var(--brand-primary)",
                  transform: "translateX(4px)",
                }}
                transition="all 0.2s ease"
                onClick={() => navigate(item.path)}
              >
                <HStack gap={3}>
                  <IconComponent size={19} />
                  <Text>{item.label}</Text>
                </HStack>
              </Button>
            );
          })}
        </VStack>

        {/* User Card & Logout */}
        <Box
          p={3}
          borderRadius="2xl"
          bg="var(--bg-surface)"
          border="1px solid var(--border-color)"
          boxShadow="var(--shadow-sm)"
        >
          <HStack justify="space-between" mb={3}>
            <HStack gap={2.5} cursor="pointer" onClick={() => navigate('/profile')}>
              <Avatar.Root size="sm" shape="full">
                <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                <Avatar.Fallback name={user?.name || "User"} />
              </Avatar.Root>
              <Box overflow="hidden" maxW="120px">
                <Text fontSize="xs" fontWeight="700" isTruncated color="var(--text-primary)">
                  {user?.name || "Camp Explorer"}
                </Text>
                <Text fontSize="2xs" color="var(--text-muted)" isTruncated>
                  {user?.country ? `📍 ${user.country}` : '@camper'}
                </Text>
              </Box>
            </HStack>
          </HStack>

          <Button
            size="xs"
            variant="outline"
            width="100%"
            borderRadius="lg"
            colorPalette="red"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <FiLogOut style={{ marginRight: 6 }} /> Sign Out
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
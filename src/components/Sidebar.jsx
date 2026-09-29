import React from 'react';
import { Box, VStack, Button, Text, HStack, Avatar } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router';
import {
  FiHome,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiCompass,
  FiTrendingUp,
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
    { label: 'Messages', path: '/messaging', icon: FiMessageSquare },
    { label: 'My Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <Box
      as="aside"
      display={{ base: 'none', md: 'block' }}
      position="sticky"
      top="68px"
      height="calc(100vh - 68px)"
      width="260px"
      p={3}
      zIndex="900"
    >
      <VStack justify="space-between" height="100%" align="stretch">
        {/* Navigation Links */}
        <VStack gap={1.5} align="stretch" pt={1}>
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
                fontWeight={isActive ? "800" : "600"}
                bg={isActive ? "var(--brand-glow)" : "transparent"}
                color={isActive ? "var(--brand-primary)" : "var(--text-primary)"}
                _hover={{
                  bg: "var(--brand-glow)",
                  color: "var(--brand-primary)",
                  transform: "translateX(4px)",
                }}
                transition="all 0.15s ease"
                onClick={() => navigate(item.path)}
              >
                <HStack gap={3.5}>
                  <IconComponent size={20} />
                  <Text>{item.label}</Text>
                </HStack>
              </Button>
            );
          })}

          {/* Primary Quick Post Action */}
          <Button
            className="brand-button"
            borderRadius="full"
            py={6}
            mt={3}
            fontSize="sm"
            fontWeight="800"
            boxShadow="0 4px 16px rgba(99, 102, 241, 0.35)"
            onClick={onOpenComposer || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
          >
            <FiEdit3 style={{ marginRight: 8 }} size={18} /> Post to Camp
          </Button>
        </VStack>

        {/* User Card & Logout */}
        <Box
          p={3}
          borderRadius="2xl"
          bg="var(--bg-surface)"
          border="1px solid var(--border-color)"
          boxShadow="var(--shadow-sm)"
        >
          <HStack justify="space-between" mb={2.5}>
            <HStack gap={2.5} cursor="pointer" onClick={() => navigate('/profile')}>
              <Avatar.Root size="sm" shape="full">
                <Avatar.Image src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} />
                <Avatar.Fallback name={user?.name || "User"} />
              </Avatar.Root>
              <Box overflow="hidden" maxW="120px">
                <Text fontSize="xs" fontWeight="700" isTruncated color="var(--text-primary)">
                  {user?.name || "Camp Explorer"}
                </Text>
                <Text fontSize="3xs" color="var(--text-muted)" isTruncated>
                  {user?.country ? `📍 ${user.country}` : '@camper'}
                </Text>
              </Box>
            </HStack>
          </HStack>

          <Button
            size="2xs"
            variant="ghost"
            width="100%"
            borderRadius="lg"
            color="red.500"
            _hover={{ bg: "red.50", color: "red.600" }}
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
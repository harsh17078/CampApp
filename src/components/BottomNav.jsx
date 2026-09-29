import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router';
import { FiHome, FiCompass, FiPlusCircle, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ onOpenComposer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Feed', path: '/home', icon: FiHome },
    { label: 'Explore', path: '/home', icon: FiCompass },
    {
      label: 'Post',
      icon: FiPlusCircle,
      isAction: true,
      onClick: () => {
        if (location.pathname !== '/home') {
          navigate('/home');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onOpenComposer) onOpenComposer();
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (onOpenComposer) onOpenComposer();
        }
      },
    },
    { label: 'Messages', path: '/messaging', icon: FiMessageSquare },
    { label: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <Box
      as="nav"
      display={{ base: 'block', md: 'none' }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      height="60px"
      zIndex="1000"
      className="glass-panel"
      borderTop="1px solid var(--border-color)"
      bg="var(--bg-surface)"
      boxShadow="0 -4px 16px rgba(0, 0, 0, 0.06)"
    >
      <HStack justify="space-around" align="center" height="100%" px={2}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !item.isAction;

          return (
            <VStack
              key={idx}
              gap={0.5}
              cursor="pointer"
              color={
                item.isAction
                  ? 'var(--brand-primary)'
                  : isActive
                  ? 'var(--brand-primary)'
                  : 'var(--text-secondary)'
              }
              _hover={{ color: 'var(--brand-primary)' }}
              onClick={item.isAction ? item.onClick : () => navigate(item.path)}
              py={1}
              flex="1"
              align="center"
              transition="transform 0.15s ease"
              _active={{ transform: 'scale(0.92)' }}
            >
              {item.isAction ? (
                <Box
                  p={1.5}
                  borderRadius="full"
                  bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
                  color="white"
                  boxShadow="0 2px 8px rgba(99, 102, 241, 0.35)"
                  mt="-16px"
                >
                  <Icon size={22} />
                </Box>
              ) : (
                <Icon size={20} />
              )}
              <Text fontSize="3xs" fontWeight={isActive ? '700' : '500'}>
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
}

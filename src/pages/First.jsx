import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import NavFirst from '../components/NavFirst';
import Footer from '../components/Footer';
import { FiArrowRight, FiUsers, FiMessageCircle, FiHeart, FiZap, FiCompass } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function First() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiZap,
      title: "Where Connections Spark",
      desc: "Connect with authentic people, share real-time moments, and build communities around what you love.",
    },
    {
      icon: FiMessageCircle,
      title: "Digital Campfire Chat",
      desc: "Hop into vibrant conversations, direct messaging, and exchange ideas under the stars.",
    },
    {
      icon: FiUsers,
      title: "Find Your Tribe",
      desc: "Discover like-minded creators, campers, and innovators from across the globe.",
    },
    {
      icon: FiHeart,
      title: "Express Freely",
      desc: "Share your mood, photos, ideas, and stories with customizable feelings and reactions.",
    },
  ];

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg="var(--bg-primary)">
      <NavFirst />

      {/* Hero Section */}
      <Box pt={{ base: 32, md: 40 }} pb={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        {/* Background glow effects */}
        <Box
          position="absolute"
          top="10%"
          left="50%"
          transform="translateX(-50%)"
          width="600px"
          height="350px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.1) 50%, transparent 70%)"
          filter="blur(50px)"
          pointerEvents="none"
          zIndex="0"
        />

        <Container maxW="900px" textAlign="center" position="relative" zIndex="1">
          <Badge
            colorPalette="indigo"
            variant="subtle"
            borderRadius="full"
            px={4}
            py={1.5}
            mb={5}
            fontSize="xs"
            fontWeight="600"
          >
            🏕️ The Social Platform for Real Connections
          </Badge>

          <Heading
            as="h1"
            fontSize={{ base: "3xl", sm: "5xl", md: "6xl" }}
            fontWeight="900"
            lineHeight="1.1"
            letterSpacing="-1.5px"
            mb={6}
            color="var(--text-primary)"
          >
            Where Connections Spark &{' '}
            <Text as="span" className="gradient-text">
              Stories Unfold.
            </Text>
          </Heading>

          <Text
            fontSize={{ base: "md", md: "xl" }}
            color="var(--text-secondary)"
            maxW="700px"
            mx="auto"
            mb={8}
            lineHeight="1.6"
          >
            Camp is your digital campfire. Share life updates, exchange genuine thoughts,
            and build lasting friendships in a community designed for authentic expression.
          </Text>

          <HStack justify="center" gap={4} wrap="wrap">
            <Button
              size="lg"
              className="brand-button"
              borderRadius="full"
              px={8}
              py={6}
              fontSize="md"
              onClick={() => navigate(isAuthenticated ? "/home" : "/login?mode=signup")}
            >
              {isAuthenticated ? "Enter Camp Feed" : "Get Started — Free"}
              <FiArrowRight style={{ marginLeft: 8 }} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderRadius="full"
              px={7}
              py={6}
              fontSize="md"
              borderColor="var(--border-color)"
              color="var(--text-primary)"
              _hover={{ bg: "var(--brand-glow)" }}
              onClick={() => navigate(isAuthenticated ? "/home" : "/login")}
            >
              Sign In
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Feature Highlights Grid */}
      <Box py={{ base: 12, md: 20 }} bg="var(--bg-surface)" borderTop="1px solid var(--border-color)">
        <Container maxW="1100px">
          <VStack textAlign="center" mb={12}>
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color="var(--text-primary)">
              Why You'll Love CampApp
            </Heading>
            <Text fontSize="sm" color="var(--text-muted)" maxW="500px">
              Simple, authentic, and focused on meaningful social moments.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Box
                  key={idx}
                  className="glass-card"
                  p={6}
                  borderRadius="2xl"
                  bg="var(--bg-primary)"
                  border="1px solid var(--border-color)"
                  textAlign="left"
                >
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="var(--brand-glow)"
                    color="var(--brand-primary)"
                    display="inline-block"
                    mb={4}
                  >
                    <IconComp size={24} />
                  </Box>
                  <Heading as="h3" fontSize="md" fontWeight="700" mb={2} color="var(--text-primary)">
                    {item.title}
                  </Heading>
                  <Text fontSize="xs" color="var(--text-secondary)" lineHeight="1.6">
                    {item.desc}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

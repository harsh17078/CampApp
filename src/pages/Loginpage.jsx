import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  Tabs,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  NativeSelect,
} from '@chakra-ui/react';
import { PasswordInput } from '../components/ui/password-input';
import { FiLogIn, FiUserPlus, FiCompass, FiAlertCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import NavFirst from '../components/NavFirst';
import Footer from '../components/Footer';

export default function Loginpage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Signup Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    dob: '',
    country: 'United States',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  // Handle Signup Submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password.trim()) {
      setErrorMessage('Name, Email, and Password are required.');
      return;
    }

    if (signupForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register(signupForm);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Registration failed. Try again.');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg="var(--bg-primary)">
      <NavFirst />

      <Container maxW="500px" pt={{ base: 28, md: 36 }} pb={16} flex="1">
        <Card.Root
          className="glass-card"
          p={{ base: 6, md: 8 }}
          borderRadius="3xl"
          bg="var(--bg-surface)"
          border="1px solid var(--border-color)"
        >
          {/* Header */}
          <VStack textAlign="center" mb={6} gap={2}>
            <Box
              p={3}
              borderRadius="2xl"
              bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
              color="white"
              boxShadow="0 6px 16px rgba(99, 102, 241, 0.3)"
            >
              <FiCompass size={28} />
            </Box>
            <Heading as="h2" fontSize="2xl" fontWeight="800" color="var(--text-primary)">
              Welcome to <Text as="span" className="gradient-text">Camp</Text>
            </Heading>
            <Text fontSize="xs" color="var(--text-secondary)">
              Join conversations, meet friends, and share your journey.
            </Text>
          </VStack>

          {/* Feedback Messages */}
          {errorMessage && (
            <HStack p={3} mb={4} bg="red.50" color="red.700" borderRadius="xl" fontSize="xs">
              <FiAlertCircle size={16} />
              <Text flex="1">{errorMessage}</Text>
            </HStack>
          )}

          {successMessage && (
            <HStack p={3} mb={4} bg="green.50" color="green.700" borderRadius="xl" fontSize="xs">
              <Text flex="1">{successMessage}</Text>
            </HStack>
          )}

          {/* Tabs */}
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Tabs.List mb={6} justify="center" bg="var(--bg-primary)" p={1} borderRadius="full">
              <Tabs.Trigger
                value="login"
                borderRadius="full"
                px={6}
                py={2}
                fontSize="xs"
                fontWeight="700"
                color="var(--text-primary)"
              >
                Sign In
              </Tabs.Trigger>
              <Tabs.Trigger
                value="signup"
                borderRadius="full"
                px={6}
                py={2}
                fontSize="xs"
                fontWeight="700"
                color="var(--text-primary)"
              >
                Create Account
              </Tabs.Trigger>
            </Tabs.List>

            {/* Login Tab */}
            <Tabs.Content value="login">
              <VStack as="form" onSubmit={handleLogin} gap={4} align="stretch">
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Email Address
                  </Text>
                  <Input
                    type="email"
                    placeholder="camper@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Password
                  </Text>
                  <PasswordInput
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                  />
                </Box>

                <Button
                  type="submit"
                  className="brand-button"
                  size="md"
                  borderRadius="xl"
                  mt={2}
                  loading={loading}
                >
                  <FiLogIn style={{ marginRight: 6 }} /> Sign In to Camp
                </Button>
              </VStack>
            </Tabs.Content>

            {/* Signup Tab */}
            <Tabs.Content value="signup">
              <VStack as="form" onSubmit={handleSignup} gap={3.5} align="stretch">
                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Full Name *
                  </Text>
                  <Input
                    placeholder="Alex Morgan"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Email Address *
                  </Text>
                  <Input
                    type="email"
                    placeholder="alex@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Create Password *
                  </Text>
                  <PasswordInput
                    placeholder="Min 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                  />
                </Box>

                <HStack gap={3}>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                      Phone
                    </Text>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      bg="var(--bg-primary)"
                      borderRadius="xl"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                      Gender
                    </Text>
                    <NativeSelect.Root size="md">
                      <NativeSelect.Field
                        value={signupForm.gender}
                        onChange={(e) => setSignupForm({ ...signupForm, gender: e.target.value })}
                        bg="var(--bg-primary)"
                        borderRadius="xl"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </HStack>

                <HStack gap={3}>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                      Birth Date
                    </Text>
                    <Input
                      type="date"
                      value={signupForm.dob}
                      onChange={(e) => setSignupForm({ ...signupForm, dob: e.target.value })}
                      bg="var(--bg-primary)"
                      borderRadius="xl"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                      Country
                    </Text>
                    <Input
                      placeholder="e.g. Canada"
                      value={signupForm.country}
                      onChange={(e) => setSignupForm({ ...signupForm, country: e.target.value })}
                      bg="var(--bg-primary)"
                      borderRadius="xl"
                    />
                  </Box>
                </HStack>

                <Button
                  type="submit"
                  className="brand-button"
                  size="md"
                  borderRadius="xl"
                  mt={2}
                  loading={loading}
                >
                  <FiUserPlus style={{ marginRight: 6 }} /> Join Camp Community
                </Button>
              </VStack>
            </Tabs.Content>
          </Tabs.Root>

          <Text textAlign="center" fontSize="3xs" color="var(--text-muted)" mt={5}>
            By signing up, you agree to CampApp's Terms of Service and Privacy Policy.
          </Text>
        </Card.Root>
      </Container>

      <Footer />
    </Box>
  );
}
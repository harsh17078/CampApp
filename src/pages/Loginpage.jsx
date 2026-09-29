import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import {
  FiLogIn,
  FiUserPlus,
  FiCompass,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiZap,
} from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import NavFirst from '../components/NavFirst';
import Footer from '../components/Footer';

export default function Loginpage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Handle Login Submit
  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(loginEmail.trim(), loginPassword);
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  // Handle Signup Submit
  const handleSignup = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Please provide your name, email, and password.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      phone: phone.trim(),
      country: country.trim(),
      gender: 'other',
      bio: 'New explorer ready to connect at Camp!',
    });
    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Registration failed. Please check your details.');
    }
  };

  // Quick Demo Login helper
  const handleDemoLogin = async () => {
    setLoginEmail('elena@campapp.com');
    setLoginPassword('password123');
    setLoading(true);
    const result = await login('elena@campapp.com', 'password123');
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Demo login failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg="var(--bg-primary)">
      <NavFirst />

      <Container maxW="460px" pt={{ base: 24, md: 32 }} pb={12} flex="1">
        <Box
          className="glass-card"
          p={{ base: 6, sm: 8 }}
          borderRadius="3xl"
          bg="var(--bg-surface)"
          border="1px solid var(--border-color)"
          boxShadow="var(--shadow-xl)"
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
            <Heading as="h1" fontSize="2xl" fontWeight="800" color="var(--text-primary)">
              {mode === 'login' ? 'Sign In to ' : 'Create Your '}
              <Text as="span" className="gradient-text">Camp</Text>
            </Heading>
            <Text fontSize="xs" color="var(--text-secondary)">
              {mode === 'login'
                ? 'Welcome back to your digital campfire community.'
                : 'Join vibrant discussions and meet fellow creators.'}
            </Text>
          </VStack>

          {/* Quick Tab Switcher */}
          <HStack
            bg="var(--bg-primary)"
            p={1}
            borderRadius="full"
            mb={5}
            border="1px solid var(--border-color)"
          >
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              variant={mode === 'login' ? 'solid' : 'ghost'}
              bg={mode === 'login' ? 'var(--brand-primary)' : 'transparent'}
              color={mode === 'login' ? 'white' : 'var(--text-primary)'}
              _hover={{ opacity: 0.9 }}
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
            >
              <FiLogIn style={{ marginRight: 6 }} /> Sign In
            </Button>
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              variant={mode === 'signup' ? 'solid' : 'ghost'}
              bg={mode === 'signup' ? 'var(--brand-primary)' : 'transparent'}
              color={mode === 'signup' ? 'white' : 'var(--text-primary)'}
              _hover={{ opacity: 0.9 }}
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
            >
              <FiUserPlus style={{ marginRight: 6 }} /> Register
            </Button>
          </HStack>

          {/* Feedback Alerts */}
          {errorMessage && (
            <HStack p={3} mb={4} bg="red.50" color="red.700" borderRadius="xl" fontSize="xs">
              <FiAlertCircle size={18} />
              <Text flex="1" fontWeight="500">{errorMessage}</Text>
            </HStack>
          )}

          {successMessage && (
            <HStack p={3} mb={4} bg="green.50" color="green.700" borderRadius="xl" fontSize="xs">
              <FiCheckCircle size={18} />
              <Text flex="1" fontWeight="500">{successMessage}</Text>
            </HStack>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <VStack as="form" onSubmit={handleLogin} gap={3.5} align="stretch">
              <Box>
                <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                  Email Address
                </Text>
                <Input
                  type="email"
                  placeholder="camper@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  bg="var(--bg-primary)"
                  borderRadius="xl"
                  fontSize="sm"
                  color="var(--text-primary)"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                  Password
                </Text>
                <Box position="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                    fontSize="sm"
                    pr="42px"
                    color="var(--text-primary)"
                  />
                  <IconButton
                    position="absolute"
                    right="8px"
                    top="50%"
                    transform="translateY(-50%)"
                    size="xs"
                    variant="ghost"
                    color="var(--text-muted)"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </IconButton>
                </Box>
              </Box>

              <Button
                type="submit"
                className="brand-button"
                size="md"
                borderRadius="xl"
                mt={2}
                loading={loading}
              >
                <FiLogIn style={{ marginRight: 6 }} /> Sign In
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                borderRadius="xl"
                borderColor="var(--border-color)"
                color="var(--text-secondary)"
                onClick={handleDemoLogin}
              >
                <FiZap style={{ marginRight: 6, color: '#f59e0b' }} /> One-Click Demo Login
              </Button>
            </VStack>
          ) : (
            /* Signup Form */
            <VStack as="form" onSubmit={handleSignup} gap={3} align="stretch">
              <Box>
                <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                  Full Name *
                </Text>
                <Input
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  bg="var(--bg-primary)"
                  borderRadius="xl"
                  fontSize="sm"
                  color="var(--text-primary)"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                  Email Address *
                </Text>
                <Input
                  type="email"
                  placeholder="alex@campapp.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  bg="var(--bg-primary)"
                  borderRadius="xl"
                  fontSize="sm"
                  color="var(--text-primary)"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                  Password *
                </Text>
                <Box position="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                    fontSize="sm"
                    pr="42px"
                    color="var(--text-primary)"
                  />
                  <IconButton
                    position="absolute"
                    right="8px"
                    top="50%"
                    transform="translateY(-50%)"
                    size="xs"
                    variant="ghost"
                    color="var(--text-muted)"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </IconButton>
                </Box>
              </Box>

              <HStack gap={3}>
                <Box flex="1">
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Phone
                  </Text>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                    fontSize="sm"
                    color="var(--text-primary)"
                  />
                </Box>
                <Box flex="1">
                  <Text fontSize="xs" fontWeight="600" mb={1} color="var(--text-primary)">
                    Country
                  </Text>
                  <Input
                    placeholder="e.g. United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    bg="var(--bg-primary)"
                    borderRadius="xl"
                    fontSize="sm"
                    color="var(--text-primary)"
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
                <FiUserPlus style={{ marginRight: 6 }} /> Create Account
              </Button>
            </VStack>
          )}

          <Text textAlign="center" fontSize="3xs" color="var(--text-muted)" mt={5}>
            By continuing, you agree to CampApp's Community Guidelines & Privacy Terms.
          </Text>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
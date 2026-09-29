import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { FiCompass, FiLogIn, FiUserPlus, FiMoon, FiSun } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NavFirst = () => {
  const navigate = useNavigate();
  const { themeMode, toggleTheme, isAuthenticated } = useAuth();

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      className="glass-panel"
      px={{ base: 4, md: 8 }}
      py={3}
      borderBottom="1px solid var(--border-color)"
    >
      <HStack justify="space-between" maxW="1200px" mx="auto">
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <HStack gap={2} cursor="pointer">
            <Box
              p={2}
              borderRadius="xl"
              bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 10px rgba(99, 102, 241, 0.3)"
            >
              <FiCompass size={22} />
            </Box>
            <Text
              fontSize="xl"
              fontWeight="800"
              letterSpacing="-0.5px"
              className="gradient-text"
            >
              CampApp
            </Text>
          </HStack>
        </Link>

        {/* Action Buttons */}
        <HStack gap={3}>
          <Button
            size="sm"
            variant="ghost"
            borderRadius="full"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            color="var(--text-primary)"
          >
            {themeMode === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </Button>

          {isAuthenticated ? (
            <Button
              size="sm"
              className="brand-button"
              borderRadius="full"
              px={5}
              onClick={() => navigate("/home")}
            >
              Go to Feed
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                borderRadius="full"
                color="var(--text-primary)"
                onClick={() => navigate("/login")}
              >
                <FiLogIn style={{ marginRight: 6 }} /> Sign In
              </Button>
              <Button
                size="sm"
                className="brand-button"
                borderRadius="full"
                px={4}
                onClick={() => navigate("/login?mode=signup")}
              >
                <FiUserPlus style={{ marginRight: 6 }} /> Get Started
              </Button>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavFirst;

import { Box, Container, Stack, Text, HStack, Link } from "@chakra-ui/react";
import { FiHeart, FiGithub, FiTwitter, FiCompass } from "react-icons/fi";

const Footer = () => {
  return (
    <Box
      as="footer"
      mt="auto"
      py={6}
      borderTop="1px solid var(--border-color)"
      bg="var(--bg-surface)"
      color="var(--text-secondary)"
    >
      <Container maxW="1200px">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={3}
        >
          <HStack gap={2}>
            <FiCompass />
            <Text fontSize="sm" fontWeight="700" className="gradient-text">
              CampApp
            </Text>
            <Text fontSize="xs" color="var(--text-muted)">
              — Where Connections Spark & Stories Unfold
            </Text>
          </HStack>

          <HStack gap={1} fontSize="xs">
            <Text>Crafted with</Text>
            <FiHeart color="#ec4899" size={14} />
            <Text>for the community © {new Date().getFullYear()} CampApp</Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

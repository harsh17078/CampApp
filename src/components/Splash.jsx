import React from 'react';
import { Box, Spinner, Center, Text, VStack } from "@chakra-ui/react";
import { FiCompass } from "react-icons/fi";

const Splash = () => {
  return (
    <Center minHeight="100vh" bg="var(--bg-primary)">
      <VStack gap={4}>
        <Box
          p={4}
          borderRadius="2xl"
          bg="linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
          color="white"
          boxShadow="0 8px 24px rgba(99, 102, 241, 0.35)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FiCompass size={36} />
        </Box>
        <Text fontSize="xl" fontWeight="800" className="gradient-text">
          CampApp
        </Text>
        <Spinner
          color="var(--brand-primary)"
          size="md"
        />
      </VStack>
    </Center>
  );
};

export default Splash;

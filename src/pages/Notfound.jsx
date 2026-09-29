import React from 'react';
import { Box, Center, VStack, Heading, Text, Button } from "@chakra-ui/react";
import notfound from "../assets/notfound.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import { FiHome } from "react-icons/fi";
import NavFirst from "../components/NavFirst";

export default function Notfound() {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" bg="var(--bg-primary)" display="flex" flexDirection="column">
      <NavFirst />
      <Center flex="1" p={6}>
        <VStack gap={4} textAlign="center">
          <Lottie
            animationData={notfound}
            loop={true}
            style={{ width: "280px", height: "280px" }}
          />
          <Heading as="h1" fontSize="2xl" fontWeight="800" color="var(--text-primary)">
            Lost in the Wilderness? (404)
          </Heading>
          <Text fontSize="sm" color="var(--text-secondary)" maxW="400px">
            The camp trail you're looking for doesn't exist or has moved deeper into the woods.
          </Text>
          <Button
            className="brand-button"
            borderRadius="full"
            px={6}
            size="md"
            onClick={() => navigate('/home')}
          >
            <FiHome style={{ marginRight: 8 }} /> Return to Camp
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}
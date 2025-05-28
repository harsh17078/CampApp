import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Input,
  Text,
  Button,
  AvatarImage, AvatarFallback,
  Wrap,
  WrapItem,
  Collapsible,
  AvatarGroup,
  defineStyle

} from '@chakra-ui/react';
import { IoLocation } from 'react-icons/io5';
import ExportImage from '../components/Image';
import { BsEmojiSunglasses } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import { useState,useEffect } from 'react';
import { Popover, Portal } from "@chakra-ui/react";




export default function HeaderCard(props) {

   const ringCss = defineStyle({
      outlineWidth: "2px",
      outlineColor: "colorPalette.500",
      outlineOffset: "2px",
      outlineStyle: "solid",
    });

  const [emoji, setEmoji] = useState(null);
  const onEmojiClick = (emojiData) => {

    setEmoji(emojiData.emoji)

  };

  const [inputValue, setInputValue] = useState("");
  const isOpen = inputValue.trim() !== "";

  const [user, setUser] = useState({
          email: "",
          phone: "",
          password: "",
          name: "",
          gender: "",
          dob: "",
          country: ""
      });
  
        useEffect(() => {
            const storedUser = localStorage.getItem("userdata");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
        }, []);

  return (

    <>
      <Box position="sticky"
        top="-5px"
        left="16%"
        zIndex="500"
        my={'3rem'}
        mx={'5rem'}
        display="flex"
       
      >
        {/* Sticky Card */}
        <Box
          w={{ base: '100%', sm: '24rem', md: '38rem' }}
          maxW="100%"
          borderWidth="1px"
          borderRadius="xl"
          style = {props.myStyle}
          boxShadow="xl"
          top="60px"
          p={4}
          // bg="white"
          mx="auto"
          ml='26%'
          zIndex={10}
        >

          <HStack spacing={4} style = {props.myStyle}>
             <AvatarGroup>
                                <Avatar.Root css={ringCss} size="lg" colorPalette="pink">
                                  <Avatar.Fallback name={user.name} />
                                </Avatar.Root>
                              </AvatarGroup>
            <Input style = {props.myStyle} placeholder="what's in your mind !" variant="Flushed"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} />
          </HStack>
          <Collapsible.Root open={isOpen}>
            <Collapsible.Content>
            {/* Footer  */}
            <Wrap spacing={4} mt={4} align="center" justify="space-between">
              <WrapItem paddingX={0} marginTop={0}>
                <ExportImage/>
              </WrapItem>

              <WrapItem >
                <HStack gapX={0}>
                  <IoLocation />
                  <Text pt='4' fontWeight="medium">Location</Text>
                </HStack>

              </WrapItem>

              <WrapItem spacing={8}>
                <Popover.Root positioning={{ placement: "bottom-end" }}>
                  <Popover.Trigger asChild>
                    <HStack gapX={0}>

                      {!emoji && <BsEmojiSunglasses />}
                      {emoji && <Box as="span">{emoji}</Box>}
                      <Text pt='4' px={'1'} fontWeight="medium">Feeling</Text>
                    </HStack>
                  </Popover.Trigger>
                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content w='auto'>
                        <Popover.Arrow />
                        <Popover.Body> <EmojiPicker onEmojiClick={onEmojiClick} height={300} /></Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>

              </WrapItem>

              <WrapItem ml={{ sm: "1" }}>
                <Button
                style = {props.myStyle}
                  variant="outline"
                  colorPalette={'green'}
                  // bg="#2d724d9c"
                  color="black"
                  p={{ sm: "10px" }}
                  size={{ sm: "xs", md: "sm" }}
                  borderRadius="sm"
                >
                  Share
                </Button>
              </WrapItem>
            </Wrap>
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </Box >
    </>
  )
}



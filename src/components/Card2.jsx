
import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Input,
  Text,
  Button,
  Container,
  Icon,
  IconButton,
  AvatarImage, AvatarFallback,
  Tag,
  Wrap,
  WrapItem,
  Separator, Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuCircleUser, LuFileBadge } from 'react-icons/lu';
import { IoLocation } from 'react-icons/io5';
import ExportImage from '../components/Image';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import CardSkeleton from "../components/CardSkeleton"

export default function CardBody2(props) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [liked, setLiked] = useState(null);

  return (
    <>

      {/* second card */}
      <VStack spacing={8} align="center" px="4" mt={8}>
        <Box
          w={{ base: '100%', sm: '24rem', md: '35rem' }}
          borderWidth="1px"
          borderRadius="xl"
          boxShadow="xl"
          p={4}
         style = {props.myStyle}
          // bg="white"
        >

          {props.loading
            ?
            <CardSkeleton/>
            :
            (
              <>
              
              {/* Header */ }
              < HStack spacing={4}>
          <Avatar.Root css={{ outlineWidth: "2px", outlineColor: "colorPalette.500", outlineOffset: "2px", outlineStyle: "solid" }} colorPalette={'pink'} size="lg" shape="full">
            <AvatarImage src="https://images.unsplash.com/photo-1592046285097-6cdf4daf0d69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D"></AvatarImage>
            <AvatarFallback name="Harsh" > </AvatarFallback>
          </Avatar.Root>

            <Box>
              <Text marginTop={0} marginBottom={0} paddingY={0} fontWeight="bold" fontSize="sm">
                Harsh Maurya
              </Text>
              <Text marginTop={0} marginBottom={0} paddingY={0} fontSize="sm"  color="gray.500" style = {props.myStyle}>
                @harsh{props.post.userId}
              </Text>
            </Box>
          </HStack>

        {/* Content */}
        <Text fontWeight="semibold" my={'3'}>{props.post.title}</Text>
        <Text mt={'3'} fontSize="sm" lineHeight={{ base: "13px", md: "normal" }}>
          {props.post.body}
        </Text>

        {/* Footer */}
        <Box mt={6}>
          <Wrap spacing={4} justify="space-between" align="center">
            <WrapItem>
              <HStack gap={0}>


                <IconButton onClick={() => setLiked(liked === 'like' ? null : 'like')}
                  size="md"
                  variant="ghost"
                  rounded="full"
                  colorScheme="green"
                >
                  {liked === 'like' ? <BiSolidLike /> : <BiLike />}

                </IconButton>
                {liked === 'like' ?
                  <Text mb={0}>{props.post.reactions.likes + 1}</Text>
                  :
                  <Text mb={0}>{props.post.reactions.likes}</Text>
                }



                <IconButton onClick={() => setLiked(liked === 'dislike' ? null : 'dislike')}

                  size="md"
                  variant="ghost"
                  rounded="full"
                // colorScheme="red"
                >

                  {liked === 'dislike' ? <BiSolidDislike /> : <BiDislike />}
                </IconButton>

                {liked === 'dislike' ?

                  <Text mb={0} >{props.post.reactions.dislikes + 1}</Text>
                  :

                  <Text mb={0} >{props.post.reactions.dislikes}</Text>
                }

              </HStack>
            </WrapItem>
            <Wrap position={'relative'} justifyContent={'end'}>
              <WrapItem flex="1" minW={isMobile ? '100%' : '60%'}>
                <Input placeholder="Add a comment..." size="sm" />
              </WrapItem>

              <WrapItem position={'absolute'}>
                <Button size="sm" variant={'outline'} colorPalette={'green'}>
                  Post
                </Button>
              </WrapItem>
            </Wrap>
          </Wrap>
        </Box>
        </>
        )
        }
      </Box>
    </VStack >

    </>
  );
}

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
 
} from '@chakra-ui/react';
import { LuCircleUser,LuFileBadge } from 'react-icons/lu';
import { IoLocation } from 'react-icons/io5';
import ExportImage from '../components/Image';

export default function HeaderCard(){
    return(
        <>
       <Box  position="fixed"
        top="60px"
        left="0"
        right="0"
        zIndex="999"
       my = {'1rem'}
        display="flex"
        justifyContent="center"
         px="4"  w="100%">
               {/* Sticky Card */}
               <Box
                 w={{ base: '100%', sm: '24rem', md: '40rem' }}
                 maxW="100%"
                 
                 borderWidth="1px"
                 borderRadius="xl"
                
                 boxShadow="xl"
                 top="60px" 
                 p={4}
                 bg="white"
                 mx="auto"
                 zIndex={10}
               >
                
                 <HStack spacing={4}>
                    <Avatar.Root css={{outlineWidth : "2px" , outlineColor : "colorPalette.500" , outlineOffset : "2px" , outlineStyle :"solid"}} colorPalette={'pink'} size="lg" shape="full">
                                        <AvatarImage src = "https://images.unsplash.com/photo-1592046285097-6cdf4daf0d69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D"></AvatarImage>
                                        <AvatarFallback name="Harsh" > </AvatarFallback>
                                    </Avatar.Root>
                                    <Input placeholder = "what's in your mind !" variant = "Flushed"/>
                 </HStack>
       
                 {/* Footer  */}
                 <Wrap spacing={4} mt={4} align="center" justify="space-between">
                   <WrapItem paddingX= {0} marginTop={0}>
                     <ExportImage />
                   </WrapItem>
       
                   <WrapItem >
                     <HStack gapX= {0}>
                              <IoLocation />
                       <Text  pt = '4'  fontWeight="medium">Location</Text>
                      </HStack>
                  
                   </WrapItem>
       
                   <WrapItem spacing = {8}>
                     <Text pt = '4' px = {'4'} fontWeight="medium">Feeling</Text>
                   </WrapItem>
       
                   <WrapItem ml={{sm : "1"}}>
                     <Button
                       variant="outline"
                        colorPalette=  {'green'}
                       // bg="#2d724d9c"
                       color="black"
                       p = {{ sm : "10px"}}
                       size={{sm : "xs" , md : "sm"}}
                       borderRadius="sm"
                     >
                       Share
                     </Button>
                   </WrapItem>
                 </Wrap>
               </Box>
             </Box> 
        
        
        
    

        </>
    )



}
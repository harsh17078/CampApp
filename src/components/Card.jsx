import react from 'react'
import {Card , Button , Avatar, AvatarImage, AvatarFallback, CardTitle, VStack, Separator, HStack , Input , Text, Container} from '@chakra-ui/react'
import Exportimage from '../components/Image'
import {  Tag } from "@chakra-ui/react"
import { LuCircleUser, LuFileBadge, LuGhost } from "react-icons/lu"
import { FaGhost } from 'react-icons/fa6'
import { IoLocation } from "react-icons/io5"

export default function CardBody(){
    return(
        <>
        <VStack display={'flex'}  gap = {'10'} alignItems="center" justifyContent={'center'} style={{ paddingTop: "80px" }}>
            <Card.Root border = {'InactiveBorder'} borderRadius={'xl'} shadow={'2xl'} width="75vh" h={'40'}  >
                <Card.Body >
                 <HStack gap = {4}>
                    <Avatar.Root css={{outlineWidth : "2px" , outlineColor : "colorPalette.500" , outlineOffset : "2px" , outlineStyle :"solid"}} colorPalette={'pink'} size="lg" shape="full">
                        <AvatarImage src = "https://images.unsplash.com/photo-1592046285097-6cdf4daf0d69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D"></AvatarImage>
                        <AvatarFallback name="Harsh" > </AvatarFallback>
                    </Avatar.Root>
                    <Input placeholder = "what's in your mind !" variant = "Flushed"/>
                 </HStack>     
                   
                </Card.Body>
                
                    <Separator flex="1" />
               
                <Card.Footer>
                    <Container paddingX= {0} marginTop={0} >
                          <Exportimage/>
                        {/* <Text fontWeight={'medium'}>Photo</Text> */}
                    </Container>
                    <Container marginLeft = {'4'} paddingX= {0} marginTop={0}>
                        <HStack >
                                <Tag.Root variant= {FaGhost} size={'xl'}>
                                    <Tag.StartElement>
                                    <LuCircleUser />
                                    </Tag.StartElement>
                                    <Tag.Label fontWeight={'medium'}>Tags</Tag.Label>
                                </Tag.Root>
                               
                        </HStack>
                        {/* <Text fontWeight={'medium'}>Tag</Text> */}
                    </Container>
                     <Container marginTop={4}>
                        <HStack gapX={1}>
                        <Container marginTop={-4}  paddingX= {0}>
                            <IoLocation />
                        </Container>
                        <Text fontWeight={'medium'}>Location</Text>
                        </HStack>
                       
                    </Container>
                     <Container marginTop={4}>
                        <Text fontWeight={'medium'}>Feeling</Text>
                    </Container>
                     <Container marginTop={3}>
                      <Button variant="subtle" backgroundColor = {'#2d724d9c'} borderRadius={'sm'}>Share</Button>
                    </Container>
                
                </Card.Footer>
            </Card.Root>


            <Card.Root border = {'InactiveBorder'} borderRadius={'xl'} shadow={'2xl'} width="75vh" h={'80'}>
                <Card.Body  gap = {2}>
                    <HStack >
                       
                         <Avatar.Root css={{outlineWidth : "2px" , outlineColor : "colorPalette.500" , outlineOffset : "2px" , outlineStyle :"solid"}} colorPalette={'pink'} size="lg" shape="full">
                        <AvatarImage src = "https://images.unsplash.com/photo-1592046285097-6cdf4daf0d69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D"></AvatarImage>
                        <AvatarFallback name="Harsh" > </AvatarFallback>
                    </Avatar.Root>
                
                    <Container  paddingX ={0}>
                        <Text marginTop = {0} marginBottom = {0} paddingY={0} fontWeight= {'bold'} fontSize={'smaller'} >Harsh maurya</Text>
                        <Text marginTop = {0} marginBottom = {0} paddingY={0}  fontWeight= {'bold'} fontSize={'smaller'} color={'gray'}>@harsh123</Text>
                    </Container>
                 </HStack>  
                <Card.Description marginTop = {'1rem'}>
                         This is the card body. Lorem ipsum dolor sit amet, consectetur
                         adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
                        Curabitur nec odio vel dui euismod fermentum.
                        This is the card body. Lorem ipsum dolor sit amet, consectetur
                         adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
                        Curabitur nec odio vel dui euismod fermentum.
                        This is the card body. Lorem ipsum dolor sit amet, consectetur
                         adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
                        Curabitur nec odio vel dui euismod fermentum.
                </Card.Description>
                </Card.Body>
                <Separator>
                    <Card.Footer justifyContent="flex-end">
                    </Card.Footer>
                </Separator>

            </Card.Root>
        
        </VStack>
        
        
        
    

        </>
    )



}
import { Container, Text, Box, HStack, Image, Center, Blockquote, Editable, IconButton, Group, Button, Separator, Grid, For, Card } from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import { useState, useEffect } from "react"

import { EmptyState, VStack } from "@chakra-ui/react"
import { RiStickyNoteAddLine } from "react-icons/ri";



const Profile = () => {

    const [bio, setbio] = useState("");

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
            <Navbar2 />
            <Container marginY='3' w={{ base: '76rem', sm: '77rem', md: '80rem', lg: 'auto' }}>
                <Text>
                    Profile details has been shown here.
                </Text>
                <HStack padding={"5"} >
                    <Box padding={"20"} borderWidth="1px" rounded={"lg"} boxSize={"sm"}>
                        <Text textAlign={"center"}>
                            {user.name}
                        </Text>
                        <Center>
                            <Image
                                src="https://media.istockphoto.com/vectors/user-vector-id1138452882?k=20&m=1138452882&s=170667a&w=0&h=VPcCtAjIcXjS88hse2EL6bD_YLOYzh2V8fDdNCfOiB4="
                                boxSize="150px"
                                borderRadius="full"
                                fit="cover"
                                alt="Naruto Uzumaki"
                            />

                        </Center>

                    </Box>
                    <Box padding={"5"} borderWidth="2px" rounded={"lg"} boxSize={"sm"} width={"65%"} maxWidth="100%" >
                        <Blockquote.Root >
                            <Blockquote.Content overflow={"hidden"}>
                                <Editable.Root value={bio}
                                    onValueChange={(e) => setbio(e.value)}
                                    placeholder="Your Bio (Click to add)" size={"xl"} >
                                    <Editable.Preview width="xl" />
                                    <Editable.Input width={"xl"} />
                                    <Editable.Control >
                                        <Editable.EditTrigger asChild>
                                            <IconButton variant="ghost" size="xs">
                                                <LuPencilLine />
                                            </IconButton>
                                        </Editable.EditTrigger>
                                        <Editable.CancelTrigger asChild>
                                            <IconButton variant="outline" size="xs">
                                                <LuX />
                                            </IconButton>
                                        </Editable.CancelTrigger>
                                        <Editable.SubmitTrigger asChild>
                                            <IconButton variant="outline" size="xs">
                                                <LuCheck />
                                            </IconButton>
                                        </Editable.SubmitTrigger>
                                    </Editable.Control>

                                </Editable.Root>
                            </Blockquote.Content>
                            <Blockquote.Caption>
                                — <cite>{user.name}</cite>
                            </Blockquote.Caption>
                        </Blockquote.Root>


                        <HStack gap="20" padding={"10"}>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                0 <br /> Posts
                            </Text>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                0 <br /> Following
                            </Text>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                0 <br /> Followers
                            </Text>

                        </HStack>

                        <Group marginLeft={"5"} grow>
                            <Button variant={"outline"} rounded={"lg"} >
                                Edit Profile
                            </Button>
                            <Button variant={"outline"} rounded={"lg"} >
                                Share Profile
                            </Button>
                        </Group>
                    </Box>

                </HStack>



                <Box textAlign="center" maxW="100%">

                    ALL Posts
                    <Separator marginBottom={"5"} />
                    <Center>
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator>
                                    <RiStickyNoteAddLine />
                                </EmptyState.Indicator>
                                <VStack textAlign="center">
                                    <EmptyState.Title>No Post Yet</EmptyState.Title>
                                    <EmptyState.Description>
                                        Start posting and expand your camp.
                                    </EmptyState.Description>
                                </VStack>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    </Center>

                </Box>
            </Container >


        </>
    );
}

export default Profile;

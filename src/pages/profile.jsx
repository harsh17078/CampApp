import { Container, Text, Box, HStack, Image, Center, Blockquote, Editable, IconButton } from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import { useState } from "react"





const Profile = () => {

    const [bio, setbio] = useState("Datteybao");




    return (
        <>
            <Navbar2 />
            <Container>
                <Text>
                    Profile details has been shown here.
                </Text>
                <HStack padding={"5"} >
                    <Box padding={"20"} borderWidth="1px" rounded={"lg"} boxSize={"sm"}>
                        <Text textAlign={"center"}>
                            Uzumaki Naruto
                        </Text>
                        <Center>
                            <Image
                                src="https://bit.ly/naruto-sage"
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
                                    placeholder="Your Bio" size={"xl"} >
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
                                — <cite>Uzumaki Naruto</cite>
                            </Blockquote.Caption>
                        </Blockquote.Root>


                        <HStack gap="20" padding={"10"}>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                5 <br /> Posts
                            </Text>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                13 <br /> Following
                            </Text>
                            <Text textStyle={"lg"} fontWeight={"bolder"}>
                                30 <br /> Followers
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



            </Container >

            <Container textAlign="center">
                ALL Posts
                <Separator  marginBottom={"5"}/>

                <Grid templateColumns="repeat(3, 1fr)" gap="6">

           
                <For each={["One", "Two", "Three","4","5","6","7"]}>
                    {(item, index) =>

                        <Card.Root width={"sm"} key={index}>
                            <Card.Body>
                                <Card.Header>
                                    12/12/2024
                                </Card.Header>
                                <Card.Description>
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur veniam ullam, harum reiciendis, consequatur adipisci quaerat sequi explicabo amet, assumenda magnam facere est inventore excepturi cumque suscipit veritatis beatae corrupti.
                                </Card.Description>
                            </Card.Body>
                        </Card.Root>
                    }
                </For >
                     </Grid>
            </Container>

        </>
    );
}

export default Profile;

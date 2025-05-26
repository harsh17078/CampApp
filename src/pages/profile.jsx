import { Container, Text, Box, HStack, Image, Center, Blockquote, Editable, IconButton } from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
const Profile = () => {
    return (
        <>
            <Navbar2 />
            <Container>
                <Text>
                    <h5>
                        Profile
                    </h5>
                    View all profile detials here
                    <HStack padding={"10"} >
                        <Box padding={"10"} borderWidth="1px" rounded={"lg"} boxSize={"sm"}>
                            <Text textAlign={"center"}>
                                Uzumaki Naruto
                            </Text>
                            <Center>

                                <Image
                                    src="https://bit.ly/naruto-sage"
                                    boxSize="250px"
                                    borderRadius="full"
                                    fit="cover"
                                    alt="Naruto Uzumaki"
                                />
                            </Center>
                        </Box>
                        <Box padding={"10"} borderWidth="1px" rounded={"lg"} boxSize={"sm"} width={"65%"}>
                            <Blockquote.Root>
                                <Blockquote.Content cite="Uzumaki Naruto">
                                    If anyone thinks he is something when he is nothing, he deceives
                                    himself. Each one should test his own actions. Then he can take pride in
                                    himself, without comparing himself to anyone else.
                                </Blockquote.Content>
                                <Blockquote.Caption>
                                    — <cite>Uzumaki Naruto</cite>
                                </Blockquote.Caption>
                            </Blockquote.Root>
                            <Editable.Root defaultValue="Click to edit">
                                <Editable.Preview />
                                <Editable.Input />
                                <Editable.Control>
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
                        </Box>

                    </HStack>
                </Text>

            </Container >
        </>
    );
}

export default Profile;

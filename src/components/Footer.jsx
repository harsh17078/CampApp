import {Container, Stack,Text,HStack} from "@chakra-ui/react"
import Scope from "../assets/scope.svg?react";
import { FaRegCopyright } from "react-icons/fa6";
const Footer = () => {
    return (
        <>
            <Container as="footer" bg="blackAlpha.100">
                <Stack gap="2" align={"center"}>
                    <Scope height="30" width="30" />
                    <Text>Find Your Tribe, Share Your Vibe – Join Camp!</Text>
                    <HStack>
                        <FaRegCopyright />
                        Camp Inc. All rights reserved.

                    </HStack>

                </Stack>
            </Container>
        </>
    );
}

export default Footer;

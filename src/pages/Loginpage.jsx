import { Button, Tabs, Card, Container, Text, Stack, Input, Separator, Box, Link, Group ,Image} from "@chakra-ui/react"
import { PasswordInput } from "../components/ui/password-input"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Grid, GridItem } from "@chakra-ui/react"



function Loginpage() {

    return (
        <>
          

            
            <Container mt='8'  >
                <Text textAlign="center">
                    Let's Camp Together
                </Text>
                <Card.Root variant={"elevated"} flexDirection="row" overflow="hidden" gap="4" size={"lg"}  >
                    <Image
                        objectFit="cover"
                        src="../src/assets/pexels-josh-hild-1270765-2422265.jpg"
                        alt="Caffe Latte"
                        w={[100,200,500]}
                        height={["auto","auto",550]}
                    />
                    <Box overflow="hidden">
                    <Card.Title >
                        <Text textAlign="center"> 
                            WELCOME TO CAMP
                        </Text>
                    </Card.Title>
                    <Card.Body>
                        <Tabs.Root defaultValue={"Tab1"}>
                            <Tabs.List>
                                <Tabs.Trigger value='Tab1'>
                                    <Text>Login</Text>
                                </Tabs.Trigger>
                                <Tabs.Trigger value='Tab2'>
                                    <Text>Signup</Text>
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value='Tab1'>
                                <Box boxAlign="center" textAlign={"center"} overflow="hidden">
                                    <Input type='email' placeholder='Username/Email' mb="5"/>
                                    <PasswordInput placeholder='Password'  />
                                    <Button mt="5" colorPalette="gray" variant="outline">Login</Button>
                                </Box>
                                <Text textAlign="center" mt="4">or <br/>
                                    Continue with
                                </Text>
                                <Separator mt='5'/>
                                <Group grow mt='3'>
                                <Button variant='outline'><FcGoogle /></Button>
                                <Button variant="outline"><FaApple /></Button>
                                </Group>
                            </Tabs.Content>
                            <Tabs.Content value='Tab2'>
                                <Box boxAlign="center" textAlign={"center"} overflow="hidden" maxBlockSize="lg" >
                                    <Input type='email' placeholder='Email address' mb="5"  />
                                    <Input type='tel' placeholder='Phone no.' mb="5" />
                                    <PasswordInput placeholder='Set Password'  />
                                    <Button mt="5" colorPalette="gray" variant="outline">Create Account</Button>
                                    <Separator mt='5' mb="3"/>
                                    
                                </Box>
                            </Tabs.Content>
                        </Tabs.Root>
                    </Card.Body>
                    <Card.Footer>
                        <Text>By creating the account you will accept the platform "<Link href="..">Terms and Conditions</Link>" for using it.</Text>
                    </Card.Footer>
                    </Box>
                </Card.Root>
            </Container>

        </>
    )
}

export default Loginpage;
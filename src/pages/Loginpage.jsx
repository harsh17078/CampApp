import { Button, Tabs, Card, Container, Text, Stack, Input, Separator, Box, Link, Group ,Image} from "@chakra-ui/react"
import { PasswordInput } from "../components/ui/password-input"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import NavFirst from "../components/NavFirst";
import Footer from "../components/Footer";




function Loginpage() {

    return (
        <>
          

            <NavFirst/>

                <Card.Root variant={"elevated"} flexDirection="row" overflow="hidden" gap="4" size={"lg"}  m="2"  >
                    <Image
                        objectFit="cover"
                        src="../src/assets/portrait/pexels-josh-hild-1270765-2422265.jpg"
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
                                    <Button mt="5" colorPalette="gray" rounded={"md"} variant="outline" onClick={()=>{console.log("Login")}}>Login</Button>
                                </Box>
                                <Separator mt='5'/>
                                <Text textAlign="center" mt="4">or <br/>
                                    Continue with
                                </Text>
                                <Group grow mt='3'>
                                <Button variant='outline' onClick={()=>{console.log("Google")}}><FcGoogle /></Button>
                                <Button variant="outline" onClick={()=>{console.log("Apple")}}><FaApple /></Button>
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
            <Footer/>        

        </>
    )
}

export default Loginpage;
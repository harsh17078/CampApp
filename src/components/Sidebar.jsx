import react from 'react';
import { Box, Drawer, VStack, Button, IconButton, Text } from "@chakra-ui/react";
import { GoHome } from "react-icons/go";
import { MdDynamicFeed } from "react-icons/md";
import { MdEmojiPeople } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

import color from "../assets/color.json";
import Lottie from "lottie-react"


export default function Sidebar() {



	return (
		<>

			<Box display={{ base: "none", md: "block", lg: "block" }}
				position="fixed"
				left="0"
				top="10"
				height="100vh"
				p={4}
				zIndex="1000"
				w={{ md: "20%", lg: "25%" }}

			>


				<VStack spacing={4} p={4} bg="gray.100" height="100vh" >
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}><GoHome />Home</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}><MdDynamicFeed />Feed</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}><MdEmojiPeople />People</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}><FaPeopleGroup />Group</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}><IoMdSettings />Settings</Button>
					<Box position={"fixed"} bottom={"0"} maxWidth={"70%"} overflow={"hidden"} p="5" pb="0">
						<Lottie animationData={color} loop={true}
							style={{
								width: "100%", height: "auto", transform: "rotate(180deg)"
							}}
						/>
					</Box>
				</VStack>

			</Box>


		</>



	)

}
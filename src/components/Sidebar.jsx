import react from 'react';
import { Box, Drawer, VStack, Button, IconButton, Text,Menu, Portal ,  } from "@chakra-ui/react";
import { GoHome } from "react-icons/go";
import { MdDynamicFeed } from "react-icons/md";
import { MdEmojiPeople } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

import color from "../assets/color.json";
import Lottie from "lottie-react"


export default function Sidebar(props) {
	// const [myStyle , setMyStyle] = useState(
	// 	{
	// 	backgroundColor : '#f4f4f5' ,
	// 	color: 'black',
	// 	}
	// ) 
	// // const [btnStyle , setBtnStyle] = useState(
	// // 	{
	// // 	backgroundColor : 'white' ,
	// // 	color: 'black',
	// // 	}
	// // ) 
	// const [btntext , setBtnText] = useState("Dark");
	// const toggleStyle = ()=>{
	// 	if(myStyle.backgroundColor === '#f4f4f5'){
	// 		setMyStyle(
	// 			{
	// 				backgroundColor : 'grey',
	// 				color : 'white',
					
	// 			}
	// 		)
		
	// 		setBtnText("Light");
	// 	}
	// 	else{
	// 		setMyStyle(
	// 			{
	// 				backgroundColor : '#f4f4f5',
	// 				color : 'black',
					
	// 			}
	// 		)
	// 		 setBtnText("Dark");
	// 	}
	// 	console.log("onlcick is trigeered");
	// }
	// const togglebtnStyle = ()=>{
	// 	if(btnStyle.backgroundColor === 'white'){
			
	// 		setBtnStyle(
	// 			{
	// 			backgroundColor : '#80878d',
	// 				color : 'white',	
	// 			}
	// 		)
			
	// 	}
	// 	else{
	// 		setBtnStyle(
	// 			{
	// 			backgroundColor : 'white',
	// 				color : 'black',	
	// 			}
	// 		)
			
	// 	}
	// }
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
				style = {props.myStyle}
			>


				<VStack spacing={4} p={4} bg="gray.100" height="100vh" style = {props.myStyle}>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"} style = {props.myStyle}><GoHome />Home</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}  style = {props.myStyle}><MdDynamicFeed />Feed</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}  style = {props.myStyle}><MdEmojiPeople />People</Button>
					<Button variant={"surface"} rounded={"2xl"} width={"100%"}  style = {props.myStyle}><FaPeopleGroup />Group</Button>
						<Menu.Root>
								<Menu.Trigger asChild>
									<Button variant={"surface"} rounded={"2xl"} width={"100%"} style = {props.myStyle}><IoMdSettings />Settings</Button>
										</Menu.Trigger>
										<Portal>
									<Menu.Positioner>
									<Menu.Content rounded={"2xl"} width={"100%"}>
										
										<Menu.Item rounded={"2xl"} width={"100%"} value="mode"   onClick = {props.toggleStyle}>
											 {props.btntext}Mode
											</Menu.Item>
										<Menu.Item
										rounded={"2xl"} width={"100%"}
										value="delete"
										color="fg.error"
										_hover={{ bg: "bg.error", color: "fg.error" }}
										>
										Logout..
										</Menu.Item>
									</Menu.Content>
									</Menu.Positioner>
								</Portal>
								</Menu.Root>

					{/* <Button variant={"surface"} rounded={"2xl"} width={"100%"}><IoMdSettings />Settings</Button> */}


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
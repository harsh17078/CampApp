import react from 'react';
import {Box , Drawer , VStack , Button , IconButton} from "@chakra-ui/react";
import { Separator, Stack } from "@chakra-ui/react"

export default function Sidebar(){
	return(
         <>
	      <Box 
		     as="section" 
		     w="72"
               bg="#cddbe6"
               color="white"
               h="100vh"
               p={1}
               position="fixed"
			shadow = "md"
			borderRadius={"md"}
               display={{ base: 'none', md: 'block' }}
		    >
		    
		   <VStack>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}> Home</Button>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}> Feed</Button>
			<Button w= "100%" variant={'ghost'} borderRadius={"md"}>Chats</Button>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}>Videos</Button>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}>group</Button>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}>Bookmarks</Button>
			<Button w= "100%"  variant={'ghost'} borderRadius={"md"}>Questions?</Button>
			<Button w= "50%"  h= "35px" margin={3} borderRadius={"md"} variant={'outline'}>Show More</Button>
		
			</VStack> 
			<Stack >			
				<Separator variant = {"solid"} size = "lg" colorPalette = {"teal"}/>

			</Stack>
		    

		 </Box>
	    
	    
	    </>



	)          

}
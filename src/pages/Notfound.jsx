import { Center } from "@chakra-ui/react";
import notfound from "../assets/notfound.json";
import Lottie from  "lottie-react"
import Navbar2 from "../components/Navbar2";


export default function Notfound(){
    return(
        <>
        <Navbar2/>
        <Center>

        <Lottie animationData={notfound} loop={true}
        style={{ width: "300px", height: "300px", marginTop:"12%"
        }}
        />
        </Center>
            
              
        </>
    )
}
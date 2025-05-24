import { Center } from "@chakra-ui/react";
import notfound from "../assets/notfound.json";
import Lottie from  "lottie-react"


export default function Notfound(){
    return(
        <>
        <Center>

        <Lottie animationData={notfound} loop={true}
        style={{ width: "300px", height: "300px", marginTop:"12%"
        }}
        />
        </Center>
            
              
        </>
    )
}
import react from 'react';
import { IoIosSearch } from "react-icons/io";
import { PiSketchLogoFill } from "react-icons/pi";
import { AiFillInstagram } from "react-icons/ai";
import { FaBell } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { Link } from "@chakra-ui/react"
import { Avatar, AvatarGroup, HStack ,defineStyle} from "@chakra-ui/react"


export default function Navbar(props){
    const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
})
    
    return(
        <>
        
    <nav className="navbar  navbar-expand-lg  d-flex" style = {{backgroundColor : "#92aec9" , height : "60px"}}>
        <div className="container-fluid my-2 " > 
            <div className="container-x " style = {{display : "flex" ,justifyContent : "space-between", left: "10px",fontSize: "40px", }}>
               <AiFillInstagram /> 
            </div>

            
            <h3 className="navbar-brand mx-1 my-1" >{props.title}</h3>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
           
            <form className=" container  d-flex justify-content-center col-md-6 col-lg-4" style = { {position : "relative" , width : "550px"} } role="search">
                 <span
                        className="position-absolute"
                            style={{
                                top: "50%",
                                left: "20px",
                                transform: "translateY(-50%)",
                                color: "#6c757d",
                                fontSize: "1.3rem",
                                zIndex : "2"
                            }}
                        >
                            <IoIosSearch />
                        </span>
                    
                <input className="form-control input-group rounded-pill ps-5 input-group rounded shadow-sm"  type="search" placeholder="Search for friend,post or video" aria-label="Search"/>
               
                <button className="btn btn-outline rounded-pill" style = { {position : "absolute",top: "50%",  right: "10px" ,  transform: "translateY(-50%)", border: "none",fontSize: "1.2rem" , color:" #0d6efd" , cursor: "PointerEvent",hoverColor:"  #084298"} } type="submit">
                     <i className="bi bi-search"></i> Search
                </button>
            </form>
            </div>
            <div className="container-x d-flex " style = {{display : "flex" ,marginRight: "5vh",marginTop: "10px",}}>
             <h6 > Home</h6> 
            </div>
            <div className="container-x d-flex" style = {{display : "flex" ,marginRight: "1vh",marginTop: "10px" }}>
             <h6> Timeline</h6> 
            </div>

            <div className="container-x mx-3" style = {{display : "flex" ,fontSize: "25px", }}>
                <FaUserFriends />
            </div>
            <div className="container-x " style = {{display : "flex" , left: "10px",fontSize: "25px", }}>
                <RiMessage2Fill />
            </div>
        <div className="container-x mx-3" style = {{display : "flex" , left: "10px",fontSize: "25px", }}>
            <FaBell />
        </div>
        <HStack>
            <AvatarGroup>
            <Avatar.Root  css = {ringCss} size = "lg" colorPalette="pink">
                <Avatar.Fallback name = "Harsh"/>
                <Avatar.Image src = "C:\Users\ACER\OneDrive\Pictures\img.jpg"/>
            </Avatar.Root>
        </AvatarGroup>
        </HStack>
        
       
</nav>
</>
    )

}

import Navbar2 from "../components/Navbar2"
import Sidebar from "../components/Sidebar"
import CardBody2 from "../components/Card2"
import axios from 'axios';
import {useState , useEffect} from 'react'
import HeaderCard from '../components/HeaderCard';
import {Box} from "@chakra-ui/react";


function Homepage() {
    const [posts, setPosts]   = useState(null);
        async function getPosts(){
                axios.get('https://dummyjson.com/posts')
                .then((res) =>{
                    setPosts(() => res.data.posts);
                });
            // .catch{(er) => console.log(er)};
        }
        

useEffect( ()=>{
    getPosts();
 },[]);


useEffect(()=>{
    console.log(posts)
},[posts]);

    return (
        <>
            <Navbar2 title="CAmpAPP" />            
                <Sidebar />
                < HeaderCard/>
                <Box ml={{md:"20"}}>

                {
                    posts?.map((post , key) => (
                        <CardBody2 post = {post} key = {key}/>
                    ))
                }
                </Box>
           
        </>
    );
}
export default Homepage
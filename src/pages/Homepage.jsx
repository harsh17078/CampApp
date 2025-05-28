import Navbar2 from "../components/Navbar2"
import Sidebar from "../components/Sidebar"
import CardBody2 from "../components/Card2"
import axios from 'axios';
import { useState, useEffect } from 'react'
import HeaderCard from '../components/HeaderCard';
import { Box } from "@chakra-ui/react";


function Homepage() {
    const [myStyle, setMyStyle] = useState(
        {
            backgroundColor: '#f4f4f5',
            color: 'black',
        }
    )
    // const [btnStyle , setBtnStyle] = useState(
    // 	{
    // 	backgroundColor : 'white' ,
    // 	color: 'black',
    // 	}
    // ) 
    const [btntext, setBtnText] = useState("Dark");
    const toggleStyle = () => {
        if (myStyle.backgroundColor === '#f4f4f5') {
            setMyStyle(
                {
                    backgroundColor: 'grey',
                    color: 'white',

                }
            )

            setBtnText("Light");
        }
        else {
            setMyStyle(
                {
                    backgroundColor: '#f4f4f5',
                    color: 'black',

                }
            )
            setBtnText("Dark");
        }
        console.log("onlcick is trigeered");
    }
    const [loading, setloading] = useState(true);

    const [posts, setPosts] = useState(null);
    async function getPosts() {
        axios.get('https://dummyjson.com/posts')
            .then((res) => {
                setPosts(() => res.data.posts);
                setloading(false);
            });
        // .catch{(er) => console.log(er)};
    }


    useEffect(() => {
        getPosts();
    }, []);


    return (

        <>

            <Navbar2 title="CAmpAPP" myStyle={myStyle} btntext={btntext} />
            <Sidebar myStyle={myStyle} toggleStyle={toggleStyle} btntext={btntext} />
            < HeaderCard myStyle={myStyle} btntext={btntext} />
            <Box ml={{ md: "20" ,lg:"30" }} >

                {
                    loading ? (
                        <>
                            <CardBody2 loading={true} />
                            <CardBody2 loading={true} />
                        </>
                    )
                        : (
                            posts?.map((post, key) => (
                                <CardBody2 post={post} key={key} />
                            )
                        ))}
                
            </Box>

        </>
    );
}
export default Homepage;
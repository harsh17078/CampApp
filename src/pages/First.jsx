import { Button } from "@chakra-ui/react"
import { useNavigate } from "react-router";
import NavFirst from "../components/NavFirst";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import Footer from "../components/Footer";


export default function First() {

    const navigate = useNavigate();

    return (
        <>

            <NavFirst/>
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade custom-carousel rounded" data-bs-ride="carousel" >
                <div className="carousel-inner">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>

                </div>
                    <div className="carousel-item active">
                        <img src="../src/assets/landscape/pexels-mhmd-sedky-1725307-3286807.jpg" className="d-block w-100" alt="..." />
                        <div className="carousel-caption">

                            <h4>Where Connections Spark and Stories Unfold!</h4>

                            <p>Camp is a place where people form bonds and share their life experiences. "Spark" suggests excitement and fresh ideas, while "stories unfold" evokes a sense of community and personal expression.</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="../src/assets/landscape/pexels-mattdvphotography-2526025.jpg" className="d-block w-100" alt="..." />
                        <div className="carousel-caption">

                            <h4>Your Digital Campfire for Real Conversations!</h4>
                            <p>A campfire symbolizes gathering, storytelling, and friendship—just like how your platform fosters meaningful interactions online.</p>

                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="../src/assets/landscape/pexels-olly-3776978.jpg" className="d-block w-100" alt="..." />
                        <div className="carousel-caption ">
                            <h4>Gather. Share. Grow. Welcome to Camp!</h4>
                            <p>Users can gather (meet people), share (their thoughts, content, and ideas), and grow (personally and socially). Simple, impactful, and memorable!</p>
                            <Button variant={"surface"} colorPalette={"white"} rounded={"2xl"} onClick={() => { navigate("/login/") }}>Let's Go<FaPersonWalkingArrowRight /></Button>
                        </div>
                    </div>

                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <Footer/>


        </>
    )
}


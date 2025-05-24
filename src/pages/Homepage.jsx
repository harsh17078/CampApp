import Navbar2 from "../components/Navbar2"
import Sidebar from "../components/Sidebar"
import CardBody from "../components/Card"
import { HStack } from "@chakra-ui/react"

function Homepage() {
    return (
        <>
            <Navbar2 title="CAmpAPP" />
                <Sidebar />

            <CardBody/>
           
           
        </>
    )
}
export default Homepage
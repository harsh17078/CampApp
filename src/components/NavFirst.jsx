import { Text } from "@chakra-ui/react";
import Scope from "../assets/scope.svg?react";

const NavFirst = () => {
    return (
        <>
            <nav className="navbar bg-body-tertiary ">
                <div className="container-fluid d-flex justify-content-center mt-3">
                    <a className="navbar-brand d-flex gap-2" href="#">
                        <Scope height="30" width="30" />
                        <Text >Camp</Text>
                    </a>
                </div>
            </nav>
        </>
    );
}

export default NavFirst;

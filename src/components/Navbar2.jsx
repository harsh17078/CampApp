import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaBell, FaUserFriends } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";

import { Avatar, AvatarGroup, HStack, defineStyle,Button } from "@chakra-ui/react";
import Profile from '../pages/profile';
import { useNavigate,Link } from 'react-router';

export default function Navbar2(props) {
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });


const navigate = useNavigate();
const  handleProfile = ()=> {
         navigate('/profile');
    }


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary d-flex fixed-top px-2">
        <div className="container-fluid w-100 px-2">

          {/* Brand Section */}
          <div className="d-flex align-items-center">
            <AiFillInstagram size={30} className="me-2" />
            <h3 className="navbar-brand mb-0">{props.title}</h3>
          </div>

          {/* Toggler for small screens */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Search bar for md and up */}
          <div className="d-none mx-auto d-md-block " style={{  width : "500px" }}>
            <form
              className="position-relative w-100"
              role="search"
            >
              <span
                className="position-absolute"
                style={{
                  top: "50%",
                  left: "20px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "1.3rem",
                  zIndex: "2"
                }}
              >
                <IoIosSearch />
              </span>

              <input
                className="form-control rounded-pill ps-5 shadow-sm border-0"
                type="search"
                placeholder="Search for friend, post or video"
                aria-label="Search"
                style={{ height: "45px" }}
              />

              <button
                className="btn rounded-pill"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                  background: "none",
                  color: "#0d6efd",
                  border: "none"
                }}
                type="submit"
              >
                Search
              </button>
            </form>
          </div>

          {/* Navbar Right Items */}
          <div className="collapse navbar-collapse mt-2 mt-lg-0" id="navbarTogglerDemo03">
            <ul className="navbar-nav ms-auto align-items-center gap-3">

              {/* Small screen: show search icon in toggler */}
              <li className="nav-item d-md-none">
                 <form
              className="position-relative w-100"
              role="search">
              <span
                className="position-absolute"
                style={{
                  top: "50%",
                  left: "20px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "1.3rem",
                  zIndex: "2"
                }}
              >
                <IoIosSearch />
              </span>
                 <input
                className="form-control rounded-pill ps-5 my-0 shadow-sm border-0"
                type="search"
                placeholder="Search for friend and posts"
                aria-label="Search"
                style={{ height: "45px" ,width : "400px",  maxWidth : "400px"}}
              />
              <button
                className="btn rounded-pill"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                  background: "none",
                  color: "#0d6efd",
                  border: "none"
                }}
                type="submit"
              >
                Search
              </button>
               </form>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/home/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Timeline</Link>
              </li>

              <li className="nav-item fs-5"><FaUserFriends /></li>
              <li className="nav-item fs-5"><RiMessage2Fill /></li>
              <li className="nav-item fs-5"><FaBell /></li>
              <li className="nav-item">
                <HStack>
                  <Button variant = 'ghost' onClick = {handleProfile}>
                  <AvatarGroup>
                    <Avatar.Root css={ringCss} size="lg" colorPalette="pink">
                      <Avatar.Fallback name="Harsh" />
                    </Avatar.Root>
                  </AvatarGroup>
                  </Button>
                </HStack>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

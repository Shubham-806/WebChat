import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { SetAvatarRoute } from "../utils/APIRoutes";


export default function SetAvatar() {console.log("SetAvatar component is rendering...");
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    console.log("Checking user in localStorage:", user);

    if (!user) {
        console.log("No user found, redirecting to login");
        navigate("/login");
    } else if (user.isAvatarImageSet) {
        console.log("Avatar is already set, redirecting to home");
        navigate("/");
    } else {
        console.log("User exists but avatar is not set, staying on Set Avatar page");
    }
}, []);


  const setProfilePicture = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));

    if (selectedAvatar === null) {
        toast.error("Please select an avatar first!", toastOptions);
        return;
    }

    try {
        const { data } = await axios.put(`${SetAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
        });

        if (data.status) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("chat-app-user", JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again.");
        }
    } catch (error) {
        console.error("Error setting avatar:", error);
        toast.error("Failed to set avatar. Try again later.");
    }
};


  useEffect(() => {
    const fetchAvatars = async () => {
      try {
          const avatarRequests = Array.from({ length: 4 }, () => {
              const randomId = Math.round(Math.random() * 1000);
              return `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomId}`;
          });
  
          setAvatars(avatarRequests);
          setIsLoading(false);
      } catch (error) {
          console.error("Error fetching avatars:", error);
          toast.error("Failed to load avatars!", toastOptions);
          setIsLoading(false);
      }
  };
  
    
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
              >
                <img
                  src={avatar}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}
const Container=styled.div`
display:flex;
width:100vw;
height:100vh;
color :white;
flex-direction:column;
gap:1rem;
background-color:#131324;
justify-content:center;
align-items:center;
.avatars{
border:0.4rem solid transparent;
padding:0.4rem;
border-radius:5rem;
width:70%;
display:flex;
justify-content:center;
align-items:center;
.avatar{
border:0.4rem solid transparent;
padding:0.4rem;
display:flex;
justify-content:center;
align-items:center;
border-radius:10rem;
transition:0.5s ease-in-out ;
}
}
.avatars img{
height:10rem;
}
.avatars .selected{
border:0.4rem solid white;
}
.submit-btn{
padding:1rem;
text-transform:uppercase;
border-radius:0.4rem;
&:hover{
background-color:grey;
transition:0.5sec ease-in-out;
}
}
 `;


 
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg"; // Fixed path
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { allUsersRoutes } from '../utils/APIRoutes';

export default function Contacts({ contacts, changeChat }) {
   
        const [contactList, setContactList] = useState([]);
        const [currentUserName, setCurrentUserName] = useState(null);
        const [currentUserImage, setCurrentUserImage] = useState(null);
        const [currentSelected, setCurrentSelected] = useState(null);
        const navigate = useNavigate();
    useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users..."); // ✅ Check if useEffect runs
      
      const storedUser = JSON.parse(localStorage.getItem("chat-app-user"));
      if (!storedUser) {
        console.log("No stored user found!"); // ✅ Check if user exists
        return navigate("/login");
      }
      setCurrentUserImage(storedUser.avatarImage); // ✅ Set currentUserImage
      setCurrentUserName(storedUser.username); // ✅ Set currentUserName
      try {
        console.log("Stored User ID:", storedUser._id); // ✅ Debug ID
        const { data } = await axios.get(`${allUsersRoutes}/${storedUser._id}`);
        
        console.log("API Response:", data); // ✅ Log API response
  
        const guestUsers = Array.from({ length: 3 }, (_, index) => ({
          _id: `guest-${index}`,
          username: `Guest ${index + 1}`,
          avatarImage: `https://api.dicebear.com/7.x/adventurer/svg?seed=Guest${index + 1}`,
        }));
  
        const combinedContacts = [storedUser, ...data, ...guestUsers];
        console.log("Final Contacts List:", combinedContacts); // ✅ Final list
        setContactList(combinedContacts);
      } catch (error) {
        console.error("Error fetching users:", error); // ✅ Catch errors
      }
    };
  
    fetchUsers();
  }, []);

  
  
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const storedUser = JSON.parse(localStorage.getItem("chat-app-user"));
//       if (!storedUser) return navigate("/login");
  
//       // Fetch other users (API call)
//       const { data } = await axios.get(`${allUsersRoutes}/${storedUser._id}`);
      
//       // Generate some guest users dynamically
//       const guestUsers = Array.from({ length: 3 }, (_, index) => ({
//         _id: `guest-${index}`,
//         username: `Guest ${index + 1}`,
//         avatarImage: `https://api.dicebear.com/7.x/adventurer/svg?seed=Guest${index + 1}`,
//       }));
  
//       // Combine real users and guests
//       setContactList([storedUser, ...data, ...guestUsers]);
//     };
  
//     fetchUsers();
//   }, []);
  
 

  console.log("Rendering Contacts component");
  console.log("Logo Path:", Logo);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  

  return (
    <>
      {contactList.length > 0 && (

        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Snappy</h3>
          </div>
          <div className="contacts">
          <div className="contacts">
  {contactList.map((contact, index) => (
    <div
      key={contact._id}
      className={`contact ${index === currentSelected ? "selected" : ""}`}
      onClick={() => changeCurrentChat(index, contact)}
    >
      <div className="avatar">
        <img src={contact.avatarImage || "https://ui-avatars.com/api/?name=Guest"} alt="avatar" />
      </div>
      <div className="username">
        <h3>{contact.username || "Unknown"}</h3>
      </div>
    </div>
  ))}
</div>

  
</div>

          <div className="current-user">
            <div className="avatar">
              <img src={currentUserImage} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    overflow: auto;
    gap: 0.8rem;
    width:95%;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

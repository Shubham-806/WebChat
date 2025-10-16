import React, { useState, useEffect} from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate =useNavigate()
    const [values, setValues] = useState({
        username: "",
        
        password: "",
        });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const handleValidation = () => {
        const { password,  username, } = values;
        if (password.length ==="") {
            toast.error("incorrect username or password",
                toastOptions);
            return false;
        }
        else if (username.length=== "") {
          toast.error("incorrect username or password",
                toastOptions);
            return false;
        }
        
        return true;
    };
    

    useEffect(()=>{
      if(localStorage.getItem("chat-app-user"))
        {
          navigate("/");
        }
      },[]);
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            console.log("in validation", loginRoute);
            const { password, username } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
    
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            } else if (data.status === true) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
    
                // ✅ Check if avatar is set before redirecting
                if (!data.user.isAvatarImageSet) {  
                    navigate("/setAvatar");  // Redirect to set avatar page
                } else {
                    navigate("/chat");  // If avatar is set, go to chat
                }
            }
        }
    };
    
    
    
    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="" />
                        <h1>Snappy</h1>
                    </div>
                    <input type="text" placeholder='Username' name='username' onChange={(e) => handleChange(e)} />
                    

                    <input type="password" placeholder='Password' name='password' onChange={(e) => handleChange(e)} />

                    
                    <button type='submit'>Login</button>
                    <span>Not have an account ?<Link to="/register">Register</Link></span>

                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );

}
const FormContainer = styled.div`
display:flex;
width:100vw;
height:100vh;
flex-direction:column;
gap:1rem;
background-color:#131324;
justify-content:center;
align-items:center;
.brand{
display:flex;
justify-content:center;
align-item:center;
gap:1rem;


 img{
  width: 5rem;
}
  h1{
color:white;
}
}
form{
display:flex;
flex-direction:column;
gap:2rem;
background-color:#00000076;
padding: 3rem 5rem;
border-radius:2rem;
input{
background-color:transparent;
padding:1rem;
border:0.1rem solid #4e0eff;
font-size:1rem;
color:white;
&:focus{
outline:none;
border:0.1rem solid #4e0eff;
}
}
button{
padding:1rem;
text-transform:uppercase;
border-radius:0.4rem;
&:hover{
background-color:grey;

transition:0.5sec ease-in-out;
}
}
span{
color:white;
a{
text-decoration:none;}}
}


  
`;
export default Login;

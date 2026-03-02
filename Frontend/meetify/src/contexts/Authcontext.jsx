 import axios, { HttpStatusCode } from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  

  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });

      if (response.status === HttpStatusCode.Created) {
        setUserData(response.data.user);
        navigate("/");
        return response.data.message;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };
  const handleLogin = async (username , password)=>{
    try{
let request = await client.post("/login", {
  username,
  password
})
if(request.status === HttpStatusCode.Ok){
  localStorage.setItem("token", request.data.token);
  navigate("/");
}
    }catch(error){
throw error;
    }
  }


  const getHistoryOfUser = async()=>{
    try{
      
      let request = await client.get("/get_all_activity", {
        params: { token: localStorage.getItem("token") }
      });
      return request.data;
      
    }catch(error){
      throw error;
    }
  }

const addToHistory = async(meetingCode)=>{
  try{
    let request = await client.post("/add_to_activity", {
      token: localStorage.getItem("token"),
      meeting_code: meetingCode
    });
    return request.status;
  }catch(error){
    throw error;
  }
}



  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToHistory
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};

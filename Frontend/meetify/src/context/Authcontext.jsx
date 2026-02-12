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

  const data = {
    userData,
    setUserData,
    handleRegister,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};

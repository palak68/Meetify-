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

  // ✅ REGISTER
  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === HttpStatusCode.Ok) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        navigate("/home");
      }

      return "Registration Successful";
    } catch (error) {
      throw error;
    }
  };

  // ✅ LOGIN
  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === HttpStatusCode.Ok) {
        localStorage.setItem("token", request.data.token);
        navigate("/home");
      }
    } catch (error) {
      throw error;
    }
  };

  // ✅ GET HISTORY
  const getHistoryOfUser = async () => {
    try {
      const request = await client.get("/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return request.data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ ADD TO HISTORY
  const addToHistory = async (meetingCode) => {
    try {
      const request = await client.post(
        "/history",
        { meeting_code: meetingCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return request.status;
    } catch (error) {
      throw error;
    }
  };

  // ✅ IMPORTANT: data object MUST be AFTER functions
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToHistory,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    }, [navigate]);

    if (loading) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
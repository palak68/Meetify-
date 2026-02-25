import { useNavigate } from "react-router-dom";
const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const isAuthenticated = localStorage.getItem("token") ? true : false;
        
        useEffect(() => {if (!isAuthenticated) {
            router("/auth");
            return null;
        }}, []);
        return <WrappedComponent {...props} />;
    };
    return AuthComponent;
  };
  export default withAuth;
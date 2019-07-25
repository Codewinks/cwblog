import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import Typography from '@material-ui/core/Typography';


const Login = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Login
      </Typography>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}
    </>
  );
};

export default Login;
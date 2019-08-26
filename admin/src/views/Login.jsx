import React from "react";
import { useAuth0 } from "../context/Auth0";
import Typography from '@material-ui/core/Typography';


const Login = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Login
      </Typography>
      {!isAuthenticated && (
        <>
          <button
            onClick={() =>
              loginWithRedirect({})
            }
          >
            Log in
          </button>
          <button onClick={() => logout()}>Log out</button>
        </>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </>
  );
};

export default Login;
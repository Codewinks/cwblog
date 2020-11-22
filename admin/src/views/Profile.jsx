import React from "react";
import { useAuth0 } from "../context/Auth0";

const Profile = () => {
    const { loading, currentUser } = useAuth0();

    if (loading || !currentUser) {
        return "Loading...";
    }

    return (
        <>
            <img src={currentUser.picture} alt="Profile" width="100" />

            <h2>{currentUser.name}</h2>
            <p>{currentUser.email}</p>
            <code>{JSON.stringify(currentUser, null, 2)}</code>
        </>
    );
};

export default Profile;
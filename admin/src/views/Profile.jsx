import React from "react";
import { useAuth0 } from "../context/Auth0";

const Profile = () => {
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return "Loading...";
    }

    return (
        <>
            <img src={user.picture} alt="Profile" width="100" />

            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <code>{JSON.stringify(user, null, 2)}</code>
        </>
    );
};

export default Profile;
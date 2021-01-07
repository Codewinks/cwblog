import React, {useContext, useState} from 'react';
import {useApp} from './App'
import {useAuth0} from "./Auth0";
import {RoleProvider} from "./Role";

export const UserContext = React.createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({history, children}) => {
    const {showAlert} = useApp();
    const {request} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(null);

    const emptyUser = {
        id: null,
        uid: null,
        first_name: null,
        last_name: null,
        nickname: null,
        email: null,
        avatar: null,
        timezone: null,
        role_id: null,
        email_verified: false,
        created_at: false,
        updated_at: false,
        role: [],
    }

    const [user, setUser] = useState({...emptyUser});

    const handleUpdate = (key, value, callback) => {
        setUser({
            ...user,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback)
    }

    const handleUser = (data) => setUser({...emptyUser, ...data})
    const newUser = () => setUser({...emptyUser})

    const listUsers = async () => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/users/`)
            setUsers(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const getUser = async (userId) => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/users/${userId}`)
            handleUser(data);
        } catch (error) {
            history.push(`/users`)
            if (error.status_code === 404) {
                showAlert('error', `Unable to find user with the ID: ${userId}`)
            } else {
                showAlert('error', error.message)
            }
        } finally {
            setLoading(false);
        }
    }

    const saveUser = async () => {
        setLoading(true);
        try {
            console.log('saveUser', user)
            const data = await request(user.id ? 'put' : 'user', `/v1/users/${user.id ? user.id : ''}`, {...user})
            console.log('after saveUser', data)
            handleUser(data);

            if (!user.id) {
                history.push(`/users/${data.id}`)
            }

            showAlert('success', `User successfully ${user.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async (id) => {
        setLoading(true);
        try {
            await request('delete', `/v1/users/${user.id ? user.id : id}`)

            setUser({...emptyUser});
            await listUsers()
            history.push(`/users`)
            showAlert('success', `User successfully deleted.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <RoleProvider>
            <UserContext.Provider value={{
                user,
                users,
                loading,
                handleUpdate,
                handleChange,
                setLoading,
                listUsers,
                newUser,
                getUser,
                saveUser,
                setUser,
                deleteUser,
            }}>
                {children}
            </UserContext.Provider>
        </RoleProvider>
    );
}
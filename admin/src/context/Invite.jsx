import React, { useState, useContext } from 'react';
import { useApp } from './App'
import { useAuth0 } from './Auth0';
import {ALERT_ERROR, ALERT_SUCCESS} from "./App";
import {RoleProvider, ROLE_GUEST} from "./Role";

export const InviteContext = React.createContext()
export const useInvite = () => useContext(InviteContext)
export const InviteProvider = ({ history, children }) => {
    const { showAlert } = useApp()
    const { request } = useAuth0()
    const [loading, setLoading] = useState(true)
    const [invites, setInvites] = useState(null)
    
    const emptyInvite = {
        id: null,
        email: null,
        role_id: ROLE_GUEST,
        expires_at: null,
    }

    const [invite, setInvite] = useState(emptyInvite)

    const handleUpdate = (key, value, callback) => {
        setInvite({
            ...invite,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback)
    }

    const newInvite = () => {
        setInvite(emptyInvite)
    }

    const listInvites = async () => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/invites/`)
            setInvites(data)
            return data
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const getInvite = async (inviteId) => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/invites/${inviteId}`)
            setInvite(data)
            return data;
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const saveInvite = async () => {
        setLoading(true)
        try {
            console.log(invite);
            await request(invite.id ? 'put' : 'post', `/v1/invites/${invite.id ? invite.id : ''}`, {...invite} )
            
            setInvite(emptyInvite)
            history.push(`/invites`)
            await listInvites()
            
            showAlert(ALERT_SUCCESS, `Invite ${invite.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteInvite = async (id) => {
        setLoading(true)
        try {
            await request('delete', `/v1/invites/${invite.id ? invite.id : id}`)

            setInvite(emptyInvite)
            await listInvites()
            
            showAlert(ALERT_SUCCESS, `Invite deleted.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <RoleProvider>
            <InviteContext.Provider value={{
                invite,
                invites,
                loading,
                handleUpdate,
                handleChange,
                setLoading,
                listInvites,
                newInvite,
                getInvite,
                saveInvite,
                setInvite,
                deleteInvite,
            }}>
                {children}
            </InviteContext.Provider>
        </RoleProvider>
    )
}
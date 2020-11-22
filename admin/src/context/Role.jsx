import React, { useState, useContext } from 'react';
import { useApp } from './App'
import { useAuth0 } from './Auth0';
import {ALERT_ERROR, ALERT_SUCCESS} from "./App";

export const RoleContext = React.createContext()
export const useRole = () => useContext(RoleContext)
export const ROLE_SUPERADMIN = 1
export const ROLE_ADMIN = 2
export const ROLE_MODERATOR = 3
export const ROLE_EDITOR = 4
export const ROLE_GUEST = 5

export const RoleProvider = ({ history, children }) => {
    const { showAlert } = useApp()
    const { request } = useAuth0()
    const [loading, setLoading] = useState(true)
    const [roles, setRoles] = useState(null)

    const emptyRole = {
        id: null,
        name: null,
        meta: null,
        permissions: null,
    }

    const [role, setRole] = useState(emptyRole)

    const handleUpdate = (key, value, callback) => {
        setRole({
            ...role,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback)
    }

    const newRole = () => {
        setRole(emptyRole)
    }

    const listRoles = async () => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/roles/`)
            setRoles(data)
            return data
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const getRole = async (roleId) => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/roles/${roleId}`)
            setRole(data)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const saveRole = async () => {
        setLoading(true)
        try {
            await request(role.id ? 'put' : 'post', `/v1/roles/${role.id ? role.id : ''}`, {...role} )
            
            setRole(emptyRole)
            history.push(`/roles`)
            await listRoles()
            
            showAlert(ALERT_SUCCESS, `Role ${role.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteRole = async (id) => {
        setLoading(true)
        try {
            await request('delete', `/v1/roles/${role.id ? role.id : id}`)

            setRole(emptyRole)
            await listRoles()
            
            showAlert(ALERT_SUCCESS, `Role deleted.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <RoleContext.Provider value={{
            role,
            roles,
            loading,
            handleUpdate,
            handleChange,
            setLoading,
            listRoles,
            newRole,
            getRole,
            saveRole,
            setRole,
            deleteRole,
        }}>
            {children}
        </RoleContext.Provider>
    )
}
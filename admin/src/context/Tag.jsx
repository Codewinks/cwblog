import React, { useState, useContext } from 'react';
import { useApp } from './App'
import { useAuth0 } from './Auth0';
import {ALERT_ERROR, ALERT_SUCCESS} from "./App";

export const TagContext = React.createContext()
export const useTag = () => useContext(TagContext)
export const TagProvider = ({ history, children }) => {
    const { showAlert } = useApp()
    const { request } = useAuth0()
    const [loading, setLoading] = useState(true)
    const [tags, setTags] = useState(null)
    
    const emptyTag = {
        id: null,
        name: null,
        slug: null,
        description: null,
    }

    const [tag, setTag] = useState(emptyTag)

    const handleUpdate = (key, value, callback) => {
        setTag({
            ...tag,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback)
    }

    const newTag = () => {
        setTag(emptyTag)
    }

    const listTags = async () => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/tags/`)
            setTags(data)
            return data
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const getTag = async (tagId) => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/tags/${tagId}`)
            setTag(data)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const saveTag = async (callback) => {
        setLoading(true)
        try {
            await request(tag.id ? 'put' : 'post', `/v1/tags/${tag.id ? tag.id : ''}`, {...tag} )
            
            setTag(emptyTag)

            if (history)
                history.push(`/tags`)

            await listTags()
            
            showAlert(ALERT_SUCCESS, `Tag ${tag.id ? 'saved' : 'created'}.`, 5000)
            if (callback && typeof callback === "function"){
                callback()
            }
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteTag = async (id) => {
        setLoading(true)
        try {
            await request('delete', `/v1/tags/${tag.id ? tag.id : id}`)

            setTag(emptyTag)
            await listTags()
            
            showAlert(ALERT_SUCCESS, `Tag deleted.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <TagContext.Provider value={{
            tag,
            tags,
            loading,
            handleUpdate,
            handleChange,
            setLoading,
            listTags,
            newTag,
            getTag,
            saveTag,
            setTag,
            deleteTag,
        }}>
            {children}
        </TagContext.Provider>
    )
}
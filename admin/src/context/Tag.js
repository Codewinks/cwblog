import React, { useState, useContext } from 'react';
import { useApp } from './App'
import { useAuth0 } from "../context/Auth0";

export const TagContext = React.createContext();
export const useTag = () => useContext(TagContext);
export const TagProvider = ({ history, children }) => {
    const { showAlert } = useApp();
    const { request } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState(null);
    
    const emptyTag = {
        id: null,
        name: null,
        slug: null,
        description: null,
    }

    const [tag, setTag] = useState(emptyTag);

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
        handleUpdate(key, event.target.value, callback);
    }

    const newTag = () => {
        setTag(emptyTag);
    }

    const listTags = async () => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/tags/`)
            setTags(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const getTag = async (tagId) => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/tags/${tagId}`)
            setTag(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const saveTag = async () => {
        setLoading(true);
        try {
            const data = await request(tag.id ? 'put' : 'tag', `/v1/tags/${tag.id ? tag.id : ''}`, {...tag} )

            if(!tag.id){
                history.push(`/tags/${data.id}`)
            }

            showAlert('success', `Tag ${tag.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const deleteTag = async () => {
        setLoading(true);
        try {
            await request('delete', `/v1/tags/${tag.id}`)

            setTag(null);
            history.push(`/tags`)
            showAlert('success', `Tag successfully deleted.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
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
    );
}
import React, { useState, useContext } from 'react';

export const PostContext = React.createContext();
export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [post, setPost] = useState({
        id: null,
        title: null,
        slug: null,
        status: 'draft',
        visibility: 'public',
        published_at: null,
        user_id: null,
        format: 'post',
    });

    const options = {
        status: [
            { value: 'draft', label: 'Draft', description: '' },
            { value: 'published', label: 'Published', description: '' },
            { value: 'pending', label: 'Pending Review', description: '' }
        ],
        visibility: [
            { value: 'public', label: 'Public', description: 'Visible to everyone.' },
            { value: 'private', label: 'Private', description: 'Only visible to site admins and editors.' },
            { value: 'password', label: 'Password Protected', description: 'Only those with the password can view this post.' }
        ]
    }

    const handleUpdate = (key, value, callback) => {
        setPost({
            ...post,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback);
    }

    return (
        <PostContext.Provider value={{
            post,
            options,
            handleUpdate,
            handleChange,
        }}>
            {children}
        </PostContext.Provider>
    );
}
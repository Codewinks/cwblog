import React, { useState, useContext } from 'react';
import { useApp } from './App'
import { useAuth0 } from "../context/Auth0";

export const PostContext = React.createContext();
export const usePost = () => useContext(PostContext);
export const PostProvider = ({ history, children }) => {
    const { showAlert } = useApp();
    const { request } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState(null);
    
    const emptyPost = {
        id: null,
        title: null,
        slug: null,
        status: 'draft',
        visibility: 'public',
        published_at: null,
        user_id: null,
        format: 'post',
    }

    const [post, setPost] = useState(emptyPost);

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

    const newPost = () => {
        setPost(emptyPost);
    }

    const listPosts = async () => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/posts/`)
            setPosts(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const getPost = async (postId) => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/posts/${postId}`)
            setPost(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const savePost = async () => {
        setLoading(true);
        try {
            const data = await request(post.id ? 'put' : 'post', `/v1/posts/${post.id ? post.id : ''}`, {...post} )

            if(!post.id){
                history.push(`/posts/${data.id}`)
            }

            showAlert('success', `Post ${post.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const deletePost = async () => {
        setLoading(true);
        try {
            await request('delete', `/v1/posts/${post.id}`)

            setPost(null);
            history.push(`/posts`)
            showAlert('success', `Post successfully deleted.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <PostContext.Provider value={{
            post,
            posts,
            loading,
            options,
            handleUpdate,
            handleChange,
            setLoading,
            listPosts,
            newPost,
            getPost,
            savePost,
            setPost,
            deletePost,
        }}>
            {children}
        </PostContext.Provider>
    );
}
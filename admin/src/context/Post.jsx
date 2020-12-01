import React, {useContext, useState} from 'react';
import {useApp} from './App'
import {useAuth0} from "./Auth0";
import {TagProvider} from "./Tag";
import {CategoryProvider} from "./Category";

export const PostContext = React.createContext();
export const usePost = () => useContext(PostContext);
export const PostProvider = ({history, children}) => {
    const {showAlert} = useApp();
    const {request} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState(null);

    const emptyPost = {
        id: null,
        title: null,
        slug: null,
        status: 'draft',
        visibility: 'public',
        user_id: null,
        format: 'post',
        options: {},
        published_at: null,
        updated_at: null,
        created_at: null,
        tags: [],
        categories: [],
    }

    const [post, setPost] = useState({...emptyPost});

    const options = {
        status: [
            {value: 'draft', label: 'Draft', description: ''},
            {value: 'published', label: 'Published', description: ''},
            {value: 'pending', label: 'Pending Review', description: ''}
        ],
        visibility: [
            {value: 'public', label: 'Public', description: 'Visible to everyone.'},
            {value: 'private', label: 'Private', description: 'Only visible to site admins and editors.'},
            {
                value: 'password',
                label: 'Password Protected',
                description: 'Only those with the password can view this post.'
            }
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
        handleUpdate(key, event.target.value, callback)
    }

    const handlePost = (data) => setPost({...emptyPost, ...data})
    const newPost = () => setPost({...emptyPost})

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
            handlePost(data);
        } catch (error) {
            history.push(`/admin/posts`)
            if (error.status_code === 404) {
                showAlert('error', `Unable to find post with the ID: ${postId}`)
            } else {
                showAlert('error', error.message)
            }
        } finally {
            setLoading(false);
        }
    }

    const savePost = async (update) => {
        setLoading(true);
        try {
            console.log('savePOst', {...post, ...update})
            const data = await request(post.id ? 'put' : 'post', `/v1/posts/${post.id ? post.id : ''}`, {...post, ...update})
            console.log('after savePOst', data)
            handlePost(data);

            if (!post.id) {
                history.push(`/admin/posts/${data.id}`)
            }

            showAlert('success', `Post successfully ${post.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            console.error(error)
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const deletePost = async (id) => {
        setLoading(true);
        try {
            await request('delete', `/v1/posts/${post.id ? post.id : id}`)

            setPost({...emptyPost});
            await listPosts()
            history.push(`/admin/posts`)
            showAlert('success', `Post successfully deleted.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <CategoryProvider>
            <TagProvider>
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
            </TagProvider>
        </CategoryProvider>
    );
}
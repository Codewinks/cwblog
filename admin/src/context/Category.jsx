import React, {useContext, useState} from 'react';
import {useApp} from './App'
import {useAuth0} from "./Auth0";

export const CategoryContext = React.createContext();
export const useCategory = () => useContext(CategoryContext);
export const CategoryProvider = ({history, children}) => {
    const {showAlert} = useApp();
    const {request} = useAuth0();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(null);

    const emptyCategory = {
        id: null,
        name: null,
        slug: null,
        description: null,
        parent_id: null,
        depth: 0,
        visibility: 'public',
        sub_categories: [],
    }

    const [category, setCategory] = useState(emptyCategory);

    const options = {
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
        setCategory({
            ...category,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback);
    }

    const newCategory = () => {
        setCategory(emptyCategory);
    }

    const listCategories = async (map = false) => {
        setLoading(true);
        try {
            let data = await request('get', `/v1/categories/`)
            if (map) {
                data = mapCategories(data)
            }
            setCategories(data)
            return data
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    function mapCategories(cats, categoryList = [], depth = 0) {
        if (!cats) {
            return categoryList
        }

        cats.forEach(cat => {
            cat.depth = depth;
            categoryList.push(cat);
            if (cat.sub_categories && cat.sub_categories.length > 0) {
                categoryList = mapCategories(cat.sub_categories, categoryList, depth + 1);
            }
        })

        return categoryList;
    }

    const getCategory = async (categoryId) => {
        setLoading(true);
        try {
            const data = await request('get', `/v1/categories/${categoryId}`)
            setCategory(data);
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const saveCategory = async () => {
        setLoading(true);
        try {
            const data = await request(category.id ? 'put' : 'post', `/v1/categories/${category.id ? category.id : ''}`, {...category})
            setCategory(data);
            history.push(`/categories`)
            await listCategories()

            showAlert('success', `Category successfully ${category.id ? 'saved' : 'created'}.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            await request('delete', `/v1/categories/${category.id ? category.id : id}`)

            setCategory(emptyCategory);
            await listCategories()

            showAlert('success', `Category successfully deleted.`, 5000)
        } catch (error) {
            showAlert('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <CategoryContext.Provider value={{
            category,
            categories,
            loading,
            options,
            handleUpdate,
            handleChange,
            setLoading,
            listCategories,
            newCategory,
            getCategory,
            saveCategory,
            setCategory,
            deleteCategory,
        }}>
            {children}
        </CategoryContext.Provider>
    );
}
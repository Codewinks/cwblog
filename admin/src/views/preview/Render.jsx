import React, {useState, useEffect} from "react";
import NoMatch from "../errors/NoMatch";
import {useAuth0} from "../../context/Auth0";

const Render = ({path}) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const {request} = useAuth0();
    const parts = path.split('/');
    const idx = parts.length-1;
    const slug = parts[idx];

    useEffect(() => {
        getPost(slug);

        // eslint-disable-next-line
    }, [slug]);

    const getPost = async (slug) => {
        setLoading(true);
        try {
            const post = await request('get', `/v1/posts/slug/${slug}`);
            setLoading(false);
            setPost(post);
        }catch(e){
            console.error(e);
        }

        setLoading(false);
    }

    if (loading) {
        return ('Loading...');
    }

    if (!post) {
        return (<NoMatch message="Post not found."/>);
    }

    return (
        <>
            Render {path}
        </>
    );
};

export default Render;
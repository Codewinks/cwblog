import React, {useEffect} from "react";
import NoMatch from "../errors/NoMatch";
import {usePost} from '../../context/Post'
import {useSetting} from "../../context/Setting";

const Render = ({path}) => {
    const {post, loading, getPostBySlug} = usePost();
    const {listSettings} = useSetting();
    const pageSettings = ['html_head_close', 'html_body_close'];
    const parts = path.split('/');
    const idx = parts.length - 1;
    const slug = parts[idx];
    const head = document.head || document.getElementsByTagName('head')[0];
    const body = document.body || document.getElementsByTagName('body')[0];

    useEffect(() => {
        const fetchSettings = async () => {
            return await listSettings(pageSettings);
        }

        fetchSettings().then((settings) => {
            settings.forEach(setting => {
                const values = JSON.parse(setting.value);
                values.forEach((val) => {
                    if (setting.key === 'html_head_close') {
                        const elem = createElementFromHTML(val);
                        head.append(elem);
                    }
                    if (setting.key === 'html_body_close') {
                        const elem = createElementFromHTML(val);
                        body.append(elem);
                    }
                })
            })
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        async function fetchPost() {
            await getPostBySlug(slug)
        }

        fetchPost().then(() => {
            createAndAppendPostStyle();
        });

        // eslint-disable-next-line
    }, [slug]);

    const createElementFromHTML = (htmlString) => {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.firstChild;
    }

    const createAndAppendPostStyle = () => {
        if (post.css) {
            const style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = post.css;
            } else {
                style.appendChild(document.createTextNode(post.css));
            }
            head.append(style);
        }
    }


    if (loading) {
        return ('Loading...');
    }

    if (!post) {
        return (<NoMatch message="Post not found."/>);
    }

    return (
        <>
            <div id="preview" dangerouslySetInnerHTML={{__html: post.html}}/>
        </>
    );
};

export default Render;
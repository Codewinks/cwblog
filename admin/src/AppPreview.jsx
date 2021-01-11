import React from "react";
import {useAuth0} from "./context/Auth0";
import {useRouteMatch} from "react-router-dom";
import Render from "./views/preview/Render";
import {PostProvider} from './context/Post'
import {SettingProvider} from './context/Setting'
import {CategoryProvider} from "./context/Category";
import {TagProvider} from "./context/Tag";


function AppPreview() {
    const {loading, isAuthenticated} = useAuth0();
    const match = useRouteMatch();

    if (loading) {
        return ('Loading...');
    }

    if (!isAuthenticated) {
        window.location = window.location.origin;
        return false;
    }

    const path = window.location.pathname.replace(match.path + '/', '')

    return (
        <SettingProvider>
            <PostProvider>
                <CategoryProvider>
                    <TagProvider>
                        <Render path={path}/>
                    </TagProvider>
                </CategoryProvider>
            </PostProvider>
        </SettingProvider>
    );
}

export default AppPreview;

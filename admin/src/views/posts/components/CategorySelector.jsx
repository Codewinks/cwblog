import React, {useEffect} from "react";
import {usePost} from '../../../context/Post'
import {useCategory} from "../../../context/Category";
import DropdownTree from './DropdownTree';

const CategorySelector = () => {
    const {post, handleUpdate} = usePost();
    const {listCategories} = useCategory();
    const [allCategories, setAllCategories] = React.useState([]);

    useEffect(() => {
        async function loadStuff() {
            setAllCategories(await listCategories(true))
        }

        loadStuff();

    }, [])

    const mapCategoriesToTree = (categories, categoryList = []) => {
        if (!categories || !categories.length) {
            return categoryList;
        }

        categories.forEach(category => {
            let children = {}

            if (category.sub_categories && category.sub_categories.length) {
                children.children = mapCategoriesToTree(category.sub_categories)
            }

            categoryList.push({
                value: category.id,
                label: category.name,
                ...children
            });
        })

        return categoryList;
    }

    return (
        <>
            <DropdownTree
                data={mapCategoriesToTree(allCategories.filter(c => !c.depth))}
                checked={post.categories ? post.categories.map(c => c.id) : []}
                expanded={() => {
                    //TODO: Clean this up.... or figure out a new way to expand selected child categories (ideally force parents to be checked)
                    // This only does 1 level so it doesn't work.
                    const checked = post.categories ? post.categories.map(c => c.id) : [];
                    let expanded = [];
                    allCategories.forEach(cat => {
                        if (checked.includes(cat.id)) {
                            expanded.push(cat.id);
                            if (cat.parent_id) {
                                expanded.push(cat.parent_id);
                            }
                        }
                    })

                    return expanded;
                }}
                onChange={(categories) => handleUpdate('categories', allCategories.filter(c => categories.includes(c.id)))}
                filterBarPlaceholder="Search categories..." placeholder="Choose categories..."
                noRecords="No categories found"/>
        </>
    )
};

export default CategorySelector;
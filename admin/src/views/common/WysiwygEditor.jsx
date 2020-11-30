import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';

// import Header from 'editorjs-header-with-anchor';
import Header from './editorjs/Header';
import Paragraph from 'editorjs-paragraph-with-alignment';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

const useStyles = makeStyles(theme => ({
    editor: {
        '& .ce-block__content, & .ce-toolbar__content': {
            maxWidth: '100%',
        },
        '&.toggle-outline .ce-block .ce-block__content': {
            outline: '1px dashed rgba(170,170,170,0.7)',
        },
        '& .ce-block .ce-block__content': {
            padding: theme.spacing(0, 1),
            outlineOffset: '-2px',
        },
        '& .ce-block:hover .ce-block__content': {
            outline: '1px solid #3b97e3',
        },
        '& .ce-block.ce-block--focused':{
            outline: '3px solid #3b97e3 !important',
            outlineOffset: '-3px',
        }
    },
}));

const WysiwygEditor = ({ postId, toggleOutline, value, onChange }) => {
    const classes = useStyles();
    const [loaded, setLoaded] = useState(null);

    useEffect(() => {
        const ejs = document.querySelector(`#editor .codex-editor`)
        if (ejs)
            ejs.remove();
        // loaded.destroy();

        const editor = new EditorJS({
            holder: 'editor',
            // logLevel: 'ERROR',
            data: value ? JSON.parse(value) : {},
            // data: {},
            onReady: () => {
                try {
                    new Undo({editor});
                    new DragDrop(editor);
                    setLoaded(editor);
                }catch(err){
                    console.error(err);
                }
            },
            onChange: () => {
                triggerOnChange(editor);
            },
            placeholder: 'Start writing your post content here...',
            tools: {
                underline: Underline,
                header: {
                    class: Header,
                    inlineToolbar: ['link']
                },
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                            byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                        }
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    },
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    // shortcut: 'CMD+SHIFT+O',
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                delimiter: Delimiter,
                code: CodeTool,
                raw: RawTool,
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true,
                            coub: true
                        }
                    }
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+M',
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
            }
        });

        // eslint-disable-next-line
    }, [postId])

    const triggerOnChange = (editor) => {
        editor.save().then((savedData) =>{
            if( onChange && typeof onChange === "function"){
                onChange(JSON.stringify(savedData))
            }
            console.log('[DataChanged]', savedData);
        }).catch((error) =>{
            console.log("[EditorJS Error]", error)
        })
    }

    return (
        <div id="editor" className={`${classes.editor} ${toggleOutline ? 'toggle-outline' : null}`}/>
    )
};

export default WysiwygEditor;
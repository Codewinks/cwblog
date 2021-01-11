import React, {useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import grapesjs from 'grapesjs';
import 'grapesjs-preset-webpage';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';
import componentCodeEditor from 'grapesjs-component-code-editor';
import parserPostCSS from 'grapesjs-parser-postcss';
import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css';
import Backbone from 'backbone';
import {useSetting} from "../../context/Setting";

const $ = Backbone.$;

const useStyles = makeStyles(theme => ({
    editor: {
        '& .gjs-cv-canvas, & .gjs-pn-views-container': {
            transition: 'width 250ms ease-in-out'
        },
        '&:not(:hover) .gjs-cv-canvas': {
            width: '100%!important',
        },
        '&:not(:hover) .gjs-pn-views-container': {
            width: '0%!important',
        },
        '& .gjs-pn-views': {
            border: '0'
        },
        '& .row': {
            display: 'flex',
            padding: 0,
            width: 'auto',
        }
    }
}));

const WysiwygEditor = ({setEditor, postId, html, css, handleUpdate}) => {
    const {listSettings} = useSetting();
    const classes = useStyles();
    const pageSettings = ['html_head_close', 'html_body_close'];
    let canvasConfig = {
        styles: [],
        scripts: [],
    };

    useEffect(() => {
        fetchSettings().then(() => {
            buildEditor();
        });

        // eslint-disable-next-line
    }, [postId])

    const fetchSettings = async () => {
        const settings = await listSettings(pageSettings);
        settings.forEach(setting => {
            const values = JSON.parse(setting.value);

            values.forEach((val) => {
                if (val.includes('.css"')) {
                    canvasConfig.styles.push(val.match(/href="([^"]*)/)[1])
                }
                if (val.includes('.js"')) {
                    canvasConfig.scripts.push(val.match(/src="([^"]*)/)[1])
                }
            })
        })
    }

    const buildEditor = () => {
        const editor = grapesjs.init({
            container: '#editor',
            showOffsets: true,
            components: html,
            style: css,
            storageManager: {type: null},
            protectedCss: '',
            plugins: [
                'gjs-preset-webpage',
                componentCodeEditor,
                parserPostCSS,
            ],
            pluginsOpts: {
                'gjs-preset-webpage': {
                    navbarOpts: false,
                },
                'grapesjs-component-code-editor': {
                    /* Test here your options  */
                }
            },
            canvas: canvasConfig
        });

        const pn = editor.Panels
        const panelViews = pn.addPanel({
            id: "views"
        });

        panelViews.get("buttons").add([
            {
                attributes: {
                    title: "Open Code"
                },
                className: "fa fa-file-code-o",
                command: "open-code",
                togglable: true,
                id: "open-code"
            }
        ]);

        const cmdm = editor.Commands
        cmdm.add('edit-code', {
            run: function run(editor, sender) {
                const _this = this;
                sender && sender.set && sender.set('active', 0);
                const config = editor.getConfig();
                const modal = editor.Modal;
                const pfx = config.stylePrefix;
                this.cm = editor.CodeManager || null;

                if (!this.$editors) {
                    const oHtmlEd = this.buildEditor('htmlmixed', 'hopscotch', 'HTML');
                    const oCsslEd = this.buildEditor('css', 'hopscotch', 'CSS');
                    this.htmlEditor = oHtmlEd.el;
                    this.cssEditor = oCsslEd.el;
                    const $editors = $("<div class=\"".concat(pfx, "edit-code-dl\"></div>"));
                    const btnEdit = document.createElement('button');
                    btnEdit.innerHTML = 'Save'
                    btnEdit.className = `${pfx}btn-prim`
                    btnEdit.setAttribute('style', 'margin-top: 10px');
                    btnEdit.onclick = async function () {
                        const html = _this.htmlEditor.editor.getValue()
                        const css = _this.cssEditor.editor.getValue()
                        console.log('save html', html)
                        editor.setComponents(html.trim())
                        editor.setStyle(css)
                        handleUpdate(['html', 'css'], [html.trim(), css.trim()]);
                        modal.close()
                    }

                    $editors.append(oHtmlEd.$el).append(oCsslEd.$el).append(btnEdit);
                    this.$editors = $editors;

                }

                modal.open({
                    title: 'Edit Code',
                    content: this.$editors
                }).getModel().once('change:open', function () {
                    return editor.stopCommand(_this.id);
                });

                this.htmlEditor.setContent(editor.getHtml());
                this.cssEditor.setContent(editor.getCss());
            },
            buildEditor: function buildEditor(codeName, theme, label) {
                const input = document.createElement('textarea');
                !this.codeMirror && (this.codeMirror = this.cm.getViewer('CodeMirror'));
                const el = this.codeMirror.clone().set({
                    label: label,
                    codeName: codeName,
                    theme: theme,
                    input: input,
                    readOnly: 0,
                    lineWrapping: 1,
                    // indentUnit: 3,
                    // indentWithTabs: true
                });
                const $el = new this.cm.EditorView({
                    model: el,
                    config: this.cm.getConfig()
                }).render().$el;
                el.init(input);
                return {
                    el: el,
                    $el: $el
                };
            }
        })

        pn.addButton('options',
            [
                {
                    id: 'edit',
                    className: 'fa fa-edit',
                    command: 'edit-code',
                    attributes: {
                        title: 'Edit Code'
                    }
                }
            ]
        )

        setEditor(editor);
    }

    return (
        <div id="editor" className={classes.editor}/>
    )
};

export default WysiwygEditor;
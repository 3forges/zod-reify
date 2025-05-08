import type { JSX } from 'preact';
// import { FaTiktok } from "react-icons/fa";
// import { IconContext } from "react-icons"
// import { useRef, useEffect } from "preact/hooks"
// import React from "preact/compat";
import './MarkDown.module.css';
// import { useState } from "preact/hooks";

/**
 * pnpm add -D markdown-it highlight.js
 */
import markdownit from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org
/**
 * pnpm add -D react-html-parser @types/react-html-parser htmlparser2 @types/htmlparser2
 */
import ReactHtmlParser/*, { processNodes, convertNodeToElement, htmlparser2 }*/ from 'react-html-parser';
import { convertNodeToElement } from 'react-html-parser';
import type { StringifyOptions } from 'querystring';
// import { DomElement } from "htmlparser2";
export interface DomElement {
    attribs?: { [s: string]: string } | undefined;
    children?: DomElement[] | undefined;
    data?: any;
    name?: string | undefined;
    next?: DomElement | undefined;
    parent?: DomElement | undefined;
    prev?: DomElement | undefined;
    type?: string | undefined;
}

export interface Machin {
    attribs: { [s: string]: string };
}
const unMachin: Machin = {
    attribs: {
        class: ""
    }
}
/*
// commonmark mode
const md = markdownit('commonmark')

// default mode
const md = markdownit()

// enable everything
const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
})

*/

export interface MarkDownItConfiguration {
    // Enable HTML tags in source
    html: boolean,

    // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    xhtmlOut: boolean,

    // Convert '\n' in paragraphs into <br>
    breaks: boolean,

    // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    langPrefix: string,// 'language-',

    // Autoconvert URL-like text to links
    linkify: boolean,

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
    typographer: boolean,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: string,// '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    // highlight: function (/*str, lang*/) { return ''; }
    highlight: Function
}

// full options list (defaults)
const defaultConfig: MarkDownItConfiguration = {
    // Enable HTML tags in source
    html: true,

    // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    xhtmlOut: false,

    // Convert '\n' in paragraphs into <br>
    breaks: false,

    // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    langPrefix: 'language-',

    // Autoconvert URL-like text to links
    linkify: true,

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    // highlight: function (/*str, lang*/) { return ''; }
    highlight: function (str: any, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
}

interface MarkDownProps {
    /**
     * The markdown-it configuration see {@MarkDownItConfiguration }
     */
    config?: MarkDownItConfiguration,
    /**
     * the markdown to render
     */
    markdown: string
    /**
     * css classes to apply to code HTML tags
     */
    codeCssClass?: string
    preCssClass?: string
    paragraphCssClass?: string
    h1CssClass?: string
    h2CssClass?: string
    h3CssClass?: string
    h4CssClass?: string
    ulCssClass?: string
}


export default function MarkDown({ 
    config = defaultConfig,
    markdown,
    codeCssClass = `flex-1 text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6`,
    preCssClass = `block whitespace-pre overflow-x-scroll text-nowrap flex-1 text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6`,
    paragraphCssClass = `p-1 mb-3 text-lg text-gray-500 md:text-xl dark:text-gray-400`,
    h1CssClass = `mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white`,
    h2CssClass = `p-1 mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white`,
    h3CssClass = `p-1 mb-2 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white`,
    h4CssClass = `p-1 mb-2 text-l font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white`,
    ulCssClass = `list-disc list-inside p-2 mb-2`
}: MarkDownProps): JSX.Element {
    const preprocessChildrenNodes = (node: DomElement) => {
        let nodes = node.children || []
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 'tag' && nodes[i].name === 'code') {
                nodes[i].attribs = {
                    class: `${nodes[i]?.attribs?.class} text-wrap` // text-nowrap
                }
            }
            console.log(` preprocessChildrenNodes - nodes[${i}]:`, JSON.stringify(nodes[i].data, null, 2))
            console.log(` preprocessChildrenNodes - nodes[${i}].type:`, JSON.stringify(nodes[i].type, null, 2))
            console.log(` preprocessChildrenNodes - nodes[${i}].name:`, JSON.stringify(nodes[i].name, null, 2))
            console.log(` preprocessChildrenNodes - nodes[${i}].attribs:`, JSON.stringify(nodes[i].attribs, null, 2))
        }
    }
    const myNodesPreprocessor = (nodes: DomElement[]) => {
        // do not render any <span> tags
        /*
        if (node.type === 'tag' && node.name === 'span') {
          return null;
        }
        */
        /**
         * For all <code> tags, we add tailwindcss classes
         */
        /*
        nodes.map((node: DomElement) => {
            if (node.type === 'tag' && node.name === 'code') {
                node.attribs = {
                    class: `${codeCssClass}`
                }
            }
        })
        */
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 'tag' && nodes[i].name === 'code') {
                nodes[i].attribs = {
                    class: `${codeCssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'pre') {
                nodes[i].attribs = {
                    class: `${preCssClass}`
                }
                preprocessChildrenNodes(nodes[i])
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'p') {
                nodes[i].attribs = {
                    class: `${paragraphCssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'h1') {
                nodes[i].attribs = {
                    class: `${h1CssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'h2') {
                nodes[i].attribs = {
                    class: `${h2CssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'h3') {
                nodes[i].attribs = {
                    class: `${h3CssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'h4') {
                nodes[i].attribs = {
                    class: `${h4CssClass}`
                }
            }
            if (nodes[i].type === 'tag' && nodes[i].name === 'ul') {
                nodes[i].attribs = {
                    class: `${ulCssClass}`
                }
            }
            
            console.log(` nodes[${i}]:`, JSON.stringify(nodes[i].data, null, 2))
            console.log(` nodes[${i}].type:`, JSON.stringify(nodes[i].type, null, 2))
            console.log(` nodes[${i}].name:`, JSON.stringify(nodes[i].name, null, 2))
            console.log(` nodes[${i}].attribs:`, JSON.stringify(nodes[i].attribs, null, 2))
            
            
            
        }
        //console.log(` nodes:`, JSON.stringify(nodes, null, 2))
        return nodes;
    }
    const md = markdownit(config);
    let renderedHtml = md.render(markdown);
    return (
        <>
            {
            ReactHtmlParser(renderedHtml, {
                preprocessNodes: myNodesPreprocessor
            })
            }
        </>
    )
}

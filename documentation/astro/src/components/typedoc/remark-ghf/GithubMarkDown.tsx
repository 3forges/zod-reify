import type { JSX } from 'preact';
// import { FaTiktok } from "react-icons/fa";
// import { IconContext } from "react-icons"
// import { useRef, useEffect } from "preact/hooks"
// import React from "preact/compat";
import './GithubMarkDown.module.css';
// import { useState } from "preact/hooks";
import ReactHtmlParser/*, { processNodes, convertNodeToElement, htmlparser2 }*/ from 'react-html-parser';

import {remark} from 'remark'
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'preact/hooks';
/*
const input = `| Alpha | Bravo |
| - | - |
| 中文 | Charlie |
| 👩‍❤️‍👩 | Delta |`

const file = await remark().use(remarkGfm).process(input)

console.log(String(file))
*/
import showdown  from 'showdown';

interface GithubMarkDownProps {
    /**
     * the markdown to render
     */
    markdown: string
    
}
export default function GithubMarkDown ({ 
    markdown,
}: GithubMarkDownProps): JSX.Element {
    const [renderedMarkdown, setRenderedMarkdown] = useState<string>('')
    const [renderMarkdownError, setrenderMarkdownError] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        async function renderMarkdown() {
          try {
            const resultingMarkdown = await remark().use(remarkGfm).process(markdown)
            const converter = new showdown.Converter()
            converter.setFlavor('github');
            let text      = '# hello, markdown!';
            const resultingHTML = converter.makeHtml(String(resultingMarkdown));
            setRenderedMarkdown(String(resultingHTML))
            console.log(` >>>> resultingHTML : ${String(resultingHTML)}`)
            setLoading(false);
          } catch (error) {
            setrenderMarkdownError(error);
            setLoading(false);
          }
        }
        renderMarkdown();
      }, []);
    
    return (
        <>
        <div class="text-wrap">
            {loading?<span>`Loading...`</span>:ReactHtmlParser(renderedMarkdown == undefined?'':renderedMarkdown)}
        </div>
        </>
    )
};

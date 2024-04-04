import React from 'react'
import DOMpurify from 'dompurify'
import MarkdownIt from 'markdown-it'
import MarkdownItColor from 'markdown-it-color'
// '{red}(sample text)' will render as red text with inline style for color

const markdownParser = new MarkdownIt().use(MarkdownItColor, {
  inline: true,
})

interface MarkdownToHtmlProps {
  markdownString: string | null | undefined
}

const MarkdownToHtml: StorefrontFunctionComponent<MarkdownToHtmlProps> = ({
  markdownString,
}) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html:
          markdownString && DOMpurify.isSupported // using a package to sanitize html
            ? DOMpurify.sanitize(markdownParser.render(markdownString))
            : '',
      }}
    />
  )
}

export default MarkdownToHtml

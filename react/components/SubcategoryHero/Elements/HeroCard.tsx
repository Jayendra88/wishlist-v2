import DOMpurify from 'dompurify'
import MarkdownIt from 'markdown-it'
// '{red}(sample text)' will render as red text with inline style for color
import MarkdownItColor from 'markdown-it-color'
import React from 'react'

import SkeletonLoader from '../../SkeletonLoader/SkeletonLoader'
import { fallbackImgUrl } from '../../helpers'
import styles from './styles.css'

const markdownParser = new MarkdownIt().use(MarkdownItColor, {
  inline: true,
})

type HeroCardProps = {
  category: {
    heroImageHash: string | undefined
    categoryImageHash: string | undefined
    categoryId: string | undefined
    categoryTitle: string | undefined
    heroText?: string
    // used in category hero preview only
    heroImgPreview?: string | undefined
    previewText?: string
  }
}

const HeroCard: StorefrontFunctionComponent<HeroCardProps> = ({
  category: {
    heroImageHash,
    // if categoryImageHash is not present, use categoryImageHash instead
    categoryImageHash,
    heroImgPreview,
    categoryId,
    categoryTitle,
    heroText,
    previewText,
  },
}) => {
  const isImageShown =
    !!heroImgPreview?.length ||
    !!heroImageHash?.length ||
    !!categoryImageHash?.length

  return (
    <div className={styles['hero-container-background']}>
      <div className={styles['hero-container']}>
        {isImageShown ? (
          <img
            className={styles['hero-image']}
            src={
              heroImgPreview ??
              (heroImageHash?.length
                ? `/_v/mdCategories/heroImg/${heroImageHash}/${categoryId}`
                : categoryImageHash?.length
                ? `/_v/mdCategories/img/${categoryImageHash}/${categoryId}`
                : '')
            }
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              event.currentTarget.src = fallbackImgUrl
            }}
            alt={`${categoryTitle}`}
          />
        ) : (
          <SkeletonLoader />
        )}

        <div className={styles['hero-text']}>
          <h1>{categoryTitle}</h1>
          <div
            dangerouslySetInnerHTML={{
              // using html from the masterdata
              __html:
                (heroText || previewText) && DOMpurify.isSupported // using a package to sanitize html
                  ? previewText // if preview image is provided, we are in a preview mode
                    ? DOMpurify.sanitize(markdownParser.render(previewText))
                    : heroText
                    ? DOMpurify.sanitize(heroText)
                    : ''
                  : '',
            }}
          />
        </div>
        <div className={styles['background-color']} />
      </div>
    </div>
  )
}

export default HeroCard

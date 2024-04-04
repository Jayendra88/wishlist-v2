import React from 'react'
import { Link } from 'vtex.render-runtime'

import { fallbackImgUrl } from '../helpers'
import styles from './styles.css'
import type { HeroData } from './LandingPageCardWrapper'

interface LandingPageCardProps {
  heroData: HeroData
  index: number
  href: string
}

const LandingPageCard: React.FC<LandingPageCardProps> = ({
  heroData,
  index,
  href,
}) => {
  // Check if heroData has imgUrlHash and categoryId
  const hasValidImageData = heroData?.imgUrlHash && heroData?.categoryId

  return (
    <div
      className={
        index < 3
          ? styles['landing-page-card']
          : styles['landing-page-card__slim']
      }
    >
      <Link to={`${href}`}>
        {hasValidImageData ? (
          <img
            src={`/_v/mdCategories/img/${heroData.imgUrlHash}/${heroData.categoryId}`}
            loading="lazy"
            alt={heroData?.categoryName}
            height="100%"
            width="100%"
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              event.currentTarget.src = fallbackImgUrl
            }}
          />
        ) : (
          <img
            src={fallbackImgUrl}
            loading="lazy"
            alt={heroData?.categoryName}
            height="100%"
            width="100%"
          />
        )}
        <h5>{heroData?.categoryName}</h5>
      </Link>
    </div>
  )
}

export default LandingPageCard

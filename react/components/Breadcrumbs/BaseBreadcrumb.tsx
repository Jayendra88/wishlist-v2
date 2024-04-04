// !! A copy of https://github.com/vtex-apps/breadcrumb/blob/master/react/components/BaseBreadcrumb.tsx component, with minor changes, keeping it as close as possible to the original in case vtex changes it in the future

import React, { useMemo } from 'react'
import { Link } from 'vtex.render-runtime'
import { applyModifiers } from 'vtex.css-handles'
import { IconCaret, IconHome } from 'vtex.store-icons'
import { useDevice } from 'vtex.device-detector'

import { makeLink } from '../helpers'
import styles from './Breadcrumbs.css'

export interface NavigationItem {
  name: string
  href: string
}

export interface Props {
  term?: string
  /** Shape [ '/Department' ,'/Department/Category'] */
  categories: string[]
  categoryTree?: NavigationItem[]
  breadcrumb?: NavigationItem[]
  showOnMobile?: boolean
  homeIconSize?: number
  caretIconSize?: number
}
const getCategoriesList = (categories: string[]): NavigationItem[] => {
  if (categories.length === 0) {
    return []
  }

  const categoriesSorted = categories
    .slice()
    .sort((a, b) => a.length - b.length)

  if (categoriesSorted.length === 0) {
    return []
  }

  return categoriesSorted?.map((category) => {
    const categoryStripped = category
      .replace(/^\//, '')
      .replace(/\/$/, '')
      // replace " / " with "-" to avoid splitting a category that has a / in its name
      .replace(' / ', '-')

    const currentCategories = categoryStripped.split('/')

    const [categoryKey] = currentCategories.reverse()
    const href = `/${makeLink(categoryStripped)}`

    return {
      href,
      name: categoryKey,
    }
  })
}

/**
 * Breadcrumb Component.
 */
const Breadcrumb: React.FC<Props> = ({
  term,
  categories,
  categoryTree,
  breadcrumb,
  showOnMobile = true,
  homeIconSize = 26,
  caretIconSize = 8,
}) => {
  // const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()
  const navigationList = useMemo(() => {
    if (breadcrumb) {
      return breadcrumb
    }

    if (categoryTree) {
      return categoryTree
    }

    if (categories) {
      return getCategoriesList(categories)
    }

    return []

    // return thingsToShow
  }, [breadcrumb, categories, categoryTree])

  const linkBaseClasses = 'dib pv1 link ph2 c-muted-2 hover-c-link'
  const shouldBeRendered = (showOnMobile && isMobile) || !isMobile

  if (!shouldBeRendered) {
    return null
  }

  const mobileNavigationList =
    // if there is only one category, show it
    navigationList?.length && navigationList?.length === 1
      ? navigationList
      : navigationList?.length
      ? [navigationList[navigationList.length - 2]] // if there's more than one category show the parent category
      : []

  return (
    <div className={`${styles.container} pv3`}>
      {/* If on mobile page, show only parent category and the item name */}
      <Link
        className={`${styles.link} ${styles.homeLink} ${linkBaseClasses} v-mid`}
        page="store.home"
      >
        <IconHome size={homeIconSize} />
      </Link>
      {(isMobile ? mobileNavigationList : navigationList)?.map(
        ({ name, href }, i) => {
          let decodedName = ''

          try {
            decodedName = decodeURIComponent(name)
          } catch {
            decodedName = name
          }

          return (
            <span
              key={`navigation-item-${i}`}
              className={`${applyModifiers(
                styles.arrow,
                (i + 1).toString()
              )} ph2 c-muted-2`}
            >
              <IconCaret orientation="right" size={caretIconSize} />
              <Link
                className={`${applyModifiers(
                  styles.link,
                  (i + 1).toString()
                )} ${linkBaseClasses}`}
                to={href}
                // See https://github.com/vtex-apps/breadcrumb/pull/66 for the reasoning behind this
                waitToPrefetch={1200}
              >
                {decodedName}
              </Link>
            </span>
          )
        }
      )}
      {term && (
        <>
          <span className={`${styles.arrow} ${styles.termArrow} ph2 c-muted-2`}>
            <IconCaret orientation="right" size={caretIconSize} />
          </span>
          <span className={`${styles.term} ph2 c-on-base`}>{term}</span>
        </>
      )}
    </div>
  )
}

Breadcrumb.defaultProps = {
  categories: [],
}

export default Breadcrumb

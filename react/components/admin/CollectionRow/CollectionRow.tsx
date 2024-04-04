import React from 'react'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { Image } from 'vtex.store-image'
import { Link } from 'vtex.render-runtime'

import styles from './collectionRow.css'

interface Collection {
  imageUrl: string
  title: string
  url: string
}

interface CollectionsRowProps {
  collections: Collection[]
}

const CollectionsRow: StorefrontFunctionComponent<CollectionsRowProps> = ({
  collections = [],
  children,
}) => {
  const { list } = useListContext() || []

  const collectionsRowContent = collections.map(
    (collection: Collection, index: number) => {
      return (
        <Link key={index} to={collection.url}>
          <div className={`${styles.collectionCardContainer}`}>
            <Image src={collection.imageUrl} alt={collection.title} />
            <p className={`${styles.collectionCardText}`}>{collection.title}</p>
          </div>
        </Link>
      )
    }
  )

  const newListContextValue = list.concat(collectionsRowContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

CollectionsRow.schema = {
  title: 'Collections',
  type: 'object',
  properties: {
    collections: {
      title: 'Collections List',
      type: 'array',
      items: {
        title: 'Collection',
        type: 'object',
        properties: {
          imageUrl: {
            title: 'Image URL',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          title: {
            title: 'Title',
            type: 'string',
          },
          url: {
            title: 'Link URL',
            type: 'string',
          },
        },
      },
    },
  },
}

export default CollectionsRow

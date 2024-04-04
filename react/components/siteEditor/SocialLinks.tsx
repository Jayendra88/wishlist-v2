import React from 'react'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { Image } from 'vtex.store-image'

interface SocialLink {
  url: string
  title: string
  imageUrl: string
}
const SocialLinks: StorefrontFunctionComponent = ({
  socialLinks,
  children,
}) => {
  const { list } = useListContext() || []

  const socialLinksContent = socialLinks.map(
    (link: SocialLink, index: number) => (
      <a key={index} href={link.url} target="_blank" rel="noreferrer">
        <Image src={link.imageUrl} alt={link.title} />
      </a>
    )
  )

  const newListContextValue = list.concat(socialLinksContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

SocialLinks.schema = {
  title: 'Social Links',
  type: 'object',
}

export default SocialLinks

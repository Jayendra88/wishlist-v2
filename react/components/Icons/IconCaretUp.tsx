import React from 'react'
import { Icon } from 'vtex.store-icons'

interface IconProps {
  /** Icon size, aspect ratio 1:1 */
  size?: number
  /** Icon viewBox. Default 0, 0, 16, 16 */
  viewBox?: string
  /** Define if will be used a active or muted className */
  isActive?: boolean
  /** Active color class */
  activeClassName?: string
  /** Muted color class */
  mutedClassName?: string
}

const IconCaretUp: StorefrontFunctionComponent<IconProps> = ({
  size,
  viewBox,
  isActive,
  activeClassName,
  mutedClassName,
}) => {
  return (
    <Icon
      id="icon-caret-up"
      size={size}
      viewBox={viewBox}
      isActive={isActive}
      activeClassName={activeClassName}
      mutedClassName={mutedClassName}
    />
  )
}

export default IconCaretUp

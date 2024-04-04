import React, { useState } from 'react'

import styles from '../../styles.css'

interface ToolTipProps {
  text: string
  message: string
  shouldToolTip: boolean
}

const Tooltip: StorefrontFunctionComponent<ToolTipProps> = ({
  text,
  message,
  shouldToolTip = false,
}) => {
  const [shouldShowToolTip, setShowToolTip] = useState(shouldToolTip)
  const showToolTip = () => {
    setShowToolTip(true)
  }

  const hideToolTip = () => {
    setShowToolTip(false)
  }

  return (
    <div className={styles.toolTipContainer}>
      <div
        onMouseEnter={() => showToolTip()}
        onMouseLeave={() => hideToolTip()}
      >
        {text}
      </div>
      {shouldShowToolTip ? (
        <div className={styles.toolTipMessage}>{message}</div>
      ) : null}
    </div>
  )
}

Tooltip.schema = {
  title: 'editor.tool-tip.title',
  description: 'editor.tool-tip.description',
  type: 'object',
  properties: {
    text: {
      title: 'Text',
      description: 'Text for the delivery',
      type: 'string',
      default: 'Details',
    },
    message: {
      title: 'Tool Tip',
      description: 'Text for the delivery tool tip',
      type: 'string',
      default: 'Lorem Ipsum',
    },
  },
}

export default Tooltip

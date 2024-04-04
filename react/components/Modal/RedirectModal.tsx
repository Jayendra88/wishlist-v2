import React, { useState } from 'react'
import { Modal, Button } from 'vtex.styleguide'

import styles from './styles.css'

interface RedirectModalProps {
  onClose: () => void
  title?: string
  tertiaryText?: string
  primaryText: string
  redirectHref: string
}

const RedirectModal: StorefrontFunctionComponent<RedirectModalProps> = ({
  onClose,
  title,
  tertiaryText,
  primaryText,
  redirectHref,
  children,
}) => {
  const [isModalOpen, setModalStatus] = useState(true)

  return (
    <div>
      {
        <Modal
          title={title}
          isOpen={isModalOpen}
          onClose={() => {
            onClose()
          }}
          bottomBar={
            <div className="nowrap">
              <span className="mr4">
                <Button
                  variation="tertiary"
                  onClick={() => {
                    setModalStatus(false)
                    onClose()
                  }}
                >
                  {tertiaryText}
                </Button>
              </span>
              <span>
                <Button
                  variation="primary"
                  href={redirectHref}
                  onClick={() => {
                    setModalStatus(false)
                  }}
                >
                  {primaryText}
                </Button>
              </span>
            </div>
          }
        >
          <div className={styles.warningMessage}>{children}</div>
        </Modal>
      }
    </div>
  )
}

export default RedirectModal

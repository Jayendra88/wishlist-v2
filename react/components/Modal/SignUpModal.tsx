import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'vtex.styleguide'

import useLoginStatus from '../../hooks/useLoginStatus'

const SignUpModal: StorefrontFunctionComponent = () => {
  const [isModalOpen, setModalStatus] = useState(false)
  const { status, loading } = useLoginStatus()

  useEffect(() => {
    if (status === 'corporate' || status === 'guest') return
    if (!loading && status === 'loggedIn') {
      setModalStatus(true)
    }
  }, [loading])

  return (
    <div>
      <Modal
        title="Are you part of an organization that already has an account with us?"
        isOpen={isModalOpen}
        onClose={() => {
          setModalStatus(false)
        }}
        bottomBar={
          <div className="nowrap">
            <span className="mr4">
              <Button
                variation="tertiary"
                href="/account#/organization"
                onClick={() => {
                  setModalStatus(false)
                }}
              >
                No
              </Button>
            </span>
            <span>
              <Button
                variation="primary"
                href="/validate-organization"
                onClick={() => {
                  setModalStatus(false)
                }}
              >
                Yes
              </Button>
            </span>
          </div>
        }
      />
    </div>
  )
}

export default SignUpModal

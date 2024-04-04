import React, { useState } from 'react'
import { Input, Button } from 'vtex.styleguide'
import axios from 'axios'
import { useRenderSession } from 'vtex.session-client'

import styles from './styles.css'
import RedirectModal from '../Modal/RedirectModal'
import useLoginStatus from '../../hooks/useLoginStatus'
import SuccessToast from './SuccessToast'
import RegisterAccount from './RegisterAccount'

const OrganizationForm: StorefrontFunctionComponent = () => {
  const [accNum, setAccNum] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [inputError, setInputError] = useState(false)
  const [showModal, setModalStatus] = useState(false)
  const [showSuccess, setSuccessStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const isLoggedIn = useLoginStatus()
  const sessionData = useRenderSession()
  const userProfile: any =
    sessionData.session &&
    'namespaces' in sessionData.session &&
    sessionData?.session?.namespaces?.profile

  const getCostCenter = async (id: string) => {
    setLoading(true)

    if (accNum.trim().length === 0 || postalCode.trim().length === 0) {
      setInputError(true)
      setAccNum('')
      setPostalCode('')
      setLoading(false)

      return
    }

    try {
      const body = {
        email: userProfile.email.value,
        // first/last might not be set
        firstName: userProfile.firstName?.value ?? '',
        id: userProfile.id.value,
        lastName: userProfile.lastName?.value ?? '',
        postalCode,
      }

      const { data } = await axios.post(`/_v/validateOrgAddUser/${id}`, body)

      if (data) {
        setSuccessStatus(true)
        await logOutUser()
      }
    } catch (error) {
      showUserWarning()
      setInputError(true)
    } finally {
      setLoading(false)
    }
  }

  const showUserWarning = () => {
    setModalStatus(true)
    setAccNum('')
    setPostalCode('')
  }

  const handleClose = () => {
    setModalStatus(false)
  }

  const logOutUser = async () => {
    try {
      const response = await fetch(
        '/api/vtexid/pub/logout?scope=whitebird&returnUrl='
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error in logOutUser()', error)
    }
  }

  const warningBody = (
    <div>
      It is important to remember that to be able to make a purchase you will
      have to be part of an organization.
      <br />
      <br />
      Click &quot;Make an Organization&quot;, which will redirect you to the
      Organization creation page.
    </div>
  )

  if (isLoggedIn.status === 'guest') {
    return (
      <>
        <p>To use this feature, please log in to your account</p>
        <Button
          variation="primary"
          href="/login?returnUrl=%2Fvalidate-organization"
        >
          Log In
        </Button>
        <RegisterAccount />
      </>
    )
  }

  return (
    <div className={styles['validate-organization__form']}>
      {showSuccess ? (
        <>
          <SuccessToast />
        </>
      ) : (
        <>
          <div className="mb5">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                getCostCenter(accNum)
              }}
            >
              {!inputError ? (
                <Input
                  placeholder="Account Number"
                  size="large"
                  label="Account Number"
                  value={accNum}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAccNum(event.target?.value)
                  }}
                />
              ) : (
                <Input
                  placeholder="Account Number"
                  size="large"
                  label="Account Number"
                  value={accNum}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (inputError) {
                      setInputError(false)
                    }

                    setAccNum(event.target?.value)
                  }}
                  errorMessage="Company doesn't exist or invalid input"
                />
              )}
            </form>
          </div>

          <div className="mb5">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                getCostCenter(accNum)
              }}
            >
              {!inputError ? (
                <Input
                  placeholder="Postal Code"
                  size="large"
                  label="Postal Code"
                  value={postalCode}
                  maxLength="7"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setPostalCode(event.target?.value)
                  }
                />
              ) : (
                <Input
                  placeholder="Postal Code"
                  size="large"
                  label="Postal Code"
                  value={postalCode}
                  maxLength="7"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (inputError) {
                      setInputError(false)
                    }

                    setPostalCode(event.target?.value)
                  }}
                  errorMessage="Postal Code is wrong or invalid input"
                />
              )}
            </form>
          </div>

          <Button
            variation="primary"
            onClick={() => {
              getCostCenter(accNum)
            }}
            disabled={loading}
          >
            Search and Add
          </Button>
        </>
      )}
      {showSuccess ? (
        <a
          className={styles['validate-organization__link--primary']}
          href="/login"
          aria-label="Link to login page"
        >
          <div className={styles['validate-organization__link-text--primary']}>
            Login and Start Shopping
          </div>
        </a>
      ) : (
        <RegisterAccount />
      )}

      {showModal ? (
        <RedirectModal
          title="Whoops looks like that organization doesn't exist"
          onClose={handleClose}
          tertiaryText="Try again"
          primaryText="Make an Organization"
          redirectHref="/account#/organization"
        >
          {warningBody}
        </RedirectModal>
      ) : null}
    </div>
  )
}

export default OrganizationForm

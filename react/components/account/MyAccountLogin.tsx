import React, { useEffect, useState } from 'react'
import useLoginStatus from '../../hooks/useLoginStatus'
import { useRenderSession } from 'vtex.session-client'
//@ts-ignore no types available
import { ActionMenu } from 'vtex.styleguide'
import styles from './styles.css'

type SessionValue =
  | {
      value?: string
    }
  | undefined

const MyAccountLogin = () => {
  const { status, loading } = useLoginStatus()
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const sessionData = useRenderSession()
  const isAuthenticated =
    sessionData.session &&
    'namespaces' in sessionData.session &&
    (sessionData?.session?.namespaces?.profile?.isAuthenticated as SessionValue)
      ?.value === 'true'

  const firstName =
    sessionData.session &&
    'namespaces' in sessionData.session &&
    (sessionData?.session?.namespaces?.profile?.firstName as SessionValue)
      ?.value

  useEffect(() => {
    console.log(sessionData)
    if (!loading && isAuthenticated) {
      setUserLoggedIn(true)
    } else {
      setUserLoggedIn(false)
    }
  }, [loading, status, sessionData])

  const handleLogout = async () => {
    try {
      const response = await fetch('/no-cache/user/logout', {
        method: 'GET',
      })
      if (response.ok) {
        window.location.href = '/'
      } else {
        throw new Error('Logout request failed')
      }
    } catch (error) {
      window.location.reload()
      console.error('Error:', error)
    }
  }

  const options = [
    {
      label: 'My Account',
      onClick: () => (window.location.href = '/account'),
      testId: 'myAccountId',
    },
    {
      label: 'Favourites',
      onClick: () => (window.location.href = '/account#/my-wishlists'),
      testId: 'favourites',
    },
    // {
    //   label: 'Order History',
    //   onClick: () => (window.location.href = '/account/#/order-history'),
    // },
    {
      label: 'Logout',
      onClick: handleLogout,
      testId: 'logout',
    },
  ]

  return (
    <div className={styles['login-container']}>
      {userLoggedIn ? (
        <ActionMenu
          label={firstName ? `Hello, ${firstName}` : 'My Account'}
          align="center"
          hideCaretIcon="true"
          buttonProps={{
            variation: 'primary',
          }}
          options={options}
        />
      ) : (
        <a className={styles['login-link']} href="/login">
          Login / Register
        </a>
      )}
    </div>
  )
}

export default MyAccountLogin

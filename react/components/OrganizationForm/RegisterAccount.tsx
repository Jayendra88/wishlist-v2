import React from 'react'

import styles from './styles.css'

const OrganizationForm: StorefrontFunctionComponent = () => {
  return (
    <>
      <div className={styles['validate-organization__contact-us']}>
        Forgot your account number? Give us a call at 905.544.7575
      </div>

      <h4 className={styles['validate-organization__header']}>
        Don't have an account number?
      </h4>
      <a
        className={styles['validate-organization__link--secondary']}
        href="/account#/organization"
        aria-label="Link to register new organization"
      >
        <div className={styles['validate-organization__link-text--secondary']}>
          Register a New Account
        </div>
      </a>
    </>
  )
}

export default OrganizationForm

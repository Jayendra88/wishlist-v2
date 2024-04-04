import React from 'react'
import { createSystem, ToastProvider } from '@vtex/admin-ui'

import AdminGridTable from './AdminGridTable'

const [ThemeProvider] = createSystem({
  key: 'admin-ui-admin-grid-table',
})

const AdminGridTableWrapped = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AdminGridTable />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default AdminGridTableWrapped

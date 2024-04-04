// '{red}(sample text)' will render as red text with inline style for color
import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Button, Flex } from '@vtex/admin-ui'

const messages = defineMessages({
  return: { id: 'admin/admin-grid-table.details.return' },
  save: { id: 'admin/admin-grid-table.details.save' },
  confirmMessage: {
    id: 'admin/admin-grid-table.details.confirmMessage',
  },
})

const DetailsFooter: React.FC = () => {
  // ------
  // Pull the navigation function from the runtime
  const { navigate } = useRuntime()

  return (
    <Flex justify="end">
      <Button
        variant="secondary"
        onClick={() =>
          navigate({
            page: 'admin.app.grid-list',
          })
        }
      >
        <FormattedMessage {...messages.return} />
      </Button>
    </Flex>
  )
}

export default DetailsFooter

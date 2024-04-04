import * as Sentry from '@sentry/node'

const { VTEX_ACCOUNT, VTEX_APP_ID, VTEX_PRODUCTION, VTEX_WORKSPACE } =
  process.env

Sentry.init({
  debug: VTEX_PRODUCTION === 'false',
  dsn: 'https://3fa8f1aaad8945bab39d6da2143b9feb@o483584.ingest.sentry.io/4504595356057600',
  environment: VTEX_PRODUCTION === 'false' ? 'staging' : 'production',
  initialScope: {
    tags: {
      account: VTEX_ACCOUNT,
      app: VTEX_APP_ID,
      workspace: VTEX_WORKSPACE,
    },
  },
})

export function captureErrors(error: unknown, context: Context) {
  Sentry.withScope((scope) => {
    if ('request' in context) {
      scope.addEventProcessor((event) => {
        return Sentry.Handlers.parseRequest(event, context.request)
      })
    }

    Sentry.captureException(error)
  })
}

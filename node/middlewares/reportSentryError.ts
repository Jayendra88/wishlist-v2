import { captureErrors } from '../utils/sentry'

export async function reportSentryError(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    await next()
  } catch (error) {
    captureErrors(error, ctx)
    throw error
  }
}

import type { S3ClientConfig } from '@aws-sdk/client-s3'
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function signedUrl(ctx: Context, next: () => Promise<unknown>) {
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: 'AKIAUJGMGB6DDAZEJT6Q',
      secretAccessKey: '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',
    },
    region: 'us-east-1',
  }

  const s3 = new S3Client(s3Configuration)
  const command = new GetObjectCommand({
    Bucket: 'whitebird-invoices',
    Key: `${ctx.vtex.route.params.invoiceId}.pdf`,
  })

  const head = new HeadObjectCommand({
    Bucket: 'whitebird-invoices',
    Key: `${ctx.vtex.route.params.invoiceId}.pdf`,
  })

  try {
    await s3.send(head)
    const fifteenMinutes = 15 * 60
    const url = await getSignedUrl(s3, command, { expiresIn: fifteenMinutes })

    ctx.status = 200
    ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
    ctx.body = url
  } catch (error) {
    ctx.status = 404
  }

  await next()
}

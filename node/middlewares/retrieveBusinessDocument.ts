import getBusinessDocument from '../helpers/getBusinessDocument'

export async function gettingBusinessDocument(
  ctx: Context,
  next: () => Promise<any>
) {
  const buisnessDocument = await getBusinessDocument(ctx)

  ctx.body = buisnessDocument
  await next()
}

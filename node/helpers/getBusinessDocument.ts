export default async function getBusinessDocument(ctx: Context) {
  const sessionToken = ctx.vtex.sessionToken as string

  const sessionData = ctx.clients.session.getSession(sessionToken, [
    'storefront-permissions.costcenter',
  ])

  const costCenterID = await sessionData.then((res) => {
    return res.sessionData.namespaces?.['storefront-permissions']?.costcenter
      ?.value
  })

  if (!costCenterID) {
    return { businessDocument: 'costCenterID - not found' }
  }

  const masterdataClient = ctx.clients.masterdata
  const document: Document = await masterdataClient.getDocument({
    dataEntity: 'cost_centers',
    id: costCenterID,
    fields: ['businessDocument'],
  })

  return document
}

interface Document {
  businessDocument: string
}

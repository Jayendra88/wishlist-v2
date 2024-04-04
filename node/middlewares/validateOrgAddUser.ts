import { json } from 'co-body'

import { B2B_DEFAULT_ADMIN_ROLE } from '../constants'

export async function validateOrgAddUser(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { organization: GetOrganization, addUser: user },
  } = ctx

  const orgId: string = ctx.vtex.route.params.id as string

  const data = await GetOrganization.getOrg(orgId)
  const reqBody = await json(ctx.req)

  const reqPostalCode = reqBody.postalCode
  const addresses = data[0]?.addresses

  const hasAddressMatchingCurrentPostalCode = addresses?.some(
    (address: any) => {
      return (
        reqPostalCode.replace(/\s/g, '').toLowerCase() ===
        address.postalCode.replace(/\s/g, '').toLowerCase()
      )
    }
  )

  if (hasAddressMatchingCurrentPostalCode) {
    const body = {
      orgId: data[0]?.organization,
      roleId: B2B_DEFAULT_ADMIN_ROLE,
      clId: reqBody?.id,
      name: reqBody?.firstName,
      email: reqBody?.email,
      costId: data[0].id,
    }

    const addedData = await user.addUser(body)

    ctx.body = addedData
    ctx.status = 200
    ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
    await next()
  } else {
    ctx.status = 400
    ctx.set('cache-control', 'no-cache, no-store, must-revalidate, max-age=0')
    await next()
  }
}

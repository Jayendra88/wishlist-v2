import { QUERIES } from '../graphql/queries'

interface CustomField {
  name: string
  value: string
}

const getOrgCustomFieldCodes = async (reqBody: any, ctx: Context) => {
  const { orgId } = reqBody

  try {
    const organizationData: any = await ctx.clients.graphQLServer.query(
      QUERIES.getOrganizationCustomFields,
      {
        identifier: orgId,
      },
      {
        persistedQuery: {
          provider: 'vtex.b2b-organizations-graphql@1.x',
          sender: 'whitebird.minimumtheme@3.x',
        },
      }
    )

    const customFields =
      organizationData?.data?.getOrganizationById?.customFields || []

    const pickUpCodeObj = customFields.find(
      (customField: CustomField) => customField.name === 'Pick Up Code'
    ) ?? { name: 'Pick Up Code', value: '' }

    const deliveryCodeObj = customFields.find(
      (customField: CustomField) => customField.name === 'Delivery Code'
    ) ?? { name: 'Delivery Code', value: '' }

    const typeCodeObj = customFields.find(
      (customField: CustomField) => customField.name === 'Type Code'
    ) ?? { name: 'Type Code', value: '' }

    return {
      pickUpCode: pickUpCodeObj.value,
      deliveryCode: deliveryCodeObj.value,
      typeCode: typeCodeObj.value,
    } as {
      pickUpCode: string
      deliveryCode: string
      typeCode: string
    }
  } catch (error) {
    console.error(`Failed to get organization fields: ${error.message}`)

    return {
      pickUpCode: null,
      deliveryCode: null,
      typeCode: null,
    }
  }
}

export default getOrgCustomFieldCodes

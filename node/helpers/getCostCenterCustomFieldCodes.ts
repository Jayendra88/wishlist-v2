import { QUERIES } from '../graphql/queries'

interface CustomField {
  name: string
  value: string
}

const getCostCenterCustomFieldCodes = async (reqBody: any, ctx: Context) => {
  const { costCenterId } = reqBody

  try {
    const costCenterData: any = await ctx.clients.graphQLServer.query(
      QUERIES.getCostCenterCustomFields,
      {
        identifier: costCenterId,
      },
      {
        persistedQuery: {
          provider: 'vtex.b2b-organizations-graphql@1.x',
          sender: 'whitebird.minimumtheme@3.x',
        },
      }
    )

    const customFields =
      costCenterData?.data?.getCostCenterById?.customFields || []

    const residentialAddressObj: CustomField = customFields.find(
      (customField: CustomField) =>
        customField.name === 'Is Address Residential?'
    ) ?? { name: 'Is Address Residential?', value: 'False' }

    const tailgateObj: CustomField = customFields.find(
      (customField: CustomField) => customField.name === 'Tailgate Required?'
    ) ?? { name: 'Tailgate Required?', value: 'False' }

    return {
      isResidential: residentialAddressObj.value === 'True',
      tailgateNeeded: tailgateObj.value === 'True',
    }
  } catch (error) {
    console.error(`Failed to get cost center details: ${error.message}`)

    return {
      isResidential: false,
      tailgateNeeded: false,
    }
  }
}

export default getCostCenterCustomFieldCodes

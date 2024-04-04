const isPostalCodeInRange = async (postalCode: string, ctx: Context) => {
  const PostalCode = await ctx.clients.masterdata.searchDocuments({
    dataEntity: 'DC',
    fields: ['id', 'postalCode'],
    where: `(postalCode  = "${postalCode}")`,
    pagination: {
      page: 1,
      pageSize: 1,
    },
  })

  return !!PostalCode.length
}

export default isPostalCodeInRange

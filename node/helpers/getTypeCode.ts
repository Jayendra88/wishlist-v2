const getTypeCode = async (typeCode: string, ctx: Context) => {
  const rateInfo = await ctx.clients.masterdata.searchDocuments({
    dataEntity: 'SC',
    fields: [
      'id',
      'min_charge',
      'min_order_value',
      'type_code',
      'price_breaks',
    ],
    pagination: {
      page: 1,
      pageSize: 1,
    },
    where: `type_code=${typeCode}`,
  })

  return rateInfo
}

export default getTypeCode

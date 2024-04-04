export const detailsBody = (orderId: string, businessDocument: string) => ({
  SalesOrderGetSalesOrdersRequest: {
    RecordLimit: 1,
    Parameters: {
      CustomerCode: businessDocument,
      SOOrderNo: orderId,
    },
    RequestFields: {
      SalesOrders: {
        SalesOrder: {
          ALLFIELDS: true,
          SalesOrderLines: {
            RequestFields: {
              SalesOrderLines: {
                SalesOrderLine: {
                  ALLFIELDS: true,
                },
              },
            },
          },
        },
      },
    },
  },
})

export const listBodyXml = (
  startOrderId?: number,
  businessDocument?: string
) => {
  return ` <SalesOrderGetSalesOrdersRequest xmlns="http://www.pronto.net/so/1.0.0">
    <RecordLimit>100</RecordLimit>
    <Parameters>
      <CustomerCode>${businessDocument}</CustomerCode>
    </Parameters>
    <StartKeys> 
      ${
        startOrderId ? `<SOOrderNo>${startOrderId}</SOOrderNo>` : '<SOOrderNo/>'
      }
    </StartKeys>
    <OrderBy>
      <CustomerCode sortorder='ASC'/>
      <Date sortorder='DESC'/>
    </OrderBy>
    <Filters>
      <TotalAmount>
        <NotLike>0</NotLike>
      </TotalAmount>
    </Filters>
    <RequestFields>
      <SalesOrders>
        <SalesOrder>
            <Date/>
            <CustomerCode/>
            <OrderEmail/>
            <TotalAmount/>
            <SOOrderNo/>
        </SalesOrder>
      </SalesOrders>
    </RequestFields>
  </SalesOrderGetSalesOrdersRequest>`
}

export const reqOptions = (token: string) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'X-Pronto-Token': token,
      'X-Pronto-Content-Type': 'application/json',
    },
  }
}

// reqOption for XML
export const reqOptionsXml = (token: string) => {
  return {
    headers: {
      'Content-Type': 'text/xml',
      'X-Pronto-Token': token,
      'X-Pronto-Content-Type': 'text/xml',
    },
  }
}

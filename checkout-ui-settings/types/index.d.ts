export {}

declare global {
  interface Window {
    vtex: {
      renderLoader: {
        locale: string
      }
    }
    b2bCheckoutSettings: {
      addresses: any[]
    }
    API: {
      orderForm: {
        loggedIn: boolean
      }
    }
    vtexjs: {
      checkout: {
        orderForm: {
          shippingData: {
            logisticsInfo: any[]
          }
          items: any[]
        }
        // add done to the type
        getOrderForm: () => GetOrderFormPromise<any>
        updateOrderFormShipping: (shippingData: any) => Promise<any>
        addToCart: (items: any[], notSure: any) => GetOrderFormPromise<any>
        removeItems: (items: any[]) => GetOrderFormPromise<any>
      }
    }
    Vue: any
    ko: any
  }

  interface GetOrderFormPromise<T> extends Promise<T> {
    done: (orderForm: any) => Promise<any>
  }
}

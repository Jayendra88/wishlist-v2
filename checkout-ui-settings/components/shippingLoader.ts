import { paymentMethodClickedLoader } from './paymentMethodClickLoader'

const loaderTextTemplates = {
  shipping: 'Loading in shipping rates',
  updating: 'Updating shipping rate',
  updatingPayment: 'Updating payment method',
  address: 'Updating rates with new address',
  default: 'Loading',
}

const createLoader = () => {
  const loader = document.createElement('div')

  loader.classList.add('loader')
  loader.style.setProperty('size', '20px')
  loader.style.setProperty('color', '#000')
  loader.style.setProperty('width', '80px')
  loader.style.setProperty('lineCount', '15')
  loader.style.setProperty('angle', '7deg')

  return loader
}

const createLoaderText = (state: string) => {
  const loaderText = document.createElement('div')

  loaderText.innerHTML =
    loaderTextTemplates[state] || loaderTextTemplates.default
  loaderText.style.textAlign = 'center'
  loaderText.style.marginTop = '1rem'

  return loaderText
}

let paymentLoaderObserver: MutationObserver | null = null

export const createLoaderWrapper = (state: string, className: string) => {
  const loaderWrapper = document.createElement('div')

  loaderWrapper.classList.add(className)
  loaderWrapper.appendChild(createLoader())
  loaderWrapper.appendChild(createLoaderText(state))

  return loaderWrapper
}

export const attachShippingLoader = (state: string) => {
  const vueApp = document.querySelector('#vueApp')
  const paymentTypeSelector = document.querySelector(
    '#payment-data'
  ) as HTMLElement

  const loaderWrapper = createLoaderWrapper(state, 'loader__wrapper')

  if (!document.querySelector('.loader__wrapper')) {
    vueApp?.appendChild(loaderWrapper)
  }

  const loaderWrapperPayment = createLoaderWrapper(
    state,
    'loader__wrapper--payment'
  )

  // prevent multiple loaders
  if (!document.querySelector('.loader__wrapper--payment')) {
    paymentTypeSelector?.appendChild(loaderWrapperPayment)
  }

  // Set up a MutationObserver to re-mount the loader if it gets unmounted by checkout-ui
  if (!paymentLoaderObserver) {
    paymentLoaderObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'childList' &&
          !document.querySelector('.loader__wrapper--payment')
        ) {
          paymentTypeSelector?.appendChild(loaderWrapperPayment)
        }
      })
    })

    paymentLoaderObserver.observe(paymentTypeSelector, { childList: true })
  }
}

export const removeLoader = (target: HTMLElement | null) => {
  if (target && target.parentNode) {
    target.parentNode.removeChild(target)
  }
}

export const removeGlobalLoader = () => {
  paymentMethodClickedLoader()

  window.vtexjs.checkout.getOrderForm().done((_orderForm: any) => {
    const target = document.querySelector('.loader__wrapper') as HTMLElement
    const target2 = document.querySelector(
      '.loader__wrapper--payment'
    ) as HTMLElement

    const removeLoadersAndDisconnectObserver = () => {
      removeLoader(target)
      removeLoader(target2)

      // Disconnect the MutationObserver
      if (paymentLoaderObserver) {
        paymentLoaderObserver.disconnect()
        paymentLoaderObserver = null
      }
    }

    if (_orderForm.paymentData.payments[0].paymentSystem === '201') {
      const postData = {
        payments: [
          {
            paymentSystem: 201,
            paymentSystemName: 'Charge on Account',
            group: 'custom201PaymentGroupPaymentGroup',
            installments: 1,
            installmentsInterestRate: 0,
            installmentsValue: _orderForm.value,
            value: _orderForm.value,
            referenceValue: _orderForm.value,
          },
        ],
        giftCards: [],
        expectedOrderFormSections: [
          'items',
          'totalizers',
          'clientProfileData',
          'shippingData',
          'paymentData',
          'sellers',
          'messages',
          'marketingData',
          'clientPreferencesData',
          'storePreferencesData',
          'giftRegistryData',
          'ratesAndBenefitsData',
          'openTextField',
          'commercialConditionData',
          'customData',
        ],
      }

      fetch(
        `/api/checkout/pub/orderForm/${_orderForm.orderFormId}/attachments/paymentData`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      ).then((_data) => {
        removeLoadersAndDisconnectObserver()
      })
    } else {
      removeLoadersAndDisconnectObserver()
    }
  })
}

import { attachShippingLoader, removeGlobalLoader } from './shippingLoader'

// prevents updating payment method while shipping rates are loading/being updated, which may cause orderForm to break
export const paymentMethodClickedLoader = () => {
  let elementClicked = false // Variable to track if an element is clicked
  let ajaxCompleteTimeout: NodeJS.Timeout | null = null

  function handleAjaxComplete(): void {
    // This function will be called when an AJAX request associated with the payment method is complete
    if (elementClicked) {
      if (ajaxCompleteTimeout) {
        clearTimeout(ajaxCompleteTimeout)
      }

      ajaxCompleteTimeout = setTimeout(() => {
        removeGlobalLoader()
        elementClicked = false // Reset elementClicked
      }, 500)
    }
  }

  function addClickListener(elementId: string) {
    const element = document.getElementById(elementId)

    if (element && !element.hasEventListener) {
      element.addEventListener('click', () => {
        elementClicked = true
        attachShippingLoader('updatingPayment')
      })
      element.hasEventListener = true
    }
  }

  // Add click listeners for customPaymentGroup and creditCardPaymentGroup
  addClickListener('payment-group-custom201PaymentGroupPaymentGroup')
  addClickListener('payment-group-creditCardPaymentGroup')

  // Only activate the AJAX complete handler when an element is clicked
  $(document).ajaxComplete(handleAjaxComplete)
}

/* eslint-disable vtex/prefer-early-return */
/* eslint-disable @typescript-eslint/no-this-alias */
import {
  attachShippingLoader,
  removeGlobalLoader,
} from '../components/shippingLoader'
import {
  attachLoginModal,
  removeLoginModal,
  handleModalCheckResult,
} from '../components/loginModal'
import {
  productIputFieldsModifications,
  checkUOMAndModifyTemplate,
  addRefIdsToPaymentPage,
} from '../components/productIputFieldsModifications'

const isWorkspaceUrl = window.location.host.includes('--')

if (!isWorkspaceUrl) {
  const sentry = document.createElement('script')

  sentry.src =
    'https://js.sentry-cdn.com/f05292cb09f64c2c982500365e9f7335.min.js'
  sentry.crossOrigin = 'anonymous'
  document.head.appendChild(sentry)
}

const script = document.createElement('script')

script.src = 'https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js'
script.async = false
document.head.appendChild(script)

const mountVueApp = () =>
  window.vtexjs.checkout.getOrderForm().done((orderForm: any) => {
    // address could be null if user is not logged in
    let address: any = null

    if (orderForm && orderForm.shippingData && orderForm.shippingData.address) {
      address = orderForm.shippingData.address
    }

    const { clientProfileData, marketingData } = orderForm

    // fix to check if marketingData is there on load
    window.addEventListener('hashchange', () => {
      handleModalCheckResult(orderForm)

      // if hash included cart, reset priceUpdateFinished to false
      if (window.location.href.includes('payment')) {
        disableBuyButton(true)
      }
    })

    if (window.b2bCheckoutSettings) {
      handleModalCheckResult(orderForm)
    } else {
      // on initial load, check if user is logged in and if not - attach login modal, only on payment page
      $(document).ajaxComplete((event, xhr, settings) => {
        if (settings.url?.includes('/_v/private/b2b-checkout-settings/')) {
          handleModalCheckResult(orderForm)
        }
      })
    }

    const app = Vue.createApp({
      el: '#vueApp',
      template: `
        <h3>Shipping Options</h3>
        <div class="shipping-wrapper">
          <div>
            <div class="shipping-options-wrapper" v-if="data" >
              <div v-for="(quote, index) in data" class="single-option-wrapper">
                <input
                type="radio"
                :id="quote.service_id"
                class = "radio_input"
                name="shipping-options"
                :checked="quote.service_id === currentShippingId"
                value="fiveDays"
                @click="updateShippingPrice(quote)"
                />
                <div class="option" >
                  <label :for="quote.service_id">{{ quote.carrier_name }} - {{ quote.service_name }}</label>
                  <label :for="quote.service_id">{{ quote.transit_time_days }} {{ parseInt(quote.transit_time_days) > 1 ? "Days" : "Day" }}</label>
                  <p>{{ "$" + (quote.total.value / 100).toFixed(2).toLocaleString(orderFormData.clientPreferencesData.locale) }}</p>
                  <p v-if="quote.total.surcharge">{{ "Shipping fee of " + "$" + (quote.total.subtotal / 100) + " with a " + "$" + (quote.total.surcharge / 100) + " fuel surcharge"}}</p>
                </div>
              </div>
              <h3>Pick Up Options</h3>
              <div v-for="(quote, index) in pickUpData" class="single-option-wrapper">
                <input
                type="radio"
                :id="quote.service_id"
                class = "radio_input"
                name="shipping-options"
                :checked="quote.service_id === currentShippingId"
                value="fiveDays"
                @click="updateShippingPrice(quote)"
                />
                <div class="option" >
                  <label :for="quote.service_id">{{ quote.carrier_name }} - {{ quote.service_name }}</label>
                  <label class="pick-up-label" :for="quote.service_id">{{ quote.transit_time_days }} </label>
                  <p> {{ quote.total.value !== 0 ? "$" + (quote.total.value / 100).toLocaleString(orderFormData.clientPreferencesData.locale) : 'Free' }}</p>
                </div>
              </div>
            </div>
            <div class="shipping-options-wrapper" v-else-if="fetchAttempts !== 3">Loading shipping rates</div>
            <div class="shipping-options-wrapper" v-else>
              <p>An item in your cart requires special shipping arrangements. Please contact our Customer Service team to arrange freight.</p>
            </div>
          </div>
        `,
      data: () => ({
        postalCode: address ? address.postalCode : '',
        state: address ? address.state : '',
        address: address ? address.street : '',
        city: address ? address.city : '',
        country: address ? address.country : '',
        receiverName: address ? address.receiverName : '',
        costCenter: clientProfileData?.corporateName ?? '',
        orgId: orderForm.marketingData
          ? orderForm.marketingData.utmCampaign
          : '',
        costCenterId: orderForm.marketingData
          ? orderForm.marketingData.utmMedium
          : '',
        surcharge: '',
        orderFormId: null,
        orderFormData: null,
        total: orderForm.totalizers ? orderForm.totalizers[0].value : 0,
        poInput: '',
        data: '',
        pickUpData: {},
        request_ids: { ltlRequestId: '', packageRequestId: '' },
        currentShippingId: null,
        shippingIsInCart: false,
        fetchAttempts: 0,
        priceUpdateFinished: false,
      }),
      beforeMount() {
        const self = this as any // targeting the whole Vue instance

        // save orderFormId to data
        self.orderFormId = orderForm.orderFormId
        self.orderFormData = orderForm

        // on initial load, make to add/remove shipping item
        if (window.location.href.includes('payment')) {
          self.addShippingItem()
          window.vtexjs.checkout.getOrderForm().then((_localOrderForm) => {
            self.getShippingOptions()
          })
        }

        // check what is the current step
        window.addEventListener('hashchange', () => {
          if (
            window.location.href.includes('payment') ||
            window.location.href.includes('profile')
          ) {
            if (!self.orderFormData.loggedIn) {
              attachLoginModal(null)
            }

            // if on payment page - add shipping item
            self.addShippingItem()

            if (window.location.href.includes('payment')) {
              self.priceUpdateFinished = false
              self.addShippingItem()
              window.vtexjs.checkout.getOrderForm().then((localOrderForm) => {
                self.orderFormId = localOrderForm.orderFormId
                self.orderFormData = localOrderForm
                self.total = localOrderForm.totalizers[0].value
                self.getShippingOptions()
              })
            }
          } else {
            // if on cart page - remove shipping item
            self.shippingIsInCart = false
            const target = document.querySelector('.modal__wrapper')

            if (target) {
              removeLoginModal()
            }
          }
        })
      },

      mounted() {
        const self = this as any // targeting the whole Vue instance

        this.initObserver()
        const checkIfDivExist = setInterval(() => {
          const addressSummaryDiv = document.querySelector(
            '#shipping-data > .shipping-data'
          )

          if (!addressSummaryDiv) return
          const newAddressLink = document.createElement('a')

          newAddressLink.innerHTML = 'Create new address'
          newAddressLink.setAttribute(
            'href',
            marketingData && marketingData.utmMedium
              ? `/account#/cost-center/${marketingData.utmMedium}`
              : `/account#/organization`
          )

          addressSummaryDiv.appendChild(newAddressLink)
          clearInterval(checkIfDivExist)
        }, 50)

        const checkIfPOInputExist = setInterval(() => {
          const poInput = document.querySelector(
            '.b2b-purchase-order-number-input'
          ) as HTMLInputElement

          const paymentButton = document.querySelectorAll(
            '#payment-data-submit'
          )

          const poLabel = document.querySelector(
            '.b2b-purchase-order-number-label'
          ) as HTMLInputElement

          disableBuyButton(!poInput && !self.priceUpdateFinished)

          if (!poInput) return

          // Clear the PO input on initial load
          poInput.value = ''

          poLabel.innerText += ' - Required'

          // Create a message element for the PO input field
          const message = document.createElement('div')

          message.style.display = 'none'
          message.style.color = 'red'
          message.style.marginTop = '5px'
          message.innerText = 'Please fill in the PO field'
          poInput.parentNode?.insertBefore(message, poInput.nextSibling)

          poInput.addEventListener('keyup', (e) => {
            self.poInput = e.target.value || ''
            // Clear the red border and hide the message when the PO input is filled in
            if (poInput.value !== '') {
              poInput.style.border = ''
              message.style.display = 'none'
            }
          })

          disableBuyButton(poInput.value === '' && !self.priceUpdateFinished)

          // Add an overlay div on top of the payment button
          const buttonOverlay = document.createElement('div')

          buttonOverlay.style.position = 'absolute'
          buttonOverlay.style.top = '0'
          buttonOverlay.style.left = '0'
          buttonOverlay.style.width = '100%'
          buttonOverlay.style.height = '100%'
          buttonOverlay.style.zIndex = '2'
          paymentButton[1].style.position = 'relative'
          paymentButton[1].appendChild(buttonOverlay)

          // Add a red border to the PO input field and show the message when the overlay is clicked and the field is empty
          buttonOverlay.addEventListener('click', () => {
            if (poInput.value === '') {
              poInput.style.border = '2px solid red'
              message.style.display = 'block'
            }
          })

          clearInterval(checkIfPOInputExist)
        }, 50)
      },
      computed: {
        isBuyButtonAvailable() {
          const self = this as any // targeting the whole Vue instance

          return {
            priceUpdateFinished: self.priceUpdateFinished,
            poInput: self.poInput,
          }
        },
      },
      watch: {
        orderFormId(orderFormId: any) {
          if (orderFormId) {
            // on orderForm load, run the script to update the shipping price
            this.orderFormId = orderFormId
          }
        },
        isBuyButtonAvailable(isBuyButtonAvailable: any) {
          const paymentButton = document.querySelectorAll(
            '#payment-data-submit'
          )

          paymentButton[1].disabled =
            isBuyButtonAvailable.poInput === '' ||
            !isBuyButtonAvailable.priceUpdateFinished
        },
      },
      methods: {
        initObserver() {
          const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
          }

          const self = this as any // targeting the whole Vue instance

          const observer = new MutationObserver((mutations) => {
            const mutationHappened = mutations.some((mutation) =>
              mutation.target.classList?.contains('address-item')
            )

            const paymentMutationHappened = mutations.some((mutation) => {
              return mutation.target.classList?.contains('payment-group-item')
            })

            if (paymentMutationHappened) {
              const paymentButton = document.querySelectorAll(
                '#payment-data-submit'
              )

              const shippingIsSelected =
                self.currentShippingId !== null && self.priceUpdateFinished

              paymentButton[1].disabled =
                self.poInput === '' || !shippingIsSelected
            }

            if (!mutationHappened) return

            window.vtexjs.checkout
              .getOrderForm()
              .done((localOrderForm: any) => {
                if (localOrderForm?.shippingData?.address) {
                  const localAddress = localOrderForm.shippingData.address

                  self.address = localAddress.street
                  self.postalCode = localAddress.postalCode
                  self.state = localAddress.state
                  self.street = localAddress.street
                  self.country = localAddress.country
                  self.city = localAddress.city
                  self.receiverName = localAddress.receiverNam
                }
              })
          })

          observer.observe(document.body, config)

          this.observer = observer
        },
        getShippingOptions() {
          const self = this as any // targeting the whole Vue instance

          self.currentShippingId = null
          self.priceUpdateFinished = false

          const fetchShipping = async () => {
            try {
              const response = await fetch('/_v/shipping', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  items: self.orderFormData.items,
                  address: self.address,
                  city: self.city,
                  state: self.state,
                  country: self.country,
                  postalCode: self.postalCode,
                  receiverName: self.receiverName,
                  costCenter: self.costCenter,
                  orgId: self.orgId,
                  costCenterId: self.costCenterId,
                  total: self.total,
                }),
              })

              const responseData = await response.json()

              self.data = responseData.rates
              self.pickUpData = responseData.pick_up_rates
              self.currentShippingId =
                self.data?.length > 0 ? self.data[0]?.service_id : null
              self.addShippingItem()
              self.updateShippingPrice(responseData.rates[0])
            } catch (error) {
              console.error(error)
              self.fetchAttempts += 1
              removeGlobalLoader()
              if (self.fetchAttempts !== 3) {
                removeGlobalLoader()
                self.getShippingOptions()
              }
            }
          }

          fetchShipping()
        },
        async addShippingItem() {
          attachShippingLoader('shipping')

          const self = this as any // targeting the whole Vue instance

          if (self.shippingIsInCart) return

          window.vtexjs.checkout.getOrderForm().then(() => {
            const shippingItemId = 7402
            // shipping item
            const item = {
              id: shippingItemId,
              quantity: 1,
              seller: '1',
            }

            return window.vtexjs.checkout.addToCart([item], null).done(() => {
              self.shippingIsInCart = true
            })
          })
        },
        removeShippingItem() {
          window.vtexjs.checkout.getOrderForm().then((localOrderForm) => {
            const shippingItemIndex = localOrderForm.items.findIndex(
              (item: any) => item.id === '7402'
            )

            const itemsToRemove = [
              {
                index: shippingItemIndex,
                quantity: 1,
              },
            ]

            return window.vtexjs.checkout.removeItems(itemsToRemove)
          })
        },
        updateShippingPrice(shippingRate: any) {
          const self = this as any // targeting the whole Vue instance

          attachShippingLoader('updating')
          self.currentShippingId = shippingRate.service_id
          self.request_id = shippingRate.requestId
          self.priceUpdateFinished = false

          // make sure that the shipping item is in the cart
          window.vtexjs.checkout.getOrderForm().then((localOrderForm) => {
            if (
              localOrderForm.items.findIndex((item) => item.id === '7402') ===
              -1
            ) {
              // in case the shipping item is not in the cart, add it
              self.addShippingItem()
            } else {
              // in case the shipping item is in the cart, update the price
              window.vtexjs.checkout
                .getOrderForm()
                .done((localOrderForm: any) => {
                  updatePrice(localOrderForm)
                })
            }
          })

          const updatePrice = async (localOrderForm: any) => {
            try {
              const response = await fetch(
                `/_v/shippingUpdate/${localOrderForm.orderFormId}`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    shippingRate,
                    items: localOrderForm.items,
                    address: address.street,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    postalCode: address.postalCode,
                  }),
                }
              )

              const responseData = await response.json()

              if (responseData) {
                window.vtexjs.checkout.getOrderForm().done(() => {
                  removeGlobalLoader()
                  self.priceUpdateFinished = true
                })
              }
            } catch (error) {
              removeGlobalLoader()
              console.error(error, 'error')
            }
          }

          const { currentShippingId } = self

          const isValidCurrentShippingId = !!currentShippingId

          disableBuyButton(
            !isValidCurrentShippingId && !self.priceUpdateFinished
          )
        },
      },
      beforeDestroy() {
        if (this.observer) this.observer.disconnect()
      },
    })

    app.mount('#vueApp')
  })

//! Helper functions

// run a timer to check if element with id #edit-shipping-data exists, if it does - mount the vue app
const vueContainer = document.createElement('div')

vueContainer.id = 'vueApp'

const config = {
  attributes: true,
  childList: true,
  subtree: true,
}

const vueMountObserver = new MutationObserver((mutations) => {
  const mutationHappened = mutations.some((mutation) => {
    return mutation.target.classList?.contains('orderform-template-holder')
  })

  if (!mutationHappened) return

  const isWindowVtexjsMounted = setInterval(() => {
    const { vtexjs, Vue } = window

    if (!vtexjs || !Vue) return

    const orderDiv = document.querySelector(
      'div.orderform-template-holder > div.row-fluid'
    )

    orderDiv?.insertBefore(vueContainer, orderDiv.children[2])

    mountVueApp()

    const poInput = document.querySelector('.b2b-purchase-order-number-input')

    disableBuyButton(!poInput)

    clearInterval(isWindowVtexjsMounted)
  }, 50)
})

vueMountObserver.observe(document.body, config)

// Hotjar tracking code - NOTE: Need to add this before Listrak code otherwise it gives error

function hotjarTrackingCode(h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      ;(h.hj.q = h.hj.q || []).push(arguments)
    }

  h._hjSettings = { hjid: 3425988, hjsv: 6 }
  a = o.getElementsByTagName('head')[0]
  r = o.createElement('script')
  r.async = 1
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
  a.appendChild(r)
}

hotjarTrackingCode(
  window,
  document,
  'https://static.hotjar.com/c/hotjar-',
  '.js?sv=',
  null,
  null
)

// End Hotjar tracking code

const disableBuyButton = (shouldDisable: boolean) => {
  const paymentButton = document.querySelectorAll('#payment-data-submit')

  paymentButton[1].setAttribute(
    ['data-bind'],
    `fadeVisible: !window.router.sac.isActive() && window.paymentData.isPaymentButtonVisible(), click: submit, disable: ${shouldDisable}`
  )
}

// Knockout template modifications
productIputFieldsModifications()

addRefIdsToPaymentPage()

checkUOMAndModifyTemplate()
// Knockout template modifications

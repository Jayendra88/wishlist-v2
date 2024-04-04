let unitMultiplierObservable: any

export const productIputFieldsModifications = () => {
  //! unitMultiplier for inputs starts
  // add knockout observable

  // on document load, add an observable to the window object
  $(document).ready(() => {
    // save multiple unit multiplier values in an array of objects inside the window.ko.observable
    // unitMultiplierObservable([{ refId: 1, unitMultiplier: 1}])
    unitMultiplierObservable = window.ko.observableArray([])
  })

  $(document).on('click', '.item-quantity-change', function (_e) {
    const clickedElement = $(this)
    const elementId = clickedElement.attr('id')
    const idParts = elementId?.split('-')
    const productIdFromElement = idParts[idParts.length - 1]
    const { orderForm } = window.vtexjs.checkout
    const matchingOrderItems = orderForm.items.filter(
      (product) => product.id === productIdFromElement
    )

    const productId = matchingOrderItems[0].id
    const inputValue = clickedElement.parent().find('input').val()
    const inputElement = clickedElement.parent().find('input')
    const buttonElement = clickedElement.parent().find('button')

    const incrementValue = (minQty: any) => {
      if (Number(inputValue) > minQty) {
        inputElement
          .val(roundNumber(Number(inputValue) + -1 + minQty, minQty))
          .change()
        buttonElement.attr('disabled', false)
      }
    }

    const decrementValue = (minQty: any) => {
      if (Number(inputValue) <= Number(minPurchQty(productId))) {
        clickedElement.attr('disabled', true)
        inputElement.val(minQty).change()
      }

      if (Number(inputValue) > Number(minPurchQty(productId))) {
        clickedElement.attr('disabled', false)
        inputElement
          .val(roundNumber(Number(inputValue) + 1 - Number(minQty), minQty))
          .change()
      }
    }

    const productExistsInObservable = unitMultiplierObservable().find(
      (product: any) => product.productId === productIdFromElement
    )

    if (unitMultiplierObservable().length === 0 || !productExistsInObservable) {
      const orderFormItemsNoShipping = orderForm.items.filter(
        (product) => product.name !== 'Shipping'
      )

      getMinPurchaseQty(orderFormItemsNoShipping).then(() => {
        const minQty = minPurchQty(productId)

        incrementValue(minQty)
      })
    }

    if (elementId?.includes('increment') && productExistsInObservable) {
      const minQty = minPurchQty(productId)

      incrementValue(minQty)
    }

    if (elementId?.includes('decrement') && productExistsInObservable) {
      const minQty = minPurchQty(productId)

      decrementValue(minQty)
    }
  })

  $(document).on(
    'input',
    // only trigger on inputs with id starting with item-quantity
    'input[type="tel"][id^="item-quantity"]',
    debounce(function (_e: any) {
      updateInputValue(this)
    }, 400)
  )

  //! unitMultiplier for inputs ends
}

export async function checkUOMAndModifyTemplate() {
  // This function will wait for Knockout to be available and elements to be present on the page
  await new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if (
        typeof window.ko !== 'undefined' &&
        $('.cart-items > tbody > .product-item').length > 0
      ) {
        clearInterval(intervalId)
        resolve()
      }
    }, 100)
  })

  const modifyTemplateForSKU = async () => {
    const elms = await waitForElm('.cart-items > tbody > .product-item')

    // Modify the template to include skuRefIdText, independent of UOM data
    Array.from(elms).map((elm) => {
      const context = window.ko.contextFor(elm)

      if (context) {
        context.$data.constructor.prototype.skuRefIdText = function () {
          return `Part# ${this.skuRefId()}`
        }

        context.$data.constructor.prototype.nameWithNoSKU = function () {
          // Create a regular expression that matches the skuName at the end of the string.
          // The '$' asserts position at the end of a line.
          const regex = new RegExp(`${this.skuName()}$`)

          // Replace the skuName at the end of the name string with an empty string.
          const newName = this.name().replace(regex, '')

          // If newName is an empty string, return the original name.
          // Otherwise, return the name.
          return newName || this.name()
        }
      }
    })

    const cartTemplate = document.querySelector('#cart-item-template')

    cartTemplate.textContent = cartTemplate.textContent
      .replace(
        // add refId to the template
        `<!-- ko if: router.sac.isActive() -->    <strong data-bind="text: name, attr: {'id': 'product-name' + id() }"></strong>    <!-- /ko -->    <!-- ko ifnot: hasParentItemIndex() --> `,
        `<!-- ko if: router.sac.isActive() -->    <strong data-bind="text: name, attr: {'id': 'product-name' + id() }"></strong>    <!-- /ko -->   <div class="ref-id-from-context" data-bind="text:skuRefIdText()"></div> <!-- ko ifnot: hasParentItemIndex() --> `
      )
      .replace(
        // change the name to not have sku attached to it
        `  <!-- ko ifnot: router.sac.isActive() -->    <a href="" data-bind="text: name, attr: {'href': ('//' + location.host + detailUrl()), 'id': 'product-name' + id() }"></a>    <!-- /ko -->  `,
        `  <!-- ko ifnot: router.sac.isActive() -->    <a href="" data-bind="text: nameWithNoSKU(), attr: {'href': ('//' + location.host + detailUrl()), 'id': 'product-name' + id() }"></a>    <!-- /ko -->  `
      )
  }

  await modifyTemplateForSKU()

  const newOrderForm = window?.vtexjs.checkout.orderForm

  const productSpecs = await getProductUoM(newOrderForm.items)

  const addUOMText = async () => {
    const elms = await waitForElm('.cart-items > tbody > .product-item')

    Array.from(elms).map((elm) => {
      const context = window.ko.contextFor(elm)

      if (context) {
        context.$data.constructor.prototype.uomText = function () {
          const productSpec = productSpecs.find((spec) => {
            return spec.productRefId === this.skuRefId()
          })

          if (productSpec) return `/${productSpec.unitOfMeasureCode}`
        }
      }
    })

    const cartTemplate = document.querySelector('#cart-item-template')

    cartTemplate.textContent = cartTemplate.textContent.replace(
      '<span class="new-product-price" data-bind="text: sellingPriceLabel, click: toggleManualPrice"></span>',
      '<span class="new-product-price" data-bind="text: sellingPriceLabel, click: toggleManualPrice"></span> ' +
        '<span data-bind="text:uomText()"></span>'
    )
  }

  await addUOMText()

  // Trigger template update
  window.vtexjs.checkout.getOrderForm().done(() => {})
}

export async function addRefIdsToPaymentPage() {
  // This function will wait for Knockout to be available and elements to be present on the page
  await new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if (
        typeof window.ko !== 'undefined' &&
        document.querySelectorAll(
          '.custom-cart-template-wrap .cart-items .hproduct'
        ).length > 0
      ) {
        clearInterval(intervalId)
        resolve()
      }
    }, 100)
  })

  const addRefsToSummary = async () => {
    const elms = await waitForElm(
      '.custom-cart-template-wrap .cart-items .hproduct'
    )

    Array.from(elms).forEach((elm) => {
      const context = window.ko.contextFor(elm)

      if (context) {
        const skuRefIdText = `Part# ${context.$data.skuRefId()}`

        // Check if the span element has already been added
        if (!elm.querySelector('.refIdSpan')) {
          const refIdSpan = document.createElement('span')

          refIdSpan.textContent = skuRefIdText

          refIdSpan.classList.add('refIdSpan')

          // Append the new element to the current element
          elm.appendChild(refIdSpan)
        } else {
          // If the span already exists and you want to update its content
          const existingSpan = elm.querySelector('.refIdSpan')

          existingSpan.textContent = skuRefIdText
        }
      }
    })
  }

  // Setup the MutationObserver to monitor changes and re-apply if DOM is updated elsewhere
  const targetNode = document.querySelector('.custom-cart-template-wrap')

  if (!targetNode) {
    console.error('Target node for observing not available')

    return
  }

  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.addedNodes.length > 0 ||
        mutation.target?.className.includes(
          'cart-items unstyled clearfix v-loaded'
        )
      ) {
        // Disconnect the observer to avoid an infinite loop
        observer.disconnect()

        await addRefsToSummary()

        observer.observe(targetNode, config)

        break
      }
    }
  })

  // Configuration for the observer: observe everything except attributes
  const config = {
    attributes: false,
    childList: true,
    subtree: true,
  }

  // Start observing the target node with the configured settings
  observer.observe(targetNode, config)

  // Trigger template update
  window.vtexjs.checkout.getOrderForm().done(() => {})
}

function waitForElm(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelectorAll(selector).length > 0) {
      return resolve(document.querySelectorAll(selector))
    }

    const priceObserver = new MutationObserver((_mutations) => {
      if (document.querySelectorAll(selector).length > 0) {
        resolve(document.querySelectorAll(selector))
        observer.disconnect()
      }
    })

    priceObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

const getProductUoM = async (orderFormItems: any[]) => {
  const productIds = orderFormItems.map((product: { id: any }) => product.id)
  const productRefIds = orderFormItems.map(
    (product: { refId: any }) => product.refId
  )

  const productSpecQyResolved = await Promise.all(
    productIds.map((refId: any, index: string | number) =>
      getProductSpecs(refId, productRefIds[index])
    )
  )

  return productSpecQyResolved
}

const getProductSpecs = async (refId: any, productRefId: any) => {
  try {
    const response = await fetch(`/_v/productMinQty/${refId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { unitMultiplier, unitOfMeasureCode } = await response.json()

    return {
      productId: refId,
      productRefId,
      unitMultiplier,
      unitOfMeasureCode,
    }
  } catch (error) {
    return {
      productId: refId,
      unitMultiplier: 1,
    }
  }
}

// when input value changes, round the value to the nearest number divisible by min purchase qty
function updateInputValue(elm: any) {
  const $elm = $(elm)
  const element = $elm.attr('id')
  const ar = element.split('-')
  const mid = ar[ar.length - 1]
  const orderFormItems = window.vtexjs.checkout.orderForm.items.filter(
    (product: { id: string }) => product.id === mid
  )

  const [productId] = orderFormItems.map((product: { id: any }) => product.id)
  const elementValue = $elm.parent().find('input').val() ?? 0
  const productExistsInObservable = unitMultiplierObservable().find(
    (product: { productId: string }) => product.productId === mid
  )

  const orderFormItemsNoShipping = orderFormItems.filter(
    (product: { name: string }) => product.name !== 'Shipping'
  )

  if (unitMultiplierObservable().length === 0 || !productExistsInObservable) {
    getMinPurchaseQty(orderFormItemsNoShipping).then(() => {
      // find value of the min purchase qty for the item from the observable
      const minQty = minPurchQty(productId)
      const newRoundedNumber =
        elementValue < minQty ? minQty : roundNumber(elementValue, minQty)

      $elm.parent().find('input').val(newRoundedNumber).change()

      if (elementValue < minQty) {
        $elm.parent().find('input').val(minQty).change()
      }
    })
  } else if (productExistsInObservable) {
    const minQty = minPurchQty(productId)
    const roundedNumber = roundNumber(Number(elementValue), minQty, 10)

    if (roundedNumber < minQty) {
      $elm.parent().find('input').val(minQty).change()
    } else {
      $elm.parent().find('input').val(roundedNumber).change()
    }
  }
}

const getMinPurchaseQty = async (orderFormItems: any[]) => {
  const productIds = orderFormItems.map((product: { id: any }) => product.id)
  const productRefIds = orderFormItems.map(
    (product: { refId: any }) => product.refId
  )

  const minPurchQyResolved = await Promise.all(
    productIds.map((refId: any, index: string | number) =>
      getProductSpecs(refId, productRefIds[index])
    )
  )

  unitMultiplierObservable(minPurchQyResolved)
}

const minPurchQty = (itemId: any) => {
  const minPurchaseQty = unitMultiplierObservable()

  const itemMinPurchaseQty = minPurchaseQty.find(
    (item: { productId: any }) => item.productId === itemId
  )

  return itemMinPurchaseQty.unitMultiplier
}

const roundNumber = (number: number, multiplier: number) => {
  // if not divisible by min purchase qty, round the number to the nearest number divisible by min purchase qty
  if (number % multiplier !== 0) {
    return Math.round(number / multiplier) * multiplier
  }

  return number
}

function debounce(
  func: { (_e: any): void; apply?: any },
  delay: number | undefined
) {
  let timeoutId: string | number | NodeJS.Timeout | undefined

  return function (...args: any) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

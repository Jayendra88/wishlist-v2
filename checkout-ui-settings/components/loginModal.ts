const createElementWithClass = (tag: string, className: string) => {
  const element = document.createElement(tag)

  element.classList.add(className)

  return element
}

const appendButton = (
  element: HTMLElement,
  url: string,
  buttonText: string
) => {
  const buttonTextEl = document.createElement('a')

  buttonTextEl.href = url
  buttonTextEl.className = 'btn-modal-action'
  buttonTextEl.innerText = buttonText

  element.appendChild(buttonTextEl)
}

const messageMapping = {
  noMarketingData: {
    title: 'Issue with your login credentials',
    message:
      'Please re-input your login credentials so we can get you checked out!',
    buttons: [{ url: '/login', text: 'Log Out' }],
  },
  notApartOfOrg: {
    title: 'No organization is associated with your account',
    message: 'You must be part of an organization to complete an order',
    buttons: [
      { url: '/validate-organization', text: 'Find Organization' },
      { url: '/account#/organization', text: 'Create Organization' },
    ],
  },
  default: {
    title: 'Please login in order to checkout',
    message: 'You must be part of an organization to complete an order',
    buttons: [{ url: '/login', text: 'Login' }],
  },
}

export const attachLoginModal = (loginStatus: string | null) => {
  if (!loginStatus || document.querySelector('.modal__wrapper')) return

  const modalWrapper = createElementWithClass('div', 'modal__wrapper')
  const modalDiv = createElementWithClass('div', 'checkout__modal')
  const modalText = document.createElement('h3')
  const modalMessage = document.createElement('p')
  const modalButtonWrapDiv = createElementWithClass(
    'div',
    'checkout__modal__actions'
  )

  const { title, message, buttons } =
    messageMapping[loginStatus] || messageMapping.default

  modalText.innerText = title
  modalMessage.innerText = message

  const target = document.querySelector('.checkout__header')

  if (!target) return

  target
    .appendChild(modalWrapper)
    .appendChild(modalDiv)
    .append(modalText, modalMessage, modalButtonWrapDiv)

  buttons.forEach((btn: any) =>
    appendButton(modalButtonWrapDiv, btn.url, btn.text)
  )

  appendButton(modalButtonWrapDiv, '#/cart', 'Back to Cart')

  const focusableElements = 'a'
  const firstFocusableElement =
    modalButtonWrapDiv.querySelectorAll(focusableElements)[0]

  const focusableContent =
    modalButtonWrapDiv.querySelectorAll(focusableElements)

  const lastFocusableElement = focusableContent[focusableContent.length - 1]

  document.addEventListener('keydown', (e) => {
    const isTabPressed = e.key === 'Tab' || e.code === 'Tab'

    if (!isTabPressed) {
      return
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus()
        e.preventDefault()
      }
    } else if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus()
      e.preventDefault()
    }
  })

  firstFocusableElement.focus()
}

export const removeLoginModal = () => {
  const target = document.querySelector('.modal__wrapper')

  target?.parentNode?.removeChild(target)
}

const shouldAttachLoginModal = (orderForm: any) => {
  const { loggedIn, marketingData, userType } = orderForm
  const onTargetPage =
    window.location.href.includes('payment') ||
    window.location.href.includes('profile') ||
    window.location.href.includes('email')

  const callCenterOperator =
    userType === 'CALL_CENTER_OPERATOR' || userType === 'callCenterOperator'

  if (!onTargetPage) {
    return 'noAction'
  }

  if (!loggedIn && onTargetPage && !callCenterOperator) {
    return 'loggedOut'
  }

  if (
    (loggedIn || callCenterOperator) &&
    !marketingData?.utmCampaign &&
    onTargetPage
  ) {
    return 'noMarketingData'
  }

  if (!window.b2bCheckoutSettings) {
    return 'notApartOfOrg'
  }

  return 'loggedIn'
}

let retryCount = 0
const MAX_RETRIES = 5
const RETRY_DELAY = 50 // 50ms delay

function checkMarketingData() {
  if (retryCount >= MAX_RETRIES) {
    attachLoginModal('noMarketingData')

    return
  }

  window.vtexjs.checkout.getOrderForm().done((newOrderForm: any) => {
    retryCount++
    handleModalCheckResult(newOrderForm)
  })
}

export function handleModalCheckResult(orderForm: any) {
  const modalCheckResult = shouldAttachLoginModal(orderForm)

  if (
    modalCheckResult === 'loggedOut' ||
    modalCheckResult === 'noMarketingData' ||
    modalCheckResult === 'notApartOfOrg'
  ) {
    if (modalCheckResult === 'noMarketingData') {
      setTimeout(checkMarketingData, RETRY_DELAY)

      return
    }

    attachLoginModal(modalCheckResult)
  } else {
    // Reset the retry count
    retryCount = 0

    // Check if modal__wrapper is in the DOM and remove it
    const target = document.querySelector('.modal__wrapper')

    if (target) {
      removeLoginModal()
    }
  }
}

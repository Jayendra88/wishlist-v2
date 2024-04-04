import 'vtex.styleguide'

declare module 'vtex.styleguide' {
  import type { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }

  export const Button: StorefrontFunctionComponent
  export const Modal: StorefrontFunctionComponent
  export const NumericStepper: StorefrontFunctionComponent
  export const ToastProvider: StorefrontFunctionComponent
  export const ToastConsumer: StorefrontFunctionComponent
}

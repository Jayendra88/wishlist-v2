const digestMessage = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string

  return hashHex
}

export const getHash = async (message: string) => {
  try {
    const hash = await digestMessage(message)

    return hash
  } catch (err) {
    console.error(err)

    return err
  }
}

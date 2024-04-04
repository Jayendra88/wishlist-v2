export const delay = async (seconds: any) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

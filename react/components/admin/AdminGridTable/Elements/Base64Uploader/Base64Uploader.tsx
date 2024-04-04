import React, { useRef } from 'react'
import { Button, useToast } from '@vtex/admin-ui'

import { useXlsUploadContext } from '../XlsUploadModal/XlsUploadContext'
import { getHash } from './getHash'
import styles from './styles.css'

interface Base64UploaderProps {
  buttonText: string
  isHeroImage?: boolean
  categoryIdFromParams: string
}

const Base64Uploader: React.FC<Base64UploaderProps> = ({
  buttonText,
  isHeroImage,
  categoryIdFromParams,
}) => {
  // -----
  // Context
  const {
    imgUrl: { imgUrl, setImgUrl },
    imgUrlHash: { imgUrlHash, setImgUrlHash },
    heroImgUrl: { heroImgUrl, setHeroImgUrl },
    heroImgUrlHash: { heroImgUrlHash, setHeroImgUrlHash },
  } = useXlsUploadContext()

  // ------
  // Toast related config
  const showToast = useToast()

  // ------
  // Input config
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? []
    const fileSize = file.size / 1024 / 1024 // in MiB

    const convertBase64 = (
      imageFile: File
    ): Promise<string | ArrayBuffer | null> => {
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const fileReader = new FileReader()

        fileReader.readAsDataURL(imageFile)

        fileReader.onload = () => {
          resolve(fileReader.result)

          fileUploadRef.current!.value = '' // reset file input
        }

        fileReader.onerror = (error) => {
          reject(error)
        }
      })
    }

    const base64 = await convertBase64(file)

    // only jpg/png images are allowed
    if (
      fileSize > 0.76 &&
      (typeof base64 !== 'string' ||
        !base64.startsWith('data:image/png') ||
        !base64.startsWith('data:image/jpeg'))
    ) {
      showToast({
        message:
          'You can upload a single image of up to 760kb or two images up to 380kb each. Only JPEG/PNG images allowed',
        tone: 'warning',
        duration: 5000,
      })
    } else if (typeof base64 === 'string' && base64.startsWith('data:image')) {
      if (isHeroImage) {
        const imgUrlHashLocal = await getHash(base64)

        setHeroImgUrl(base64)
        setHeroImgUrlHash(imgUrlHashLocal)
      } else {
        const imgUrlHashLocal = await getHash(base64)

        setImgUrl(base64)
        setImgUrlHash(imgUrlHashLocal)
      }
    }
  }

  let currentImgSrc = ''

  // updating a category
  if (categoryIdFromParams) {
    if (isHeroImage) {
      // in case heroImgUrl/imgUrl is boolean, it's coming from the database, in case its a string, it's coming from the upload
      currentImgSrc =
        typeof heroImgUrl === 'boolean'
          ? `/_v/mdCategories/heroImg/${heroImgUrlHash}/${categoryIdFromParams}`
          : heroImgUrl
    } else {
      currentImgSrc =
        typeof imgUrl === 'boolean'
          ? `/_v/mdCategories/img/${imgUrlHash}/${categoryIdFromParams}`
          : imgUrl
    }
    // creating a new category
  } else if (isHeroImage) {
    currentImgSrc = heroImgUrl
  } else {
    currentImgSrc = imgUrl
  }

  // is image shown based on hash and whether it is hero image or not
  const isImageShown = categoryIdFromParams
    ? isHeroImage
      ? heroImgUrlHash
      : imgUrlHash
    : isHeroImage
    ? heroImgUrl
    : imgUrl

  const clearImage = () => {
    if (isHeroImage) {
      setHeroImgUrl('')
      setHeroImgUrlHash('')
    } else {
      setImgUrl('')
      setImgUrlHash('')
    }
  }

  return (
    <div className={styles['image-upload']}>
      <div className="flex">
        <Button
          onClick={() => {
            fileUploadRef.current!.click()
          }}
        >
          {buttonText}
          <input
            type="file"
            ref={fileUploadRef}
            style={{ display: 'hidden' }}
            onChange={uploadImage}
            hidden
          />
        </Button>
        <Button
          onClick={clearImage}
          variant="secondary"
          className={styles['button-remove']}
        >
          Remove
        </Button>
      </div>
      {isImageShown ? (
        <img
          className={styles['image-upload__image']}
          src={currentImgSrc}
          alt="upload"
        />
      ) : null}
    </div>
  )
}

export default Base64Uploader

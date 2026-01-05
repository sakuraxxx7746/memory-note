import imageCompression from 'browser-image-compression'

export async function compressImage(
  file: File,
  maxWidthOrHeight = 1920
): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
  }
  return await imageCompression(file, options)
}

import imageCompression from 'browser-image-compression'

/**
 * テキストをハッシュタグと通常テキストに分割
 * @param content - パースするテキスト
 * @returns 分割された文字列の配列
 */
export function parseContentWithHashtags(content: string): string[] {
  // #の後、半角スペース・全角スペース・改行・#以外の文字にマッチ
  return content.split(/(#[^\s　\n#]+)/g)
}

/**
 * 文字列がハッシュタグかどうかを判定
 * @param text - 判定する文字列
 * @returns ハッシュタグならtrue
 */
export function isHashtag(text: string): boolean {
  return /^#[^\s　\n#]+$/.test(text)
}

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }
  return await imageCompression(file, options)
}

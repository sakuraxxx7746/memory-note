export type ImageItem =
  | { type: 'new'; file: File; previewUrl: string }
  | { type: 'existing'; id: string; url: string }

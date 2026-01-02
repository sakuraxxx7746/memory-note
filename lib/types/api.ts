// API成功レスポンス
export type ApiSuccessResponse<T = void> = {
  success: true
  data?: T
}

// APIエラーレスポンス
export type ApiErrorResponse = {
  success: false
  error: string
}

// API統合レスポンス
export type ApiResponse<T = void> = ApiSuccessResponse<T> | ApiErrorResponse

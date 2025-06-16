export type Gender = 'male' | 'female' | 'other'

export interface RegisterRequest {
  name: string
  countryCode: string
  mobileNumber: string
  emailAddress: string
  DOB: string // ISO date string
  genderId: number
  countryId: number
}

export interface RegisterResponse {
  // We'll add the response type once you provide it
  token?: string
  user?: {
    id: string
    name: string
    email: string
    // Add other user fields as needed
  }
}

export interface SendOtpRequest {
  countryCode: string
  mobileNumber: string
}

export interface VerifyOtpRequest {
  countryCode: string
  mobileNumber: string
  otp: string
}

export interface AuthResponse {
  token?: string
  user?: {
    id: string
    name: string
    mobileNumber: string
    countryCode: string
    // Add other user fields as needed
  }
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

// Common API response wrapper
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: number
  message: string
}

export interface Country {
  id: number
  name: string
  code: string
}

export interface GetCountriesResponse {
  countries: Country[]
} 
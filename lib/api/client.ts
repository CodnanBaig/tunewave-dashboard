import { ApiResponse, RegisterRequest, RegisterResponse, GetCountriesResponse, Country } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        message: data.message || 'An error occurred',
        error: {
          message: data.message || 'An error occurred',
          status: response.status,
          code: data.code,
        },
      }
    }

    return {
      status: response.status,
      message: data.message || 'Success',
      data: data as T,
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Network error occurred',
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 500,
      },
    }
  }
}

export const api = {
  user: {
    register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
      return fetchApi<RegisterResponse>('/user/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    getCountries: async (): Promise<ApiResponse<GetCountriesResponse>> => {
      return fetchApi<GetCountriesResponse>('/user/getcountry', {
        method: 'GET',
      })
    },
  },
} 
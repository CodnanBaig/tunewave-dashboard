"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'USD' | 'INR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')

  // Load currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'INR')) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const formatAmount = (amount: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 
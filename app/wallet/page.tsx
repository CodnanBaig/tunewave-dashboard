"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { IndianRupee, Wallet, ArrowUpRight } from "lucide-react"

type TransactionStatus = "completed" | "pending" | "failed"
type TransactionType = "withdrawal" | "deposit"

interface Transaction {
  id: number
  date: string
  amount: number
  status: TransactionStatus
  type: TransactionType
}

interface WalletData {
  balance: number
  transactions: Transaction[]
}

// Mock data - In a real app, this would come from an API
const mockWalletData: WalletData = {
  balance: 2500,
  transactions: [
    {
      id: 1,
      date: "2024-03-15T10:30:00",
      amount: 1500,
      status: "completed" as TransactionStatus,
      type: "withdrawal" as TransactionType
    },
    {
      id: 2,
      date: "2024-03-10T14:20:00",
      amount: 500,
      status: "completed" as TransactionStatus,
      type: "deposit" as TransactionType
    },
    {
      id: 3,
      date: "2024-03-05T09:15:00",
      amount: 2000,
      status: "pending" as TransactionStatus,
      type: "withdrawal" as TransactionType
    }
  ]
}

const statusColors: Record<TransactionStatus, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

export default function WalletPage() {
  const { toast } = useToast()
  const [walletData, setWalletData] = useState(mockWalletData)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      // In a real app, this would make an API call to process the withdrawal
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // Update wallet balance and add new transaction
      const newTransaction = {
        id: walletData.transactions.length + 1,
        date: new Date().toISOString(),
        amount: walletData.balance,
        status: "pending" as TransactionStatus,
        type: "withdrawal" as TransactionType
      }
      
      setWalletData({
        balance: 0,
        transactions: [newTransaction, ...walletData.transactions]
      })

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      })
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div className="w-full px-6 py-6 space-y-6">
      {/* Balance Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Your current available balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <IndianRupee className="h-6 w-6" />
            <span className="text-4xl font-bold">{walletData.balance.toLocaleString()}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleWithdraw}
            disabled={walletData.balance < 1000 || isWithdrawing}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
          >
            {isWithdrawing ? (
              "Processing..."
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw Funds
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Transaction History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletData.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[transaction.status]}`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
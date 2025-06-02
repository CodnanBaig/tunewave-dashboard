"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function LegalPage() {
  return (
    <div className="bg-dark rounded-md container mx-auto py-6">
      {/* <Card> */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Youtube Requests</h2>
      </div>
        {/* <CardContent> */}
          <div className="bg-darkrounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Id</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Other Party</TableHead>
                  <TableHead>UPC</TableHead>
                  <TableHead>ISRC</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="mb-2 text-muted-foreground"><rect width="40" height="40" rx="8" fill="#F3F4F6"/><path d="M13 18.5C13 17.1193 14.1193 16 15.5 16H24.5C25.8807 16 27 17.1193 27 18.5V25.5C27 26.8807 25.8807 28 24.5 28H15.5C14.1193 28 13 26.8807 13 25.5V18.5Z" stroke="#A1A1AA" strokeWidth="2"/><path d="M17 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/><path d="M23 14V16" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
    </div>
  )
} 
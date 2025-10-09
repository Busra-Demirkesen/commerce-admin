"use client"

import { ColumnDef } from "@tanstack/react-table"




export type OrderColumn = {
  userEmail: string;
  id: string;
  phone: string;
  address: string;
  isPaid : boolean;
  totalPrice: string;
  products: string;
  createdAt: string;

}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "userEmail",
    header: "Customer Email",
  },
   {
    accessorKey: "phone",
    header: "Phone",
  },
   {
    accessorKey: "address",
    header: "Address",
  },
   {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
   
]
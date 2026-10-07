"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action";


export type ProductColumn = {
  
  id: string;
  name: string;
  price: string;
  stock: number;
  size:string;
  category:string;
  color:string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;

}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
  accessorKey: "color",
  header: "Color",
  cell: ({ row }) => {
    return (
      <div className="flex items-center gap-x-2">
        <span>{row.original.color}</span>
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    );
  },
},

  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",

  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>,
  },
 
]
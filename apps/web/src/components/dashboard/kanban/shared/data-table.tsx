"use client";

import {
  type ColumnDef,
  FlexRender,
  type Row,
  type RowData,
  type TableFeatures,
  type TableOptions,
  useTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData extends RowData, TValue> {
  features: TableFeatures;
  columns: ColumnDef<TableFeatures, TData, TValue>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  emptyMessage?: string;
  renderRow?: (row: Row<TableFeatures, TData>, index: number) => ReactNode;
  onAddNew: () => void;
}

const DataTable = <TData extends RowData, TValue>({
  features,
  columns,
  data,
  getRowId,
  emptyMessage = "No results.",
  renderRow,
  onAddNew,
}: DataTableProps<TData, TValue>) => {
  const table = useTable({
    features,
    columns,
    data,
    ...(getRowId ? { getRowId } : {}),
  } as TableOptions<TableFeatures, TData>);

  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className={"bg-accent"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, index) =>
              renderRow ? (
                renderRow(row, index)
              ) : (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className={"bg-transparent"}>
          <TableRow>
            <TableCell colSpan={columnCount}>
              <Button variant={"ghost"} onClick={onAddNew}>
                <LuPlus /> Add Task
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DataTable;

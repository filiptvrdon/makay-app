"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export type ColumnDefinition<T> = {
  // Header label or custom node
  header: React.ReactNode;
  // Optional accessor key for simple value rendering
  key?: keyof T;
  // Optional custom cell renderer; if provided it takes precedence over `key`
  cell?: (item: T, index: number) => React.ReactNode;
  // Optional classes for header and cell
  thClassName?: string;
  tdClassName?: string;
};

export type GenericTableProps<T> = {
  data: T[] | null | undefined;
  columns: ColumnDefinition<T>[];
  // Empty state message when there are no rows
  emptyMessage?: string;
  // Derives a unique key per row; by default tries `id` if present, otherwise uses the index
  rowKey?: (item: T, index: number) => React.Key;
  // Optional row className (can be static or derived per row)
  rowClassName?: string | ((item: T, index: number) => string | undefined);
  // Optional table section wrapper classNames to fine-tune layout
  sectionClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
};

/**
 * GenericTable
 *
 * Renders a table using the shared UI primitives and a simple column definition.
 *
 * Example usage:
 * ```tsx
 * <GenericTable
 *   data={athletes}
 *   columns=[
 *     { header: "Name", cell: (a) => (
 *         <Link href={`/coach/athletes/${a.id}`} className="text-slate-100 text-sm">
 *           {a.name ?? "(no name)"}
 *         </Link>
 *       ), thClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400", tdClassName: "px-4 py-3 align-top" },
 *     { header: "Athlete ID", cell: (a) => (
 *         <Link href={`/coach/athletes/${a.id}`} className="text-xs text-slate-400">
 *           <code className="select-all break-all">{a.id}</code>
 *         </Link>
 *       ), thClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400", tdClassName: "px-4 py-3 align-top" },
 *     { header: "Created", cell: (a) => (
 *         <span className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString()}</span>
 *       ), thClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400", tdClassName: "px-4 py-3 align-top" },
 *   ]}
 *   emptyMessage="No athletes found."
 * />
 * ```
 */
export function GenericTable<T>(props: GenericTableProps<T>) {
  const {
    data,
    columns,
    emptyMessage = "No data found.",
    rowKey,
    rowClassName,
    sectionClassName,
    tableClassName,
    headerClassName,
    bodyClassName,
  } = props;

  const getRowKey = React.useCallback(
    (item: T, index: number): React.Key => {
      if (rowKey) return rowKey(item, index);
      // Try common `id` field if present
      const maybeAny = item as unknown as { id?: React.Key };
      return maybeAny && typeof maybeAny.id !== "undefined" ? maybeAny.id! : index;
    },
    [rowKey]
  );

  const resolveRowClass = (item: T, index: number) =>
    typeof rowClassName === "function" ? rowClassName(item, index) : rowClassName;

  return (
    <section className={cn("rounded-lg border border-slate-800 overflow-hidden", sectionClassName)}>
      <Table className={cn("min-w-full divide-y divide-slate-800", tableClassName)}>
        <TableHeader className={cn("bg-slate-900/60", headerClassName)}>
          <TableRow>
            {columns.map((col, ci) => (
              <TableHead
                key={ci}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400",
                  col.thClassName
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className={cn("divide-y divide-slate-800 bg-slate-900/20", bodyClassName)}>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, ri) => (
              <TableRow
                key={getRowKey(item, ri)}
                className={cn("hover:bg-slate-900/40", resolveRowClass(item, ri))}
              >
                {columns.map((col, ci) => (
                  <TableCell key={ci} className={cn("px-4 py-3 align-top", col.tdClassName)}>
                    {col.cell
                      ? col.cell(item, ri)
                      : col.key
                      ? String((item as any)[col.key] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
}

export default GenericTable;

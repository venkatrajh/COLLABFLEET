import React from 'react';

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedId?: string | null;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedId,
  emptyMessage = 'No records found.',
  isLoading = false
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-white border border-[#E5E4DE] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#EBEAE5] text-neutral-500 uppercase tracking-wider font-bold">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 sm:px-5 font-bold text-[11px] ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEAE5]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-neutral-400 font-medium">
                  Loading operational data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-neutral-500 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedId === key;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-all duration-200 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      isSelected
                        ? 'bg-[#F2F1EC] text-[#111111] font-semibold border-l-4 border-l-black shadow-sm'
                        : 'hover:bg-[#FAF9F6] text-neutral-800'
                    }`}
                  >
                    {columns.map((col, idx) => {
                      let cellContent: React.ReactNode = null;
                      if (typeof col.accessor === 'function') {
                        cellContent = col.accessor(item);
                      } else if (col.accessor) {
                        cellContent = (item as any)[col.accessor];
                      }

                      return (
                        <td key={idx} className={`py-3.5 px-4 sm:px-5 ${col.className || ''}`}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && data.length > 0 && (
        <div className="px-5 py-2.5 bg-[#FAF9F6] border-t border-[#EBEAE5] text-[11px] text-neutral-500 font-mono flex items-center justify-between">
          <span>Showing {data.length} operational records</span>
          <span className="font-semibold text-neutral-700">COLLABFLEET Network Feed</span>
        </div>
      )}
    </div>
  );
}

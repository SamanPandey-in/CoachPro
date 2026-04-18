import React from 'react';

const DataTable = ({ columns, rows, emptyMessage = 'No data found' }) => (
  <div className="overflow-x-auto rounded-card border border-border dark:border-border-dark">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border dark:divide-border-dark">
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-10 text-center text-text-muted dark:text-text-muted-dark"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => (
            <tr
              key={idx}
              className="bg-surface dark:bg-surface-dark hover:bg-bg dark:hover:bg-bg-dark transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-text-primary dark:text-text-primary-dark">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;

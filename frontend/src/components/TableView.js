import React from 'react';

function TableView({ columns, data }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>{item[col] || 'N/A'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableView;
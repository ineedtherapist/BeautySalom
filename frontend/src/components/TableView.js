import React from 'react';

function TableView({ columns, data }) {
    if (!Array.isArray(data) || data.length === 0) {
        return <p>No data available to display.</p>; // Виводимо повідомлення, якщо даних немає
    }

    return (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
                {columns.map((col) => (
                    <th
                        key={col}
                        style={{
                            border: "1px solid #ddd",
                            textAlign: "left",
                            padding: "8px",
                        }}
                    >
                        {col}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr
                    key={index}
                    style={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                >
                    {columns.map((col) => (
                        <td
                            key={col}
                            style={{
                                border: "1px solid #ddd",
                                textAlign: "left",
                                padding: "8px",
                            }}
                        >
                            {item[col] || "N/A"}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TableView;
import React from 'react';

interface TableProps {
    headers: string[];
    data: (string | number)[][];
}

const Table: React.FC<TableProps> = ({ headers, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 bg-gray-100 text-left border-b">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

import React from 'react';
import { type CompanyEntity } from 'src/backend/database/company/company-entity';

type ClientsRowProps = {
    data: CompanyEntity[];
    columnHeaders: string[];
};

export const TrialsRow = ({ data, columnHeaders }: ClientsRowProps) => {
    return (
        <tbody className="divide-y divide-gray-100">
            {data.map((company: CompanyEntity) => {
                const dataPoints = [
                    company.cusId,
                    `${company.profiles?.[0].firstName} ${company.profiles?.[0].lastName}`,
                    company.profiles?.[0].phone,
                    company.profiles?.[0].email,
                    company.name,
                ];
                return (
                    <tr key={dataPoints[0]} className="hover:bg-gray-100">
                        {dataPoints.map((dataPoint, index) => (
                            <td
                                key={columnHeaders[index] + dataPoint}
                                className="max-w-[400px] whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                            >
                                {dataPoint?.toString()}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};

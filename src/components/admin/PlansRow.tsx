import React from 'react';
import { Button } from '../button';
import { type PlanSummary } from 'types/plans';

type ClientsRowProps = {
    data: PlanSummary[];
    columnHeaders: string[];
    setManageData?: (data: PlanSummary) => void;
};

export const PlansRow = ({ data, columnHeaders, setManageData }: ClientsRowProps) => {
    return (
        <tbody className="divide-y divide-gray-100">
            {data.map((plan: PlanSummary) => {
                const [firstDetail] = plan.details;
                const dataPoints = [
                    plan.itemName,
                    plan.priceType.replace(/-/g, ' ').toUpperCase(),
                    plan.billingPeriod.replace(/-/g, ' ').toUpperCase(),
                    plan.profiles,
                    plan.searches,
                    plan.exports,
                    firstDetail?.isActive ? 'Active' : 'Inactive',
                    'Manage',
                ];
                return (
                    <tr key={firstDetail.id} className=" hover:bg-gray-100">
                        {dataPoints.map((dataPoint, index) => (
                            <td
                                key={columnHeaders[index] + dataPoint}
                                className="max-w-[400px] overflow-scroll whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                            >
                                {columnHeaders[index] === 'Manage' ? (
                                    <Button onClick={() => setManageData && setManageData(plan)}>{dataPoint}</Button>
                                ) : (
                                    dataPoint?.toString()
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};

import React from 'react';
import { type PlanEntity } from 'src/backend/database/plan/plan-entity';
import { Button } from '../button';

type ClientsRowProps = {
    data: PlanEntity[];
    columnHeaders: string[];
    setManageData?: (data: PlanEntity) => void;
};

export const PlansRow = ({ data, columnHeaders, setManageData }: ClientsRowProps) => {
    return (
        <tbody className="divide-y divide-gray-100">
            {data.map((plan: PlanEntity) => {
                const dataPoints = [
                    plan.itemName,
                    plan.priceType.replace(/-/g, ' ').toUpperCase(),
                    plan.billingPeriod.replace(/-/g, ' ').toUpperCase(),
                    plan.price,
                    plan.currency.replace(/-/g, ' ').toUpperCase(),
                    plan.priceId,
                    plan.originalPrice,
                    plan.originalPriceId,
                    plan.existingUserPrice,
                    plan.existingUserPriceId,
                    plan.profiles,
                    plan.searches,
                    plan.exports,
                    plan.isActive ? 'Active' : 'Inactive',
                    'Manage',
                ];
                return (
                    <tr key={plan.id} className=" hover:bg-gray-100">
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

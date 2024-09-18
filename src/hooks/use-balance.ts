/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BalanceType, type BalanceEntity } from 'src/backend/database/balance/balance-entity';
import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';

type CompanyBalanceType = {
    [BalanceType.PROFILE]: number;
    [BalanceType.SEARCH]: number;
};

export const useBalance = () => {
    const { apiClient, loading } = useApiClient();
    const [balance, setBalance] = useState<CompanyBalanceType>({
        [BalanceType.PROFILE]: 0,
        [BalanceType.SEARCH]: 0,
    });

    const getCompanyBalance = async () => {
        const [err, data] = await awaitToError(apiClient.get<BalanceEntity[]>(`/v2/balances`));
        if (err) {
            return;
        }
        const d = data.data
            .map((balance) => ({ [balance.type as BalanceType]: +balance.amount }))
            .reduce((acc, val) => ({ ...acc, ...val }), {}) as CompanyBalanceType;
        setBalance(d);
    };
    useEffect(() => {
        getCompanyBalance();
    }, []);
    return {
        balance,
        loading,
    };
};

import { useQuery } from '@tanstack/react-query';
import { bank } from '../../api/bank/bank';

const bankKeys = {
    key: ['bank'] as const,
    lists: () => [...bankKeys.key, 'lists'] as const,
};

export const useBanks = () => {
    return useQuery({
        queryKey: bankKeys.lists(),
        queryFn: () => bank.getBanks(),
    });
};

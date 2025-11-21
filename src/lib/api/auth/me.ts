import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { useQuery, queryOptions } from "@tanstack/react-query";

export interface CurrentUserResponse {
  id: string;
  fullname?: string;
  email: string;
  role: string;
}

export const getUser = async () => {
  const response = await api.get<CurrentUserResponse>("/auth/me");
  return response.data;
};

export const getUserQueryKey = () => ["current-user"];

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: getUserQueryKey(),
    queryFn: getUser,
  });
};

interface UseGetUserParams {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
}

export const useGetUser = (params: UseGetUserParams = {}) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...params.queryConfig,
  });
};

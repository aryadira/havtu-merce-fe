import { ProfileSchema } from "@/src/app/(public)/profile/schema";
import api from "@/src/lib/axios";
import { MutationConfig, queryClient } from "@/src/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { getAuthUserQueryKey } from "./auth";

// --- Types ---
// (No specific response types defined in the original file, reusing basic types)

// --- Update User ---
interface UseUpdateUserParams {
  mutationConfig?: MutationConfig<typeof updateUser>;
}

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: ProfileSchema;
}) => {
  const response = await api.put(`/users`, data);
  return response.data;
};

export const useUpdateUser = (params: UseUpdateUserParams = {}) => {
  return useMutation({
    mutationFn: updateUser,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: getAuthUserQueryKey(),
      });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

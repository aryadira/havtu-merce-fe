import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function usePagination(initialPage = 1, initialLimit = 10) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or fallback to initial values
  const page = Number(searchParams.get("page")) || initialPage;
  const limit = Number(searchParams.get("limit")) || initialLimit;

  // Helper to create a new query string
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setPage = (newPage: number) => {
    router.push(`${pathname}?${createQueryString("page", newPage.toString())}`);
  };

  const setLimit = (newLimit: number) => {
    router.push(
      `${pathname}?${createQueryString("limit", newLimit.toString())}`
    );
  };

  const next = (meta: any) => {
    if (meta?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const prev = (meta: any) => {
    if (meta?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const reset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    page,
    limit,
    setPage,
    setLimit,
    next,
    prev,
    reset,
  };
}

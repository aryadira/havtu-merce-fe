import { useState } from "react";

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handleNext = (canNext: boolean) => {
    if (canNext) setPage((p) => p + 1);
  };

  const handlePrev = (canPrev: boolean) => {
    if (canPrev && page > 1) setPage((p) => p - 1);
  };

  const reset = () => setPage(1);

  return {
    page,
    limit,
    setPage,
    setLimit,
    handleNext,
    handlePrev,
    reset,
  };
}

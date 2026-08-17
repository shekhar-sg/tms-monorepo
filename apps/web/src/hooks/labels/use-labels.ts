import { useQuery } from "@tanstack/react-query";

import { getLabels } from "@/lib/api/labels-api";

const labelKeys = {
  all: ["labels"] as const,
};

export const useLabels = () => {
  return useQuery({
    queryKey: labelKeys.all,
    queryFn: () => getLabels(),
  });
};

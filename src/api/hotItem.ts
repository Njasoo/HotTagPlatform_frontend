import request from "./request";

export const getHotItems = (source: string, category?: string) => {
  return request.get("hot/", {
    params: {
      source: source,
      category: category,
    },
  });
};

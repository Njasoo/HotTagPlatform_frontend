import request from "./request";

export const getHotItems = (
  source: string,
  categories?: string[],
  page?: number
) => {
  const params = new URLSearchParams();
  params.append("source", source);
  categories?.forEach((c) => {
    params.append("categories", c);
  });
  if (page) {
    params.append("page", String(page)); // 第二个参数一定要是字符串类型的
  }
  // 生成的 URL 例子: hot/?source=哔哩哔哩&categories=文化&categories=财经
  return request.get(`hot/?${params.toString()}`);
};

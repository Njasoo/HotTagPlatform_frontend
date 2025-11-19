import request from "./request";

export const get_wordcloud_url = (source: string) => {
  return request.get("wordcloud/", {
    params: {
      source: source,
    },
  });
};

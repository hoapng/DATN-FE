import { sendRequest } from "./api";
import Filter from "bad-words";

export const getBadWords = async () => {
  const res = (await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/badwords`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  })) as any;

  if (res.data && res.data.result) {
    return res.data.result.map((x: any) => x.word);
  }
};

export const clean = async (value: string) => {
  const customFilter = new Filter({
    list: await getBadWords(),
    splitRegex: /(?:(?<= )|(?= )|(?<=<)|(?=<)|(?<=>)|(?=>)|(?<=&)|(?=&))/g,
  });
  return customFilter.clean(value);
};

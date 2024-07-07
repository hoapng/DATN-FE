import { useState, useEffect } from "react";
import { getBadWords } from "./filter";
import Filter from "bad-words";

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

export const useFilter = () => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    const temp = await getBadWords();
    setList(temp);
  };
  useEffect(() => {
    fetchList();
  }, []);
  const customFilter = new Filter({
    list: list,
    splitRegex: /(?:(?<= )|(?= )|(?<=<)|(?=<)|(?<=>)|(?=>)|(?<=&)|(?=&))/g,
  });
  return customFilter;
};

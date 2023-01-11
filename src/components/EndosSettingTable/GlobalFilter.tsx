import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { SEARCH_DEBOUNCE } from "../../constants";
import Searchbar from "../Searchbar";

interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}
export const GlobalFilter = ({ filter, setFilter }: Props) => {
  const [value, setValue] = useState(filter);
  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, SEARCH_DEBOUNCE);
  return (
    <span>
      <Searchbar
        query={value || ""}
        onChange={(text) => {
          setValue(text);
          onChange(text);
        }}
        placehodler="Input Endoscope Serial Number"
      />
    </span>
  );
};

import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteOption } from "./Autocomplete";

const Settings = () => {
  const [startInput, setStartInput] = useState("");
  const [startArticle, setStartArticle] = useState<AutocompleteOption>();
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  useEffect(() => {
    if (startInput === "1") {
      setOptions([
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        {
          text: "sdfsdfs dfsd fsdf sdfsdf sdfsd fsdf sd f sdfsdf sdf sdfs dfsdf sdf sdfsdf sdsdf sdf ",
          id: 3,
        },
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        {
          text: "sdfsdfs dfsd fsdf sdfsdf sdfsd fsdf sd f sdfsdf sdf sdfs dfsdf sdf sdfsdf sdsdf sdf ",
          id: 3,
        },
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        {
          text: "sdfsdfs dfsd fsdf sdfsdf sdfsd fsdf sd f sdfsdf sdf sdfs dfsdf sdf sdfsdf sdsdf sdf ",
          id: 3,
        },
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        {
          text: "sdfsdfs dfsd fsdf sdfsdf sdfsd fsdf sd f sdfsdf sdf sdfs dfsdf sdf sdfsdf sdsdf sdf ",
          id: 3,
        },
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        {
          text: "sdfsdfs dfsd fsdf sdfsdf sdfsd fsdf sd f sdfsdf sdf sdfs dfsdf sdf sdfsdf sdsdf sdf ",
          id: 3,
        },
      ]);
    }
  }, [startArticle, startInput]);
  return (
    <div className="ml-4">
      <div>{startInput}</div>
      <span>About {startArticle?.id}</span>
      <Autocomplete
        onSelect={setStartArticle}
        options={options}
        setInputValue={setStartInput}
        label="Select things"
        placeholder="Start typing"
      />
    </div>
  );
};

export default Settings;

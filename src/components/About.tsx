import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteOption } from "./Autocomplete";

const About = () => {
  const [startInput, setStartInput] = useState("");
  const [startArticle, setStartArticle] = useState<AutocompleteOption>();
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  useEffect(() => {
    if (startInput === "1") {
      setOptions([
        { text: "123", id: 1 },
        { text: "1234", id: 2 },
        { text: "sdfsdf", id: 3 },
      ]);
    }
  }, [startArticle, startInput]);
  return (
    <div>
      <div>{startInput}</div>
      <span>About {startArticle?.id}</span>
      <Autocomplete
        onSelect={setStartArticle}
        options={options}
        setInputValue={setStartInput}
      />
    </div>
  );
};

export default About;

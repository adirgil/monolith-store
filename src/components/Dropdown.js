import React, { useState } from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";

export default function Dropdown({ labels, title, onChangeAttribute, id }) {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    const data = event.target.value;
    setSelected(data);
    const foundLabel = labels.find((label) => label.data === data);
    onChangeAttribute(id, foundLabel ? foundLabel.id : "none");
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">{title}</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={selected}
        label={title}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {labels &&
          labels.map((label) => {
            const { title, data, id } = label;
            return (
              <MenuItem key={id} value={data}>
                {title}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}

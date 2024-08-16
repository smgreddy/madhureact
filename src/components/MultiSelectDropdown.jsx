import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Box } from '@mui/material';

const MultiSelectDropdown = ({ label, options, selectedValues, setSelectedValues }) => {
  const handleChange = (event) => {
    setSelectedValues(event.target.value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
      >
        {options.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.name} {option.price}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;

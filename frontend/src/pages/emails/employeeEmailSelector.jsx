import React, { useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';

const EmployeeEmailSelector = ({ selectedRecipients, setSelectedRecipients }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/nonadmin/')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }
        const formatted = data.map(emp => ({
          id: emp.employeeID,
          label: `${emp.firstName} ${emp.lastName} (${emp.role})`,
          email: emp.email,
          role: emp.role,
        }));
        setEmployees(formatted);
        setLoading(false);
      });
  }, []);

  const receptionistOption = {
    id: 'all-receptionists',
    label: 'All Receptionists',
    email: null,
    role: 'Receptionist',
  };

  const filterOptions = (options, { inputValue }) => {
    const filtered = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        opt.email?.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (
      inputValue.toLowerCase().includes('al') &&
      !filtered.some((opt) => opt.id === 'all-receptionists')
    ) {
      filtered.unshift(receptionistOption);
    }

    return filtered;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Autocomplete
        multiple
        options={employees}
        value={selectedRecipients}
        onChange={(e, newValue) => setSelectedRecipients(newValue)}
        loading={loading}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.label}
        renderTags={(value, getTagProps) => {
          const maxVisible = 3;
          return [
            ...value.slice(0, maxVisible).map((option, index) => (
              <Chip
                key={option.id}
                label={option.label}
                {...getTagProps({ index })}
                sx={{
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: '#333',
                  '& .MuiChip-deleteIcon': {
                    color: '#999',
                  },
                }}
              />
            )),
            value.length > maxVisible && (
              <Chip
                key="more"
                label={`+${value.length - maxVisible} more`}
                sx={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: '#555',
                }}
              />
            )
          ];
        }}
        
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Type employee name or email"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: false,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderBottom: '2px solid #ccc',
                borderRadius: 0,
                paddingBottom: '4px',
                '&:hover': {
                  borderBottom: '2px solid #999',
                },
                '&.Mui-focused': {
                  borderBottom: '2px solid #1976d2',
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default EmployeeEmailSelector;
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, CircularProgress } from '@mui/material';

const UniversalEmailSelector = ({ selectedRecipients, setSelectedRecipients }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, patRes] = await Promise.all([
          fetch('http://localhost:5001/api/employees'),
          fetch('http://localhost:5001/api/pati'),
        ]);
        const employees = await empRes.json();
        const patients = await patRes.json();

        const formatted = [
          ...employees.map(e => ({
            id: e.employeeID,
            label: `${e.firstName} ${e.lastName} (${e.role})`,
            email: e.email,
            role: e.role,
            type: 'employee',
          })),
          ...patients.map(p => ({
            id: p.patientID,
            label: `${p.firstName} ${p.lastName} (Patient)`,
            email: p.email,
            type: 'patient',
          })),
        ];

        setOptions(formatted);
      } catch (err) {
        console.error('Error fetching recipients', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={option => option.label}
      value={selectedRecipients}
      onChange={(e, newValue) => setSelectedRecipients(newValue)}
      loading={loading}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={`${option.type}-${option.id}`}
            label={option.label}
            {...getTagProps({ index })}
            sx={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: '#333',
              '& .MuiChip-deleteIcon': { color: '#999' },
            }}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          
          placeholder="Select recipients"
          variant="standard"
          InputProps={{
            ...params.InputProps,
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
              '&:hover': { borderBottom: '2px solid #999' },
              '&.Mui-focused': { borderBottom: '2px solid #1976d2' },
            },
            '& label.Mui-focused': { color: '#1976d2' },
          }}
        />
      )}
    />
  );
};

export default UniversalEmailSelector;
import React, { useState } from 'react';
import { useApiData } from '@/hooks/use-api-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option {
  value: string,
  label: string
}

interface SelectCoachingSessionProps {
  url: string,
  params?: Record<string, string>,
  onChange: (value: string) => void,
  placeholder?: string
}

export function SelectCoachingSession({ url, params = {}, onChange, placeholder = "Select an option" }: SelectCoachingSessionProps) {
  const { data, isLoading, error } = useApiData<Option[]>(url, params);
  const [value, setValue] = useState<string>('');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data && data.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import * as React from "react";
import { PopoverProps } from "@radix-ui/react-popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "@/styles/code-block.scss";

interface ProgrammingLanguageSelectorProps extends PopoverProps {
  languages: string[];
  placeholder: string;
  onSelect: (language: string) => void;
}

export function ProgrammingLanguageSelector({
  languages,
  placeholder,
  onSelect,
  ...props
}: ProgrammingLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<string>(placeholder);

  return (
    <Select
      onValueChange={(language) => {
        setSelectedLanguage(language);
        onSelect(language);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={selectedLanguage}>
          {selectedLanguage}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language, index) => (
          <SelectItem key={index.toString()} value={language}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

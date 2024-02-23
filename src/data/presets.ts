export interface Preset {
    id: string
    date_time: string
  }
  
  export const current: Preset[] = [
    {
      id: "7cb0e66a-9937-465d-a188-2c4c4ae2401f",
      date_time: "February 14, 2024 @ 1PM (CST)",
    },
  ]

  export const future: Preset[] = [
    {
      id: "8cb0e66a-9937-465d-a188-2c4c4ae2401g",
      date_time: "February 28, 2024 @ 1PM (CST)",
    },
    {
      id: "61eb0e32-2391-4cd3-adc3-66efe09bc0b7",
      date_time: "March 5, 2024 @ 3PM (CST)",
    },
    {
      id: "a4e1fa51-f4ce-4e45-892c-224030a00bdd",
      date_time: "March 12, 2024 @ 1PM (CST)",
    },
  ]

  export const past: Preset[] = [
    {
      id: "9cb0e66a-9937-465d-a188-2c4c4ae2401h",
      date_time: "January 25, 2024 @ 1PM (CST)",
    },
  ]
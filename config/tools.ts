export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

export const CATEGORIES = [
  "Beautifiers & Minifiers",
  "Code Converters",
  "Utilities & Encoders",
  "Image & PDF Tools",
] as const;

export const TOOLS: Tool[] = [
  {
    id: "json-beautifier",
    name: "JSON Beautifier",
    slug: "json-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format, beautify, and validate JSON code online for better readability.",
  },
  {
    id: "css-minifier",
    name: "CSS Minifier",
    slug: "css-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress and minify CSS code by removing white spaces and comments.",
  },
  {
    id: "csv-to-json",
    name: "CSV to JSON Converter",
    slug: "csv-to-json",
    category: "Code Converters",
    description: "Convert CSV data into clean, structured JSON format instantly.",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder & Decoder",
    slug: "base64-encoder-decoder",
    category: "Utilities & Encoders",
    description: "Encode text strings or decode Base64 strings safely online.",
  },
];
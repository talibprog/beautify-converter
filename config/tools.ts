export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

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
  {
    id: "sip-calculator",
    name: "SIP Calculator",
    slug: "sip-calculator",
    category: "Calculators",
    description: "Calculate expected returns on your Systematic Investment Plan (SIP) investments.",
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    slug: "json-validator",
    category: "Validators", // <--- Updated category
    description: "Validate JSON structure online and detect syntax errors instantly.",
  },
  {
    id: "js-beautifier",
    name: "JavaScript Beautifier",
    slug: "js-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format, beautify, and un-minify obfuscated JavaScript code for better readability.",
  },
  {
    id: "csv-to-html-table",
    name: "CSV to HTML Table Converter",
    slug: "csv-to-html-table",
    category: "Code Converters",
    description: "Convert raw CSV spreadsheet data into semantic, structured HTML table elements instantly.",
  },
];

// DYNAMIC CATEGORIES: Jo bhi category TOOLS array me hogi, auto-extract ho jayegi
export const CATEGORIES = Array.from(
  new Set(TOOLS.map((tool) => tool.category))
);
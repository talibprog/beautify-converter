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
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    slug: "png-to-jpg-converter",
    category: "Image Converters",
    description: "Convert PNG images to JPG format online for free with quality control and smaller file sizes.",
  },
  {
    id: "my-ip-finder",
    name: "My IP Address Finder",
    slug: "my-ip-finder",
    category: "IP & Domain Tools",
    description: "Instantly find your public IPv4/IPv6 address, ISP details, network organization, and geographic location.",
  },
  {
    id: "dns-lookup",
    name: "Online DNS Lookup Tool",
    slug: "dns-lookup",
    category: "IP & Domain Tools",
    description: "Perform quick DNS record lookups for A, AAAA, MX, TXT, NS, and CNAME records of any domain.",
  },
  {
    id: "domain-age-checker",
    name: "Domain Age & Expiry Checker",
    slug: "domain-age-checker",
    category: "IP & Domain Tools",
    description: "Check exact domain creation date, expiration date, age, and registrar information instantly.",
  },
  {
    id: "ip-subnet-calculator",
    name: "IP Subnet Calculator",
    slug: "ip-subnet-calculator",
    category: "IP & Domain Tools",
    description: "Calculate network address, subnet mask, broadcast address, and usable host ranges for CIDR notation.",
  },
  {
    id: "ssl-checker",
    name: "SSL Certificate Checker",
    slug: "ssl-checker",
    category: "IP & Domain Tools",
    description: "Check SSL/TLS certificate validity, issuer information, active status, and remaining days before expiration.",
  },
  {
    id: "html-minifier",
    name: "HTML Minifier",
    slug: "html-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress HTML markup by stripping out whitespace, unnecessary comments, and line breaks to boost page load speed.",
  },
  {
    id: "html-beautifier",
    name: "HTML Beautifier",
    slug: "html-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format and indent messy or minified HTML code with clean spacing and proper DOM tag structure.",
  },
  {
    id: "javascript-minifier",
    name: "JavaScript Minifier",
    slug: "javascript-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress JS code by removing comments, whitespace, and unnecessary formatting to reduce script load times.",
  },
  {
    id: "javascript-obfuscator",
    name: "JavaScript Obfuscator",
    slug: "javascript-obfuscator",
    category: "Beautifiers & Minifiers",
    description: "Protect client-side JavaScript code by turning readable script logic into unreadable obfuscated syntax.",
  },
  {
    id: "json-minifier",
    name: "JSON Minifier",
    slug: "json-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress JSON strings by removing extra spaces, indentations, and newlines to optimize payload sizes.",
  },
  {
    id: "xml-beautifier",
    name: "XML Beautifier",
    slug: "xml-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format, indent, and validate unorganized XML data to make it structured and human-readable.",
  },
  {
    id: "xml-minifier",
    name: "XML Minifier",
    slug: "xml-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress XML files by stripping whitespace, comments, and line breaks to decrease payload sizes.",
  },
  {
    id: "opml-beautifier",
    name: "OPML Beautifier",
    slug: "opml-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format, indent, and validate unorganized OPML outline structures to make RSS feed exports human-readable.",
  },
  {
    id: "opml-minifier",
    name: "OPML Minifier",
    slug: "opml-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress OPML files by stripping whitespace, comments, and line breaks to decrease payload sizes.",
  },
  {
    id: "sql-beautifier",
    name: "SQL Beautifier",
    slug: "sql-beautifier",
    category: "Beautifiers & Minifiers",
    description: "Format, capitalize keywords, and structure raw SQL queries for improved readability and debugging.",
  },
  {
    id: "sql-minifier",
    name: "SQL Minifier",
    slug: "sql-minifier",
    category: "Beautifiers & Minifiers",
    description: "Compress SQL statements by removing unnecessary comments, line breaks, and whitespace intervals.",
  },
  {
    id: "image-to-prompt",
    name: "Image to Prompt Generator",
    slug: "image-to-prompt",
    category: "AI & Multimedia Tools",
    description: "Upload any image and generate detailed Midjourney, DALL-E 3, and Stable Diffusion prompts instantly.",
  },
];

// DYNAMIC CATEGORIES: Jo bhi category TOOLS array me hogi, auto-extract ho jayegi
export const CATEGORIES = Array.from(
  new Set(TOOLS.map((tool) => tool.category))
);
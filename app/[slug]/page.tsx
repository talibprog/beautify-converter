import { TOOLS } from '@/config/tools';
import { TOOL_SEO_CONTENT } from '@/config/toolContent';
import { notFound } from 'next/navigation';
import JsonBeautifier from '@/components/JsonBeautifier';
import CategoryToolLinks from '@/components/CategoryToolLinks'; 
import CsvToJson from '@/components/CsvToJson';
import CssMinifier from '@/components/CssMinifier';
import Base64Tool from '@/components/Base64Tool';
import SipCalculator from '@/components/SipCalculator';
import JsonValidator from '@/components/JsonValidator';
import JsBeautifier from '@/components/JsBeautifier';
import CsvToHtmlTable from '@/components/CsvToHtmlTable';
import PngToJpg from '@/components/PngToJpg';
import MyIpFinder from '@/components/MyIpFinder';
import DnsLookup from '@/components/DnsLookup';
import DomainAgeChecker from '@/components/DomainAgeChecker';
import IpSubnetCalculator from '@/components/IpSubnetCalculator';
import SslChecker from '@/components/SslChecker';
import HtmlMinifier from '@/components/HtmlMinifier';
import HtmlBeautifier from '@/components/HtmlBeautifier';
import JsMinifier from '@/components/JsMinifier';
import JsObfuscator from '@/components/JsObfuscator';
import JsonMinifier from '@/components/JsonMinifier';
import XmlBeautifier from '@/components/XmlBeautifier';
import XmlMinifier from '@/components/XmlMinifier';
import OpmlBeautifier from '@/components/OpmlBeautifier';
import OpmlMinifier from '@/components/OpmlMinifier';
import SqlBeautifier from '@/components/SqlBeautifier';
import SqlMinifier from '@/components/SqlMinifier';
import ImageToPrompt from '@/components/ImageToPrompt';
import SvgToReact from '@/components/SvgToReact';
import CryptoWalletChecker from '@/components/CryptoWalletChecker';
import PdfToImage from '@/components/PdfToImage';
import ImageConverterCompressor from '@/components/ImageConverterCompressor';
import BioLinkGenerator from '@/components/BioLinkGenerator';
import EmiCalculator from '@/components/EmiCalculator';
import CssValidator from '@/components/CssValidator';
import JavaScriptValidator from '@/components/JavaScriptValidator';
import XmlValidator from '@/components/XmlValidator';
import YamlValidator from '@/components/YamlValidator';
import HeicToJpg from '@/components/HeicToJpg';
import Link from 'next/link';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'json-beautifier': JsonBeautifier,
  'css-minifier': CssMinifier,
  'csv-to-json': CsvToJson,
  'base64-encoder-decoder': Base64Tool,
  'sip-calculator': SipCalculator,
  'json-validator': JsonValidator,
  'js-beautifier': JsBeautifier,
  'csv-to-html-table': CsvToHtmlTable,
  'png-to-jpg-converter': PngToJpg,
  'my-ip-finder': MyIpFinder,
  'dns-lookup': DnsLookup,
  'domain-age-checker': DomainAgeChecker,
  'ip-subnet-calculator': IpSubnetCalculator,
  'ssl-checker': SslChecker,
  'html-minifier': HtmlMinifier,
  'html-beautifier': HtmlBeautifier,
  'javascript-minifier': JsMinifier,
  'javascript-obfuscator': JsObfuscator,
  'json-minifier': JsonMinifier,
  'xml-beautifier': XmlBeautifier,
  'xml-minifier': XmlMinifier,
  'opml-beautifier': OpmlBeautifier,
  'opml-minifier': OpmlMinifier,
  'sql-beautifier': SqlBeautifier,
  'sql-minifier': SqlMinifier,
  'image-to-prompt': ImageToPrompt,
  'svg-to-react': SvgToReact,
  'crypto-wallet-checker': CryptoWalletChecker,
  'pdf-to-image': PdfToImage,
  'image-converter-compressor': ImageConverterCompressor,
  'bio-link-generator': BioLinkGenerator,
  'emi-calculator': EmiCalculator,
  'css-validator': CssValidator,
  'javascript-validator': JavaScriptValidator,
  'xml-validator': XmlValidator,
  'yaml-validator': YamlValidator,
  'heic-to-jpg': HeicToJpg,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tool = TOOLS.find((t) => t.slug === resolvedParams.slug);
  const content = TOOL_SEO_CONTENT[resolvedParams.slug];

  if (!tool) return {};

  return {
    title: content?.title || `${tool.name} - Free Online Tool | BeautifyConverterKit`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tool = TOOLS.find((t) => t.slug === resolvedParams.slug);
  const content = TOOL_SEO_CONTENT[resolvedParams.slug];

  if (!tool) {
    notFound();
  }

  const Component = TOOL_COMPONENTS[tool.slug];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* BREADCRUMB */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{tool.category}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{tool.name}</span>
        </nav>

        {/* TOOL HEADER */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
          <p className="text-gray-600">{tool.description}</p>
        </div>

        {/* TOOL RENDER AREA */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {Component ? <Component /> : <div className="text-gray-500">Tool component coming soon...</div>}
        </div>

        {/* SEO LONG CONTENT SECTION (1000+ WORDS) */}
        {content && (
          <article className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-10 text-gray-700 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">{content.title}</h2>
              <div className="whitespace-pre-line text-gray-600">{content.introduction}</div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Key Features of Our Online {tool.name}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {content.features.map((feature, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">How to Use the {tool.name}</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                {content.howToUse.map((step, i) => (
                  <li key={i} className="pl-2">{step}</li>
                ))}
              </ol>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h3>
              <div className="space-y-4">
                {content.faq.map((item, i) => (
                  <div key={i} className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900">{item.question}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>
        )}

        {/* AUTOMATIC CATEGORY LINKS AT THE BOTTOM */}
        <CategoryToolLinks currentSlug={tool.slug} />
      </div>
    </main>
  );
}
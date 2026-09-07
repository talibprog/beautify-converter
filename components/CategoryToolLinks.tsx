import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/config/tools';

export default function CategoryToolLinks({ currentSlug }: { currentSlug?: string }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
      <div className="border-b pb-4">
        <h3 className="text-2xl font-bold text-gray-900">Explore More Developer Tools</h3>
        <p className="text-sm text-gray-500 mt-1">
          Access our complete collection of free online code beautifiers, converters, and utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter((tool) => tool.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h4 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                  {categoryTools.length}
                </span>
              </h4>
              <ul className="space-y-2">
                {categoryTools.map((tool) => {
                  const isActive = tool.slug === currentSlug;
                  return (
                    <li key={tool.id}>
                      <Link
                        href={`/${tool.slug}`}
                        className={`text-sm block transition-colors ${
                          isActive
                            ? 'text-blue-600 font-bold pointer-events-none'
                            : 'text-gray-600 hover:text-blue-600 hover:underline'
                        }`}
                      >
                        {tool.name}
                        {isActive && <span className="text-xs ml-2 text-blue-500">(Active)</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
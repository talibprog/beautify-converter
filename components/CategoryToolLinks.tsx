import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/config/tools';

// Category level icon mapping
function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('beautifier') || cat.includes('minifier')) return '⚡';
  if (cat.includes('converter')) return '🔄';
  if (cat.includes('utility') || cat.includes('encoder')) return '🛠️';
  if (cat.includes('calculator')) return '🧮';
  if (cat.includes('validator')) return '✅';
  if (cat.includes('image')) return '🖼️';
  if (cat.includes('ip') || cat.includes('domain')) return '🌐';
  return '📁';
}

// Item level icon/badge logic
function getItemBadge(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes('json')) return { text: '{ }', bg: 'bg-amber-100 text-amber-700' };
  if (lower.includes('css')) return { text: 'CSS', bg: 'bg-blue-100 text-blue-700' };
  if (lower.includes('js') || lower.includes('javascript')) return { text: 'JS', bg: 'bg-yellow-100 text-yellow-800' };
  if (lower.includes('html')) return { text: 'HTML', bg: 'bg-orange-100 text-orange-700' };
  if (lower.includes('xml')) return { text: 'XML', bg: 'bg-teal-100 text-teal-700' };
  if (lower.includes('sql')) return { text: 'SQL', bg: 'bg-sky-100 text-sky-700' };
  if (lower.includes('opml')) return { text: 'OPML', bg: 'bg-emerald-100 text-emerald-700' };
  if (lower.includes('csv')) return { text: 'CSV', bg: 'bg-green-100 text-green-700' };
  if (lower.includes('base64')) return { text: 'B64', bg: 'bg-purple-100 text-purple-700' };
  if (lower.includes('ip') || lower.includes('subnet')) return { text: 'IP', bg: 'bg-cyan-100 text-cyan-700' };
  if (lower.includes('ssl')) return { text: '🔒', bg: 'bg-emerald-100 text-emerald-700' };
  return { text: '•••', bg: 'bg-gray-100 text-gray-600' };
}

export default function CategoryToolLinks({ currentSlug }: { currentSlug?: string }) {
  // -------------------------------------------------------------
  // Dynamic Height Balancing Algorithm for Masonry Grid
  // -------------------------------------------------------------
  const NUM_COLUMNS = 4;
  const columnCategories: string[][] = Array.from({ length: NUM_COLUMNS }, () => []);
  const columnHeights: number[] = Array(NUM_COLUMNS).fill(0);

  CATEGORIES.forEach((category) => {
    const categoryTools = TOOLS.filter((tool) => tool.category === category);
    if (categoryTools.length === 0) return;

    // Sabse kam height/items wale column ka index search karo
    const minColIndex = columnHeights.indexOf(Math.min(...columnHeights));

    // Approximate height calculation: Header height (50px) + (Item Count * Item height 42px)
    const cardEstimatedHeight = 50 + categoryTools.length * 42;

    columnCategories[minColIndex].push(category);
    columnHeights[minColIndex] += cardEstimatedHeight;
  });

  return (
    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore More Developer Tools
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access our complete index of converters, formatters, and network utilities.
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {TOOLS.length} Utilities
        </span>
      </div>

      {/* BALANCED 4-COLUMN MASONRY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columnCategories.map((categoriesInCol, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {categoriesInCol.map((category) => {
              const categoryTools = TOOLS.filter((tool) => tool.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* CATEGORY CARD HEADER */}
                  <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 truncate">
                      <span>{getCategoryIcon(category)}</span>
                      <span>{category}</span>
                    </h4>
                    <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full shrink-0">
                      {categoryTools.length}
                    </span>
                  </div>

                  {/* LIST ITEMS */}
                  <ul className="divide-y divide-gray-200/80 text-xs">
                    {categoryTools.map((tool) => {
                      const isActive = tool.slug === currentSlug;
                      const badge = getItemBadge(tool.slug);

                      return (
                        <li key={tool.id}>
                          <Link
                            href={`/${tool.slug}`}
                            className={`flex items-center justify-between px-3.5 py-3 transition group ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              {/* ITEM ICON BADGE */}
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${badge.bg}`}
                              >
                                {badge.text}
                              </span>
                              <span className="truncate">{tool.name}</span>
                            </div>

                            {isActive ? (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                                Active
                              </span>
                            ) : (
                              <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0">
                                →
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
'use client';

import { useState } from 'react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export default function BioLinkGenerator() {
  const [name, setName] = useState('Alex Morgan');
  const [handle, setHandle] = useState('@alexcreates');
  const [bio, setBio] = useState('Digital Creator | Tech Enthusiast | Building web tools 🚀');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [theme, setTheme] = useState<'dark' | 'light' | 'purple' | 'sunset'>('purple');
  const [links, setLinks] = useState<LinkItem[]>([
    { id: '1', title: '🌐 Visit My Website', url: 'https://example.com' },
    { id: '2', title: '🎥 Watch Latest YouTube Video', url: 'https://youtube.com' },
    { id: '3', title: '💼 Portfolio & Projects', url: 'https://example.com/portfolio' },
  ]);

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '🔗 New Link', url: 'https://' }]);
  };

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900 text-white',
          card: 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700',
          subtext: 'text-gray-400',
        };
      case 'light':
        return {
          bg: 'bg-gray-50 text-gray-900',
          card: 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200 shadow-sm',
          subtext: 'text-gray-500',
        };
      case 'sunset':
        return {
          bg: 'bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 text-white',
          card: 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border-white/30',
          subtext: 'text-rose-100',
        };
      default: // purple
        return {
          bg: 'bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white',
          card: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-white/20',
          subtext: 'text-indigo-200',
        };
    }
  };

  const currentTheme = getThemeClasses();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* EDIT FORM PANEL */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 border-b pb-2">Profile Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* THEME SELECTION */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Background Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {(['purple', 'dark', 'light', 'sunset'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize border ${
                    theme === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* MANAGE LINKS */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-semibold text-gray-700">Custom Links ({links.length})</h2>
              <button
                onClick={addLink}
                className="px-3 py-1 text-xs bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                + Add Link
              </button>
            </div>

            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="Link Button Title"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      className="flex-1 p-1.5 text-xs font-medium border border-gray-300 rounded bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => removeLink(link.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    className="w-full p-1.5 text-xs border border-gray-300 rounded bg-white font-mono focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE MOBILE PREVIEW */}
        <div className="lg:col-span-5 flex justify-center sticky top-6">
          <div className="w-[320px] h-[640px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 relative flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-black absolute top-3 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>

            {/* Mobile Screen Output */}
            <div className={`w-full h-full rounded-[30px] ${currentTheme.bg} p-6 pt-10 overflow-y-auto space-y-5 text-center flex flex-col items-center transition-all duration-300`}>
              <img
                src={avatar || 'https://via.placeholder.com/150'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-md"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-base">{name || 'Your Name'}</h3>
                <p className={`text-xs ${currentTheme.subtext}`}>{handle || '@username'}</p>
                <p className={`text-xs ${currentTheme.subtext} pt-1 max-w-[240px] leading-relaxed`}>{bio}</p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2.5 pt-2">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`block w-full py-2.5 px-4 text-xs font-medium rounded-xl border transition-all duration-200 transform hover:-translate-y-0.5 ${currentTheme.card}`}
                  >
                    {link.title || 'Untitled Link'}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Plus, ChevronRight, Search, Folder, X, Edit2, Trash2, Youtube } from "lucide-react";

interface WikiPage {
  id: string;
  title: string;
  body: string;
  youtubeUrl?: string | null;
  categoryId: string;
  sortOrder: number;
}

interface WikiCategory {
  id: string;
  name: string;
  sortOrder: number;
  pages: { id: string; title: string; sortOrder: number }[];
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

function renderBody(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-gray-800 mt-4 mb-2">{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-3 mb-1">{line.slice(4)}</h3>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="ml-4 list-disc text-gray-700">{line.slice(2)}</li>;
    if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal text-gray-700">{line.replace(/^\d+\. /, "")}</li>;
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-gray-700 leading-relaxed">{line}</p>;
  });
}

export default function WikiPage() {
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"view" | "edit" | "new-page" | "new-cat">("view");
  const [form, setForm] = useState({ title: "", body: "", youtubeUrl: "", categoryId: "" });
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/wiki/categories");
    const data = await res.json();
    setCategories(data);
    if (data.length > 0) setExpandedCats(new Set(data.map((c: WikiCategory) => c.id)));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadPage(id: string) {
    const res = await fetch(`/api/admin/wiki/pages/${id}`);
    const page = await res.json();
    setSelectedPage(page);
    setMode("view");
  }

  async function savePage() {
    setSaving(true);
    if (mode === "new-page") {
      await fetch("/api/admin/wiki/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else if (mode === "edit" && selectedPage) {
      await fetch(`/api/admin/wiki/pages/${selectedPage.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await load();
    if (mode === "edit" && selectedPage) loadPage(selectedPage.id);
    else setMode("view");
    setSaving(false);
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/admin/wiki/pages/${id}`, { method: "DELETE" });
    setSelectedPage(null);
    setMode("view");
    await load();
  }

  async function saveCat() {
    if (!newCatName.trim()) return;
    setSaving(true);
    await fetch("/api/admin/wiki/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCatName }) });
    setNewCatName("");
    setMode("view");
    await load();
    setSaving(false);
  }

  async function deleteCat(id: string) {
    if (!confirm("Delete this category and ALL its pages?")) return;
    await fetch(`/api/admin/wiki/categories/${id}`, { method: "DELETE" });
    setSelectedPage(null);
    await load();
  }

  const allPages = categories.flatMap(c => c.pages.map(p => ({ ...p, categoryName: c.name })));
  const filtered = search.trim()
    ? allPages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : null;

  function startEdit() {
    if (!selectedPage) return;
    setForm({ title: selectedPage.title, body: selectedPage.body, youtubeUrl: selectedPage.youtubeUrl || "", categoryId: selectedPage.categoryId });
    setMode("edit");
  }

  function startNewPage(categoryId = "") {
    setForm({ title: "", body: "", youtubeUrl: "", categoryId });
    setMode("new-page");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold uppercase text-gray-900" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
          Wiki / SOPs
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setMode("new-cat")} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Folder size={14} /> New Category
          </button>
          <button onClick={() => startNewPage()} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            <Plus size={14} /> New Page
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Search results */}
          {filtered ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {filtered.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No pages found</p>
              ) : filtered.map(p => (
                <button key={p.id} onClick={() => loadPage(p.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0">
                  <div className="font-medium text-gray-800 truncate">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.categoryName}</div>
                </button>
              ))}
            </div>
          ) : (
            /* Category tree */
            <div className="space-y-2">
              {categories.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400">
                  <BookOpen size={24} className="mx-auto mb-2 opacity-40" />
                  No categories yet
                </div>
              )}
              {categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                    <button
                      onClick={() => setExpandedCats(prev => { const n = new Set(prev); n.has(cat.id) ? n.delete(cat.id) : n.add(cat.id); return n; })}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 flex-1 text-left"
                    >
                      <ChevronRight size={14} className={`transition-transform ${expandedCats.has(cat.id) ? "rotate-90" : ""}`} />
                      {cat.name}
                      <span className="ml-auto text-xs text-gray-400 font-normal">{cat.pages.length}</span>
                    </button>
                    <div className="flex items-center gap-1 ml-2">
                      <button onClick={() => startNewPage(cat.id)} className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Add page">
                        <Plus size={13} />
                      </button>
                      <button onClick={() => deleteCat(cat.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete category">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  {expandedCats.has(cat.id) && (
                    <div>
                      {cat.pages.length === 0 && (
                        <p className="px-4 py-2 text-xs text-gray-400 italic">No pages yet</p>
                      )}
                      {cat.pages.map(p => (
                        <button
                          key={p.id}
                          onClick={() => loadPage(p.id)}
                          className={`w-full text-left px-4 py-2 text-sm border-b border-gray-50 last:border-0 transition-colors ${
                            selectedPage?.id === p.id ? "bg-green-50 text-green-800 font-medium" : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* New category form */}
          {mode === "new-cat" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">New Category</h2>
              <input
                autoFocus
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveCat()}
                placeholder="Category name (e.g. Operations, Equipment, Customer Service)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              />
              <div className="flex gap-2">
                <button onClick={saveCat} disabled={saving} className="px-4 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 disabled:opacity-50">
                  {saving ? "Saving..." : "Create Category"}
                </button>
                <button onClick={() => setMode("view")} className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}

          {/* New / Edit page form */}
          {(mode === "new-page" || mode === "edit") && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">{mode === "new-page" ? "New Page" : "Edit Page"}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Page title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Content <span className="font-normal text-gray-400">(Use # Heading, ## Subheading, - bullet points, 1. numbered lists)</span>
                  </label>
                  <textarea
                    value={form.body}
                    onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    placeholder="Write your SOP here..."
                    rows={16}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    <Youtube size={12} className="inline mr-1" />
                    YouTube Video URL <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    value={form.youtubeUrl}
                    onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={savePage} disabled={saving || !form.title || !form.categoryId} className="px-4 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Page"}
                </button>
                <button onClick={() => { setMode("view"); }} className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}

          {/* View page */}
          {mode === "view" && selectedPage && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-start justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPage.title}</h2>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => deletePage(selectedPage.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              {/* YouTube embed */}
              {selectedPage.youtubeUrl && getYoutubeId(selectedPage.youtubeUrl) && (
                <div className="px-6 pt-6">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-xl"
                      src={`https://www.youtube.com/embed/${getYoutubeId(selectedPage.youtubeUrl!)}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="p-6 space-y-1">
                {selectedPage.body ? renderBody(selectedPage.body) : (
                  <p className="text-gray-400 italic">No content yet. Click Edit to add content.</p>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {mode === "view" && !selectedPage && (
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
              <BookOpen size={48} className="text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Your Wiki</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm">
                Create categories and pages to store your SOPs, training guides, videos and anything else you need to run the business.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setMode("new-cat")} className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Folder size={14} /> New Category
                </button>
                <button onClick={() => startNewPage()} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">
                  <Plus size={14} /> New Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

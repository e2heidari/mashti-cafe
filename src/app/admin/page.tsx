"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText: string;
  order: number;
  active: boolean;
}

export default function AdminPanel() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNewsItems(data.newsItems || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/news/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingItem(null);
        fetchNewsItems();
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Panel - News Management
          </h1>

          <div className="mb-6">
            <button
              onClick={() => {
                setEditingItem({
                  _id: "",
                  title: "",
                  description: "",
                  imageUrl: "",
                  buttonText: "View Menu",
                  order: newsItems.length + 1,
                  active: true,
                });
                setShowForm(true);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Add New Item
            </button>
          </div>

          {showForm && editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                  {editingItem._id ? "Edit News Item" : "Add News Item"}
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editingItem.buttonText}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          buttonText: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={editingItem.order}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem.active}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          active: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Active (Show on website)
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {newsItems.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Button: {item.buttonText}</span>
                      <span>Order: {item.order}</span>
                      <span
                        className={`px-2 py-1 rounded ${item.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

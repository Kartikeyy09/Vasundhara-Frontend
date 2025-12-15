// src/AdminPannel/AdminVisionMission.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  RefreshCcw,
  Link as LinkIcon,
  ChevronDown,
} from "lucide-react";

// Import API functions
import {
  // Hero APIs
  getVmHero,
  upsertVmHero,
  resetVmHero,
  // Items APIs
  getVmItems,
  getVmItemsByType,
  createVmItem,
  updateVmItem,
  deleteVmItem,
  deleteAllVmItems,
  // Utility
  fileToDataURL,
} from "../api/admin/visionMissionAdminApi";

/* ---------- Constants ---------- */
const ITEM_TYPES = [
  { value: "mission", label: "Mission", color: "bg-blue-100 text-blue-800" },
  { value: "vision", label: "Vision", color: "bg-purple-100 text-purple-800" },
  { value: "goal", label: "Goal", color: "bg-green-100 text-green-800" },
  { value: "values", label: "Values", color: "bg-orange-100 text-orange-800" },
];

/* ---------- Reusable UI Components ---------- */

function IconButton({ title, onClick, children, className = "", disabled = false }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles = {
    success: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-5 h-5" /> },
    error: { bg: "bg-red-100", text: "text-red-800", icon: <AlertTriangle className="w-5 h-5" /> },
    info: { bg: "bg-blue-100", text: "text-blue-800", icon: <Info className="w-5 h-5" /> },
  };
  const style = styles[type] || styles.info;

  return (
    <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-lg shadow-lg ${style.bg} ${style.text} animate-slideIn`}>
      {style.icon}
      <span className="font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-2 -mr-1 p-1 rounded-full hover:bg-black/10">
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ isOpen, src, title, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X />
          </button>
        </div>
        {src ? (
          <img src={src} alt="preview" className="w-full max-h-[80vh] object-contain rounded" />
        ) : (
          <div className="w-full h-96 flex items-center justify-center text-gray-500 bg-gray-100 rounded-md">
            No image available
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Item Form Modal ---------- */
function ItemFormModal({ isOpen, onClose, onSave, editData, isLoading }) {
  const [type, setType] = useState("mission");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadType, setUploadType] = useState("file");
  const [order, setOrder] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setType(editData.type || "mission");
        setTitle(editData.title || "");
        setDescription(editData.description || "");
        setImageUrl(editData.imageUrl || "");
        setImagePreview(editData.computedImageUrl || editData.imageUrl || "");
        setUploadType(editData.useUpload ? "file" : "url");
        setOrder(editData.order || 0);
      } else {
        setType("mission");
        setTitle("");
        setDescription("");
        setImageUrl("");
        setImagePreview("");
        setUploadType("file");
        setOrder(0);
      }
      setImageFile(null);
    }
  }, [isOpen, editData]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null);
    setUploadType("url");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (!type) return;

    const itemData = {
      type,
      title: title.trim(),
      description: description.trim(),
      order,
      useUpload: uploadType === "file",
    };

    if (uploadType === "url") {
      itemData.imageUrl = imageUrl.trim();
    }

    onSave(itemData, uploadType === "file" ? imageFile : null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {editData ? "Edit Item" : "Add New Item"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ITEM_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${type === t.value
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="space-y-4">
            {/* Image Source Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadType("file")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "file"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("url")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "url"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <LinkIcon className="w-4 h-4" /> URL
                </button>
              </div>
            </div>

            {uploadType === "file" ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition"
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {imageFile.name}</p>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon />
                    <span>No image</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !type}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero Section Manager ---------- */
function HeroManager({ showToast }) {
  const [hero, setHero] = useState({
    title: "Vision & Mission",
    description: "",
    imageUrl: "",
    useUpload: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadType, setUploadType] = useState("url");
  const fileInputRef = useRef(null);

  const fetchHero = async () => {
    setIsLoading(true);
    const result = await getVmHero();
    if (result.success) {
      setHero(result.data);
      setImagePreview(result.data.computedImageUrl || result.data.imageUrl || "");
      setUploadType(result.data.useUpload ? "file" : "url");
    } else {
      showToast(result.error || "Failed to fetch hero section", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const handleUrlChange = (url) => {
    setHero({ ...hero, imageUrl: url });
    setImagePreview(url);
    setImageFile(null);
    setUploadType("url");
  };

  const handleSave = async () => {
    setActionLoading(true);

    const heroData = {
      title: hero.title,
      description: hero.description,
      useUpload: uploadType === "file",
    };

    if (uploadType === "url") {
      heroData.imageUrl = hero.imageUrl;
    }

    const result = await upsertVmHero(heroData, uploadType === "file" ? imageFile : null);

    if (result.success) {
      showToast("Hero section updated successfully!");
      setHero(result.data);
      setImageFile(null);
    } else {
      showToast(result.error || "Failed to update hero section", "error");
    }
    setActionLoading(false);
  };

  const handleReset = async () => {
    setActionLoading(true);
    const result = await resetVmHero();
    if (result.success) {
      showToast("Hero section reset successfully!");
      setHero({
        title: "Vision & Mission",
        description: "",
        imageUrl: "",
        useUpload: false,
      });
      setImagePreview("");
      setImageFile(null);
    } else {
      showToast(result.error || "Failed to reset hero section", "error");
    }
    setActionLoading(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
        <button
          onClick={fetchHero}
          disabled={isLoading}
          className="bg-blue-50 text-blue-700 px-3 py-2 rounded flex items-center gap-1 hover:bg-blue-100 disabled:opacity-50"
        >
          <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Section Title"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border p-2.5 rounded-lg h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Description"
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Source</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "file"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "url"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <LinkIcon className="w-4 h-4" /> URL
              </button>
            </div>
          </div>

          {uploadType === "file" ? (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition"
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload image</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imageFile && (
                <p className="text-sm text-green-600 mt-2">✓ {imageFile.name}</p>
              )}
            </div>
          ) : (
            <div>
              <input
                type="url"
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                value={hero.imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>
          )}

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <img
                src={imagePreview}
                alt="Hero Preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={actionLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save
        </button>
        <button
          onClick={handleReset}
          disabled={actionLoading}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 disabled:opacity-50"
        >
          <Trash2 size={18} /> Reset
        </button>
      </div>
    </div>
  );
}

/* ---------- Items Section Manager ---------- */
function ItemsManager({ showToast }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formModal, setFormModal] = useState({ isOpen: false, editData: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, src: "", title: "" });

  const fetchItems = async (type = null) => {
    setIsLoading(true);
    const result = type ? await getVmItemsByType(type) : await getVmItems();
    if (result.success) {
      setItems(result.data);
    } else {
      showToast(result.error || "Failed to fetch items", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems(activeFilter === "all" ? null : activeFilter);
  }, [activeFilter]);

  const handleAdd = () => {
    setFormModal({ isOpen: true, editData: null });
  };

  const handleEdit = (item) => {
    setFormModal({ isOpen: true, editData: item });
  };

  const handleSave = async (itemData, imageFile) => {
    setActionLoading(true);

    let result;
    if (formModal.editData) {
      result = await updateVmItem(formModal.editData.id, itemData, imageFile);
    } else {
      result = await createVmItem(itemData, imageFile);
    }

    if (result.success) {
      showToast(formModal.editData ? "Item updated successfully!" : "Item added successfully!");
      setFormModal({ isOpen: false, editData: null });
      fetchItems(activeFilter === "all" ? null : activeFilter);
    } else {
      showToast(result.error || "Failed to save item", "error");
    }
    setActionLoading(false);
  };

  const handleDeleteClick = (item) => {
    setConfirmModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.item) return;

    setActionLoading(true);
    const result = await deleteVmItem(confirmModal.item.id);
    if (result.success) {
      showToast("Item deleted successfully!");
      fetchItems(activeFilter === "all" ? null : activeFilter);
    } else {
      showToast(result.error || "Failed to delete item", "error");
    }
    setActionLoading(false);
    setConfirmModal({ isOpen: false, item: null });
  };

  const handleDeleteAll = async () => {
    setActionLoading(true);
    const result = await deleteAllVmItems();
    if (result.success) {
      showToast("All items deleted!");
      setItems([]);
    } else {
      showToast(result.error || "Failed to delete all items", "error");
    }
    setActionLoading(false);
  };

  const getTypeColor = (type) => {
    const found = ITEM_TYPES.find((t) => t.value === type);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type) => {
    const found = ITEM_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Group items by type for display
  const groupedItems = items.reduce((acc, item) => {
    const type = item.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Vision, Mission, Goals & Values</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => fetchItems(activeFilter === "all" ? null : activeFilter)}
            disabled={isLoading}
            className="bg-blue-50 text-blue-700 px-3 py-2 rounded flex items-center gap-1 hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={handleAdd}
            disabled={actionLoading}
            className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
          >
            <Plus size={18} /> Add Item
          </button>
          {items.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={actionLoading}
              className="bg-red-100 text-red-700 px-3 py-2 rounded flex items-center gap-1 hover:bg-red-200 disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeFilter === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          All
        </button>
        {ITEM_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveFilter(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeFilter === type.value
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No items found. Click "Add Item" to get started.</p>
        </div>
      ) : activeFilter === "all" ? (
        // Display grouped by type
        <div className="space-y-8">
          {ITEM_TYPES.map((type) => {
            const typeItems = groupedItems[type.value] || [];
            if (typeItems.length === 0) return null;

            return (
              <div key={type.value}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${type.color}`}>
                    {type.label}
                  </span>
                  <span className="text-gray-500 text-sm">({typeItems.length})</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {typeItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      typeColor={getTypeColor(item.type)}
                      typeLabel={getTypeLabel(item.type)}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onPreview={(src, title) =>
                        setPreviewModal({ isOpen: true, src, title })
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Display filtered items
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              typeColor={getTypeColor(item.type)}
              typeLabel={getTypeLabel(item.type)}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onPreview={(src, title) =>
                setPreviewModal({ isOpen: true, src, title })
              }
            />
          ))}
        </div>
      )}

      <ItemFormModal
        isOpen={formModal.isOpen}
        editData={formModal.editData}
        isLoading={actionLoading}
        onClose={() => setFormModal({ isOpen: false, editData: null })}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"? This action cannot be undone.`}
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, item: null })}
      />

      <PreviewModal
        isOpen={previewModal.isOpen}
        src={previewModal.src}
        title={previewModal.title}
        onClose={() => setPreviewModal({ isOpen: false, src: "", title: "" })}
      />
    </div>
  );
}

/* ---------- Item Card Component ---------- */
function ItemCard({ item, typeColor, typeLabel, onEdit, onDelete, onPreview }) {
  return (
    <div className="border rounded-lg p-4 flex gap-4 bg-white shadow-sm hover:shadow-md transition group">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.computedImageUrl || item.imageUrl ? (
          <img
            src={item.computedImageUrl || item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onPreview(item.computedImageUrl || item.imageUrl, item.title)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=Error";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={32} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`text-xs px-2 py-0.5 rounded ${typeColor}`}>
              {typeLabel}
            </span>
            <h4 className="font-semibold text-gray-900 mt-1 truncate" title={item.title}>
              {item.title || <i className="text-gray-500">No title</i>}
            </h4>
          </div>
          <span className="text-xs text-gray-400">#{item.order || 0}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
          <IconButton
            title="Preview Image"
            onClick={() => onPreview(item.computedImageUrl || item.imageUrl, item.title)}
          >
            <Eye size={16} />
          </IconButton>
          <IconButton title="Edit" onClick={() => onEdit(item)}>
            <Edit3 size={16} />
          </IconButton>
          <IconButton title="Delete" onClick={() => onDelete(item)}>
            <Trash2 size={16} className="text-red-600" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Admin Component ---------- */
export default function AdminVisionMission() {
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Toast */}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast({ ...toast, visible: false })}
          />
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-green-700">Vision & Mission Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the Vision & Mission page content including hero section and all items.
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-6">
          <HeroManager showToast={showToast} />
        </div>

        {/* Items Section */}
        <div>
          <ItemsManager showToast={showToast} />
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
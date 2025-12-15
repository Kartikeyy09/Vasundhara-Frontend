// src/AdminPannel/AdminHome.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  Save,
  X,
  Upload,
  Play,
  Pause,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  GripVertical,
  Hash,
  Palette,
  Type,
  BarChart3,
  FileText,
  Video,
} from "lucide-react";
import {
  getHeroSlides,
  createHero,
  updateHero,
  deleteHero,
  deleteAllHeroes,
} from "../api/admin/heroAdminApi";
import {
  getStats,
  createStat,
  updateStat,
  deleteStat,
  deleteAllStats,
} from "../api/admin/statsAdminApi";
import AdminAboutSection from "./AdminAboutSection";
import AdminVideoSection from "./AdminVideoSection";

// Import AdminAboutSection Component
// import AdminAboutSection from "./Components/AdminAboutSection";

/* ---------- Toast Component ---------- */
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
      <button onClick={onDismiss} className="ml-2 p-1 rounded-full hover:bg-black/10">
        <X size={16} />
      </button>
    </div>
  );
}

/* ---------- Confirmation Modal ---------- */
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
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

/* ---------- Hero Form Modal ---------- */
function HeroFormModal({ isOpen, onClose, onSave, editData, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    autoplay: true,
    duration: 5,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadType, setUploadType] = useState("url");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          title: editData.title || "",
          subtitle: editData.subtitle || "",
          imageUrl: editData.imageUrl || "",
          autoplay: editData.autoplay ?? true,
          duration: editData.duration || 5,
          order: editData.order || 0,
        });
        setImagePreview(editData.computedImageUrl || editData.imageUrl || "");
        setUploadType(editData.useUpload ? "file" : "url");
      } else {
        setFormData({
          title: "",
          subtitle: "",
          imageUrl: "",
          autoplay: true,
          duration: 5,
          order: 0,
        });
        setImagePreview("");
        setUploadType("url");
      }
      setImageFile(null);
    }
  }, [isOpen, editData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadType("file");
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url) => {
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
    setImageFile(null);
    setUploadType("url");
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return;
    }

    const dataToSave = {
      ...formData,
      useUpload: uploadType === "file",
    };

    onSave(dataToSave, uploadType === "file" ? imageFile : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {editData ? "Edit Hero Slide" : "Add New Hero Slide"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter slide title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter slide subtitle"
              />
            </div>

            {/* Image Upload Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Source</label>
              <div className="flex gap-2">
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
              </div>
            </div>

            {uploadType === "url" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
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
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (sec)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 5 })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoplay}
                  onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Enable Autoplay</span>
              </label>
            </div>
          </div>

          {/* Right - Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "";
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">No image selected</p>
                </div>
              )}
            </div>
            {imagePreview && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{formData.title || "Title"}</h4>
                <p className="text-sm text-gray-600">{formData.subtitle || "Subtitle"}</p>
              </div>
            )}
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
            disabled={isLoading || !formData.title.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update Slide" : "Add Slide"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats Form Modal ---------- */
function StatsFormModal({ isOpen, onClose, onSave, editData, isLoading }) {
  const [formData, setFormData] = useState({
    icon: "📊",
    color: "#22C55E",
    number: 0,
    label: "",
    order: 0,
  });

  // Common emoji icons for stats
  const commonIcons = [
    "🌱", "🌍", "👥", "🏠", "💧", "🚗", "📚", "💰",
    "❤️", "🎯", "⭐", "🏆", "📈", "🤝", "🌟", "✨",
    "😊", "😍", "🙏", "💪", "🎉", "🔥", "💡", "🌈"
  ];

  // Common colors
  const commonColors = [
    "#22C55E", "#3B82F6", "#EF4444", "#F59E0B",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
    "#6366F1", "#84CC16", "#06B6D4", "#A855F7"
  ];

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          icon: editData.icon || "📊",
          color: editData.color || "#22C55E",
          number: editData.number || 0,
          label: editData.label || "",
          order: editData.order || 0,
        });
      } else {
        setFormData({
          icon: "📊",
          color: "#22C55E",
          number: 0,
          label: "",
          order: 0,
        });
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = () => {
    if (!formData.label.trim()) {
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {editData ? "Edit Stat" : "Add New Stat"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2"
                style={{ backgroundColor: `${formData.color}20`, borderColor: formData.color }}
              >
                {formData.icon}
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl"
                placeholder="Enter emoji"
                maxLength={2}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition ${formData.icon === icon
                    ? "bg-green-100 ring-2 ring-green-500"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="#22C55E"
              />
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition ${formData.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter number (e.g., 500)"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter label (e.g., Trees Planted)"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Display order"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.icon}
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: formData.color }}>
                  {formData.number.toLocaleString()}+
                </p>
                <p className="text-gray-600 font-medium">{formData.label || "Label"}</p>
              </div>
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
            disabled={isLoading || !formData.label.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update Stat" : "Add Stat"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Preview Modal ---------- */
function PreviewModal({ isOpen, src, title, onClose }) {
  if (!isOpen || !src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-4 max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <img src={src} alt={title} className="w-full max-h-[80vh] object-contain rounded-lg" />
      </div>
    </div>
  );
}

/* ---------- Hero Slide Card ---------- */
function HeroSlideCard({ slide, onEdit, onDelete, onPreview }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white group">
      <div className="relative aspect-video bg-gray-100">
        {slide.computedImageUrl || slide.imageUrl ? (
          <img
            src={slide.computedImageUrl || slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x225?text=Image+Error";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPreview(slide)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(slide)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(slide)}
            className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Order badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          #{slide.order || 0}
        </div>

        {/* Autoplay badge */}
        {slide.autoplay && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Play className="w-3 h-3" /> {slide.duration}s
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-gray-900 truncate">{slide.title || "Untitled"}</h4>
        <p className="text-sm text-gray-500 truncate">{slide.subtitle || "No subtitle"}</p>
      </div>
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ stat, onEdit, onDelete }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white group p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.number?.toLocaleString()}+
            </p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(stat)}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(stat)}
            className="p-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
        <span>Order: #{stat.order || 0}</span>
        <div
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: stat.color }}
          title={stat.color}
        />
      </div>
    </div>
  );
}

/* ---------- Hero Slider Preview ---------- */
function HeroSliderPreview({ slides }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (slides.length < 2) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentSlide = slides[index];
    if (currentSlide?.autoplay) {
      timerRef.current = setInterval(
        () => setIndex((i) => (i + 1) % slides.length),
        (currentSlide.duration || 5) * 1000
      );
      return () => clearInterval(timerRef.current);
    }
  }, [slides, index]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>No slides to preview</p>
        </div>
      </div>
    );
  }

  const current = slides[index] || slides[0];

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-sm">
      <img
        src={current.computedImageUrl || current.imageUrl}
        alt={current.title}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/800x400?text=Image+Error";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute left-4 bottom-4 text-white">
        <h3 className="text-2xl font-bold">{current.title}</h3>
        <p className="text-sm">{current.subtitle}</p>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="bg-white/70 p-2 rounded-full shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="bg-white/70 p-2 rounded-full shadow hover:bg-white"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Stats Preview ---------- */
function StatsPreview({ stats }) {
  if (stats.length === 0) {
    return (
      <div className="w-full py-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <p>No stats to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.slice(0, 4).map((stat) => (
          <div key={stat.id} className="text-center text-white">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.number?.toLocaleString()}+</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Admin Home Component ---------- */
export default function AdminHome() {
  const [activeTab, setActiveTab] = useState("Hero");
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [heroFormModal, setHeroFormModal] = useState({ isOpen: false, editData: null });
  const [statsFormModal, setStatsFormModal] = useState({ isOpen: false, editData: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, src: "", title: "" });

  // Hero State
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Action loading
  const [actionLoading, setActionLoading] = useState(false);

  // Show toast function - passed to child components
  const showToast = (message, type = "success") => setToast({ visible: true, message, type });

  // Fetch Hero Slides
  const fetchHeroSlides = async () => {
    setHeroLoading(true);
    const result = await getHeroSlides();
    if (result.success) {
      setHeroSlides(result.data);
    } else {
      showToast(result.error || "Failed to fetch hero slides", "error");
    }
    setHeroLoading(false);
  };

  // Fetch Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    const result = await getStats();
    if (result.success) {
      setStats(result.data);
    } else {
      showToast(result.error || "Failed to fetch stats", "error");
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    fetchHeroSlides();
    fetchStats();
  }, []);

  // ==================== Hero Handlers ====================
  const handleAddHero = () => {
    setHeroFormModal({ isOpen: true, editData: null });
  };

  const handleEditHero = (slide) => {
    setHeroFormModal({ isOpen: true, editData: slide });
  };

  const handleSaveHero = async (heroData, imageFile) => {
    setActionLoading(true);

    let result;
    if (heroFormModal.editData) {
      result = await updateHero(heroFormModal.editData.id, heroData, imageFile);
    } else {
      result = await createHero(heroData, imageFile);
    }

    if (result.success) {
      showToast(heroFormModal.editData ? "Hero slide updated!" : "Hero slide added!");
      setHeroFormModal({ isOpen: false, editData: null });
      fetchHeroSlides();
    } else {
      showToast(result.error || "Failed to save hero slide", "error");
    }

    setActionLoading(false);
  };

  const handleDeleteHero = (slide) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Hero Slide",
      message: `Are you sure you want to delete "${slide.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteHero(slide.id);
        if (result.success) {
          showToast("Hero slide deleted!");
          fetchHeroSlides();
        } else {
          showToast(result.error || "Failed to delete hero slide", "error");
        }
        setActionLoading(false);
        setConfirmModal({ isOpen: false });
      },
    });
  };

  const handleDeleteAllHeroes = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete All Hero Slides",
      message: "Are you sure you want to delete ALL hero slides? This action cannot be undone.",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteAllHeroes();
        if (result.success) {
          showToast("All hero slides deleted!");
          setHeroSlides([]);
        } else {
          showToast(result.error || "Failed to delete hero slides", "error");
        }
        setActionLoading(false);
        setConfirmModal({ isOpen: false });
      },
    });
  };

  const handlePreviewHero = (slide) => {
    setPreviewModal({
      isOpen: true,
      src: slide.computedImageUrl || slide.imageUrl,
      title: slide.title,
    });
  };

  // ==================== Stats Handlers ====================
  const handleAddStat = () => {
    setStatsFormModal({ isOpen: true, editData: null });
  };

  const handleEditStat = (stat) => {
    setStatsFormModal({ isOpen: true, editData: stat });
  };

  const handleSaveStat = async (statData) => {
    setActionLoading(true);

    let result;
    if (statsFormModal.editData) {
      result = await updateStat(statsFormModal.editData.id, statData);
    } else {
      result = await createStat(statData);
    }

    if (result.success) {
      showToast(statsFormModal.editData ? "Stat updated!" : "Stat added!");
      setStatsFormModal({ isOpen: false, editData: null });
      fetchStats();
    } else {
      showToast(result.error || "Failed to save stat", "error");
    }

    setActionLoading(false);
  };

  const handleDeleteStat = (stat) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Stat",
      message: `Are you sure you want to delete "${stat.label}"? This action cannot be undone.`,
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteStat(stat.id);
        if (result.success) {
          showToast("Stat deleted!");
          fetchStats();
        } else {
          showToast(result.error || "Failed to delete stat", "error");
        }
        setActionLoading(false);
        setConfirmModal({ isOpen: false });
      },
    });
  };

  const handleDeleteAllStats = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete All Stats",
      message: "Are you sure you want to delete ALL stats? This action cannot be undone.",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteAllStats();
        if (result.success) {
          showToast("All stats deleted!");
          setStats([]);
        } else {
          showToast(result.error || "Failed to delete stats", "error");
        }
        setActionLoading(false);
        setConfirmModal({ isOpen: false });
      },
    });
  };

  // Refresh data based on active tab
  const handleRefresh = () => {
    if (activeTab === "Hero") {
      fetchHeroSlides();
    } else if (activeTab === "Stats") {
      fetchStats();
    }
    // About section handles its own refresh internally
  };

  const tabs = ["Hero", "Stats", "About (Main)", "About (Video)"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast({ ...toast, visible: false })}
        />
      )}

      {/* Modals */}
      <ConfirmationModal
        {...confirmModal}
        isLoading={actionLoading}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />
      <HeroFormModal
        isOpen={heroFormModal.isOpen}
        editData={heroFormModal.editData}
        isLoading={actionLoading}
        onClose={() => setHeroFormModal({ isOpen: false, editData: null })}
        onSave={handleSaveHero}
      />
      <StatsFormModal
        isOpen={statsFormModal.isOpen}
        editData={statsFormModal.editData}
        isLoading={actionLoading}
        onClose={() => setStatsFormModal({ isOpen: false, editData: null })}
        onSave={handleSaveStat}
      />
      <PreviewModal
        isOpen={previewModal.isOpen}
        src={previewModal.src}
        title={previewModal.title}
        onClose={() => setPreviewModal({ isOpen: false, src: "", title: "" })}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 bg-white rounded-2xl shadow p-4 sticky top-6 self-start">
          <h2 className="text-xl font-bold text-green-700 mb-4">Page Admin</h2>
          <nav className="flex flex-col gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-left px-3 py-2 rounded-lg text-sm sm:text-base transition flex items-center gap-2 ${activeTab === t
                  ? "bg-green-600 text-white font-semibold"
                  : "hover:bg-gray-100"
                  }`}
              >
                {t === "Hero" && <ImageIcon className="w-4 h-4" />}
                {t === "Stats" && <BarChart3 className="w-4 h-4" />}
                {t === "About (Main)" && <FileText className="w-4 h-4" />}
                {t === "About (Video)" && <Video className="w-4 h-4" />}
                {t}
              </button>
            ))}
          </nav>
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRefresh}
                disabled={heroLoading || statsLoading}
                className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50"
              >
                <RefreshCcw className={`w-4 h-4 ${(heroLoading || statsLoading) ? "animate-spin" : ""}`} />
                Refresh Data
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9 space-y-6">
          {/* ==================== Hero Manager ==================== */}
          {activeTab === "Hero" && (
            <div className="bg-white p-6 rounded-2xl shadow space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-green-700">Hero / Slider</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddHero}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" /> Add Slide
                  </button>
                  {heroSlides.length > 0 && (
                    <button
                      onClick={handleDeleteAllHeroes}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" /> Delete All
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Live Preview</h3>
                {heroLoading ? (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <HeroSliderPreview slides={heroSlides} />
                )}
              </div>

              {/* Slides Grid */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  All Slides ({heroSlides.length})
                </h3>
                {heroLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
                    ))}
                  </div>
                ) : heroSlides.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No hero slides yet</p>
                    <button
                      onClick={handleAddHero}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                    >
                      Add Your First Slide
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {heroSlides.map((slide) => (
                      <HeroSlideCard
                        key={slide.id}
                        slide={slide}
                        onEdit={handleEditHero}
                        onDelete={handleDeleteHero}
                        onPreview={handlePreviewHero}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== Stats Manager ==================== */}
          {activeTab === "Stats" && (
            <div className="bg-white p-6 rounded-2xl shadow space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-green-700">Stats / Our Presence</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddStat}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" /> Add Stat
                  </button>
                  {stats.length > 0 && (
                    <button
                      onClick={handleDeleteAllStats}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" /> Delete All
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Live Preview</h3>
                {statsLoading ? (
                  <div className="w-full py-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <StatsPreview stats={stats} />
                )}
              </div>

              {/* Stats Grid */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  All Stats ({stats.length})
                </h3>
                {statsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
                    ))}
                  </div>
                ) : stats.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No stats yet</p>
                    <button
                      onClick={handleAddStat}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                    >
                      Add Your First Stat
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <StatCard
                        key={stat.id}
                        stat={stat}
                        onEdit={handleEditStat}
                        onDelete={handleDeleteStat}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== About (Main) - Using AdminAboutSection Component ==================== */}
          {activeTab === "About (Main)" && (
            <AdminAboutSection showToast={showToast} />
          )}

          {/* ==================== About (Video) - Placeholder ==================== */}
          {activeTab === "About (Video)" && (
            <AdminVideoSection showToast={showToast} />
          )}
        </main>
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
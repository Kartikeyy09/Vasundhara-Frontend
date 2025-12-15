// src/AdminPannel/AdminAbout.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Edit3,
  Trash2,
  Plus,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  Upload,
  Link as LinkIcon,
  RefreshCcw,
  Image as ImageIcon,
} from "lucide-react";

// Import API functions
import {
  // Hero APIs
  getHeroImages,
  createHero,
  updateHero,
  deleteHero,
  deleteAllHeroes,
  // About APIs
  getAboutSection,
  upsertAboutSection,
  resetAboutSection,
  // Areas APIs
  getAreas,
  createArea,
  updateArea,
  deleteArea,
  deleteAllAreas,
  // Utility
  fileToDataURL,
} from "../api/admin/aboutUsAdminApi";

/* ---------- Reusable Toast Notification Component ---------- */
const ToastNotification = ({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const styles = {
    success: { bg: "bg-green-600", icon: <CheckCircle size={20} /> },
    error: { bg: "bg-red-600", icon: <AlertTriangle size={20} /> },
    info: { bg: "bg-blue-600", icon: <Info size={20} /> },
  };

  const style = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-5 right-5 z-[60] flex items-center p-4 rounded-lg shadow-lg ${style.bg} text-white transition-all duration-300 ease-in-out transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
    >
      {style.icon}
      <span className="ml-3">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-full hover:bg-white/20"
      >
        <X size={18} />
      </button>
    </div>
  );
};

/* ---------- Confirmation Modal ---------- */
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
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
};

/* ---------- Image Preview Modal ---------- */
const PreviewModal = ({ isOpen, src, title, onClose }) => {
  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <X size={20} className="text-red-600" />
        </button>
        {title && <h3 className="font-semibold text-lg mb-3">{title}</h3>}
        <img
          src={src}
          alt={title || "Preview"}
          className="w-full max-h-[80vh] object-contain rounded"
        />
      </div>
    </div>
  );
};

/* ---------- Hero Form Modal ---------- */
const HeroFormModal = ({ isOpen, onClose, onSave, editData, isLoading }) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadType, setUploadType] = useState("file");
  const [order, setOrder] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setTitle(editData.title || "");
        setImageUrl(editData.imageUrl || "");
        setImagePreview(editData.computedImageUrl || editData.imageUrl || "");
        setUploadType(editData.useUpload ? "file" : "url");
        setOrder(editData.order || 0);
      } else {
        setTitle("");
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

    const heroData = {
      title: title.trim(),
      order,
      useUpload: uploadType === "file",
    };

    if (uploadType === "url") {
      heroData.imageUrl = imageUrl.trim();
    }

    onSave(heroData, uploadType === "file" ? imageFile : null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {editData ? "Edit Hero Image" : "Add Hero Image"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
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
              placeholder="Enter image title"
            />
          </div>

          {/* Image Source Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Source
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
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

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

          {/* Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !title.trim() ||
              (uploadType === "file" && !imageFile && !editData) ||
              (uploadType === "url" && !imageUrl.trim())
            }
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Area Form Modal ---------- */
const AreaFormModal = ({ isOpen, onClose, onSave, editData, isLoading }) => {
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
        setTitle(editData.title || "");
        setDescription(editData.description || "");
        setImageUrl(editData.imageUrl || "");
        setImagePreview(editData.computedImageUrl || editData.imageUrl || "");
        setUploadType(editData.useUpload ? "file" : "url");
        setOrder(editData.order || 0);
      } else {
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

    const areaData = {
      title: title.trim(),
      description: description.trim(),
      order,
      useUpload: uploadType === "file",
    };

    if (uploadType === "url") {
      areaData.imageUrl = imageUrl.trim();
    }

    onSave(areaData, uploadType === "file" ? imageFile : null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {editData ? "Edit Area" : "Add Area"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
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
              placeholder="Enter area title"
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
              placeholder="Enter area description"
            />
          </div>

          {/* Image Source Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Source
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
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

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

          {/* Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !title.trim() ||
              (uploadType === "file" && !imageFile && !editData) ||
              (uploadType === "url" && !imageUrl.trim())
            }
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Hero Image Manager ---------- */
const HeroManager = ({ showNotification }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formModal, setFormModal] = useState({ isOpen: false, editData: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null,
  });

  const fetchImages = async () => {
    setIsLoading(true);
    const result = await getHeroImages();
    if (result.success) {
      setImages(result.data);
    } else {
      showNotification(result.error || "Failed to fetch hero images", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAdd = () => {
    setFormModal({ isOpen: true, editData: null });
  };

  const handleEdit = (image) => {
    setFormModal({ isOpen: true, editData: image });
  };

  const handleSave = async (heroData, imageFile) => {
    setActionLoading(true);

    let result;
    if (formModal.editData) {
      result = await updateHero(formModal.editData.id, heroData, imageFile);
    } else {
      result = await createHero(heroData, imageFile);
    }

    if (result.success) {
      showNotification(
        formModal.editData
          ? "Hero image updated successfully!"
          : "Hero image added successfully!"
      );
      setFormModal({ isOpen: false, editData: null });
      fetchImages();
    } else {
      showNotification(result.error || "Failed to save hero image", "error");
    }
    setActionLoading(false);
  };

  const handleDeleteClick = (image) => {
    setConfirmModal({ isOpen: true, item: image });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.item) return;

    setActionLoading(true);
    const result = await deleteHero(confirmModal.item.id);
    if (result.success) {
      showNotification("Hero image deleted successfully!");
      fetchImages();
    } else {
      showNotification(result.error || "Failed to delete hero image", "error");
    }
    setActionLoading(false);
    setConfirmModal({ isOpen: false, item: null });
  };

  const handleDeleteAll = async () => {
    setActionLoading(true);
    const result = await deleteAllHeroes();
    if (result.success) {
      showNotification("All hero images deleted!");
      setImages([]);
    } else {
      showNotification(
        result.error || "Failed to delete all hero images",
        "error"
      );
    }
    setActionLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Hero Section Images
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchImages}
            disabled={isLoading}
            className="bg-blue-50 text-blue-700 px-3 py-2 rounded flex items-center gap-1 hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCcw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            onClick={handleAdd}
            disabled={actionLoading}
            className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
          >
            <Plus size={18} /> Add Image
          </button>
          {images.length > 0 && (
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hero images yet. Click "Add Image" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border rounded-lg overflow-hidden group"
            >
              <img
                src={img.computedImageUrl || img.imageUrl}
                alt={img.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Image+Error";
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
                <h3 className="text-white text-xl font-bold text-center p-2">
                  {img.title}
                </h3>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                #{img.order || 0}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() =>
                    setPreview({
                      src: img.computedImageUrl || img.imageUrl,
                      title: img.title,
                    })
                  }
                  className="bg-blue-500 p-1.5 rounded text-white hover:bg-blue-600"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(img)}
                  className="bg-yellow-500 p-1.5 rounded text-white hover:bg-yellow-600"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(img)}
                  className="bg-red-500 p-1.5 rounded text-white hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PreviewModal
        isOpen={!!preview}
        src={preview?.src}
        title={preview?.title}
        onClose={() => setPreview(null)}
      />

      <HeroFormModal
        isOpen={formModal.isOpen}
        editData={formModal.editData}
        isLoading={actionLoading}
        onClose={() => setFormModal({ isOpen: false, editData: null })}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Hero Image"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"? This action cannot be undone.`}
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, item: null })}
      />
    </div>
  );
};

/* ---------- About NGO Manager ---------- */
const AboutManager = ({ showNotification }) => {
  const [about, setAbout] = useState({
    title: "About Us",
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

  const fetchAbout = async () => {
    setIsLoading(true);
    const result = await getAboutSection();
    if (result.success) {
      setAbout(result.data);
      setImagePreview(result.data.computedImageUrl || result.data.imageUrl || "");
      setUploadType(result.data.useUpload ? "file" : "url");
    } else {
      showNotification(result.error || "Failed to fetch about section", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAbout();
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
    setAbout({ ...about, imageUrl: url });
    setImagePreview(url);
    setImageFile(null);
    setUploadType("url");
  };

  const handleSave = async () => {
    setActionLoading(true);

    const aboutData = {
      title: about.title,
      description: about.description,
      useUpload: uploadType === "file",
    };

    if (uploadType === "url") {
      aboutData.imageUrl = about.imageUrl;
    }

    const result = await upsertAboutSection(
      aboutData,
      uploadType === "file" ? imageFile : null
    );

    if (result.success) {
      showNotification("About section updated successfully!");
      setAbout(result.data);
      setImageFile(null);
    } else {
      showNotification(result.error || "Failed to update about section", "error");
    }
    setActionLoading(false);
  };

  const handleReset = async () => {
    setActionLoading(true);
    const result = await resetAboutSection();
    if (result.success) {
      showNotification("About section reset successfully!");
      setAbout({
        title: "About Us",
        description: "",
        imageUrl: "",
        useUpload: false,
      });
      setImagePreview("");
      setImageFile(null);
    } else {
      showNotification(result.error || "Failed to reset about section", "error");
    }
    setActionLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">About Section</h2>
        <button
          onClick={fetchAbout}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Section Title"
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="border p-2.5 rounded-lg w-full h-40 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Description"
              value={about.description}
              onChange={(e) =>
                setAbout({ ...about, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Source
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                value={about.imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>
          )}

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={imagePreview}
                alt="About Preview"
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
          {actionLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
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
};

/* ---------- Areas We Work Manager ---------- */
const AreasManager = ({ showNotification }) => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formModal, setFormModal] = useState({ isOpen: false, editData: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null,
  });

  const fetchAreas = async () => {
    setIsLoading(true);
    const result = await getAreas();
    if (result.success) {
      setAreas(result.data);
    } else {
      showNotification(result.error || "Failed to fetch areas", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAdd = () => {
    setFormModal({ isOpen: true, editData: null });
  };

  const handleEdit = (area) => {
    setFormModal({ isOpen: true, editData: area });
  };

  const handleSave = async (areaData, imageFile) => {
    setActionLoading(true);

    let result;
    if (formModal.editData) {
      result = await updateArea(formModal.editData.id, areaData, imageFile);
    } else {
      result = await createArea(areaData, imageFile);
    }

    if (result.success) {
      showNotification(
        formModal.editData
          ? "Area updated successfully!"
          : "Area added successfully!"
      );
      setFormModal({ isOpen: false, editData: null });
      fetchAreas();
    } else {
      showNotification(result.error || "Failed to save area", "error");
    }
    setActionLoading(false);
  };

  const handleDeleteClick = (area) => {
    setConfirmModal({ isOpen: true, item: area });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmModal.item) return;

    setActionLoading(true);
    const result = await deleteArea(confirmModal.item.id);
    if (result.success) {
      showNotification("Area deleted successfully!");
      fetchAreas();
    } else {
      showNotification(result.error || "Failed to delete area", "error");
    }
    setActionLoading(false);
    setConfirmModal({ isOpen: false, item: null });
  };

  const handleDeleteAll = async () => {
    setActionLoading(true);
    const result = await deleteAllAreas();
    if (result.success) {
      showNotification("All areas deleted!");
      setAreas([]);
    } else {
      showNotification(result.error || "Failed to delete all areas", "error");
    }
    setActionLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Areas We Work</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchAreas}
            disabled={isLoading}
            className="bg-blue-50 text-blue-700 px-3 py-2 rounded flex items-center gap-1 hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCcw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            onClick={handleAdd}
            disabled={actionLoading}
            className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
          >
            <Plus size={18} /> Add Area
          </button>
          {areas.length > 0 && (
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : areas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No areas yet. Click "Add Area" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="border p-4 rounded-lg relative group hover:shadow-md transition"
            >
              <img
                src={area.computedImageUrl || area.imageUrl}
                alt={area.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Image+Error";
                }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {area.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {area.description}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 inline-block">
                    Order: #{area.order || 0}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(area)}
                    className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(area)}
                    className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AreaFormModal
        isOpen={formModal.isOpen}
        editData={formModal.editData}
        isLoading={actionLoading}
        onClose={() => setFormModal({ isOpen: false, editData: null })}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Area"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"? This action cannot be undone.`}
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, item: null })}
      />
    </div>
  );
};

/* ---------- Main Admin Dashboard ---------- */
export default function AdminAbout() {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const closeNotification = () => {
    setToast({ isVisible: false, message: "", type: "success" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        🌿 About Us Admin Dashboard
      </h1>
      <div className="grid gap-8 max-w-6xl mx-auto">
        <HeroManager showNotification={showNotification} />
        <AboutManager showNotification={showNotification} />
        <AreasManager showNotification={showNotification} />
      </div>

      <ToastNotification
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeNotification}
      />
    </div>
  );
}
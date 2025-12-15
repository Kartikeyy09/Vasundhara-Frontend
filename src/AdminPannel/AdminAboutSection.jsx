// src/AdminPannel/Components/AdminAboutSection.jsx
import React, { useEffect, useState, useRef } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    Eye,
    X,
    Upload,
    Loader2,
    Image as ImageIcon,
    Link as LinkIcon,
    FileText,
    AlertTriangle,
} from "lucide-react";
import {
    getAboutItems,
    createAbout,
    updateAbout,
    deleteAbout,
    deleteAllAbouts,
} from "../api/admin/aboutAdminApi";

/* ---------- About Form Modal ---------- */
function AboutFormModal({ isOpen, onClose, onSave, editData, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        mainImage: "",
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
                    description: editData.description || "",
                    mainImage: editData.mainImage || "",
                    order: editData.order || 0,
                });
                setImagePreview(editData.computedImageUrl || editData.mainImage || "");
                setUploadType(editData.useUpload ? "file" : "url");
            } else {
                setFormData({
                    title: "",
                    description: "",
                    mainImage: "",
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
        setFormData({ ...formData, mainImage: url });
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
                        {editData ? "Edit About Item" : "Add New About Item"}
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
                                placeholder="Enter about title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                placeholder="Enter description..."
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
                                    value={formData.mainImage}
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
                        {(formData.title || formData.description) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900">{formData.title || "Title"}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{formData.description || "Description"}</p>
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
                        {editData ? "Update Item" : "Add Item"}
                    </button>
                </div>
            </div>
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

/* ---------- Preview Modal ---------- */
function PreviewModal({ isOpen, src, title, description, onClose }) {
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
                <img src={src} alt={title} className="w-full max-h-[60vh] object-contain rounded-lg" />
                <div className="mt-4">
                    <h3 className="font-semibold text-xl text-gray-900">{title}</h3>
                    {description && (
                        <p className="text-gray-600 mt-2">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- About Card ---------- */
function AboutCard({ item, onEdit, onDelete, onPreview }) {
    return (
        <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white group">
            <div className="relative aspect-video bg-gray-100">
                {item.computedImageUrl || item.mainImage ? (
                    <img
                        src={item.computedImageUrl || item.mainImage}
                        alt={item.title}
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
                        onClick={() => onPreview(item)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Edit"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    #{item.order || 0}
                </div>
            </div>

            <div className="p-4">
                <h4 className="font-semibold text-gray-900 truncate">{item.title || "Untitled"}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description || "No description"}</p>
            </div>
        </div>
    );
}

/* ---------- About Preview Section ---------- */
function AboutPreview({ items }) {
    if (items.length === 0) {
        return (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p>No about items to preview</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {items.slice(0, 2).map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="aspect-video bg-gray-100">
                        {item.computedImageUrl || item.mainImage ? (
                            <img
                                src={item.computedImageUrl || item.mainImage}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x225?text=Image+Error";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div className="p-3">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------- Main AdminAboutSection Component ---------- */
export default function AdminAboutSection({ showToast }) {
    const [aboutItems, setAboutItems] = useState([]);
    const [aboutLoading, setAboutLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [aboutFormModal, setAboutFormModal] = useState({ isOpen: false, editData: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });
    const [previewModal, setPreviewModal] = useState({ isOpen: false, src: "", title: "", description: "" });

    // Fetch About Items
    const fetchAboutItems = async () => {
        setAboutLoading(true);
        const result = await getAboutItems();
        if (result.success) {
            setAboutItems(result.data);
        } else {
            showToast?.(result.error || "Failed to fetch about items", "error");
        }
        setAboutLoading(false);
    };

    useEffect(() => {
        fetchAboutItems();
    }, []);

    // ========== About Handlers ==========
    const handleAddAbout = () => {
        setAboutFormModal({ isOpen: true, editData: null });
    };

    const handleEditAbout = (item) => {
        setAboutFormModal({ isOpen: true, editData: item });
    };

    const handleSaveAbout = async (aboutData, imageFile) => {
        setActionLoading(true);

        let result;
        if (aboutFormModal.editData) {
            result = await updateAbout(aboutFormModal.editData.id, aboutData, imageFile);
        } else {
            result = await createAbout(aboutData, imageFile);
        }

        if (result.success) {
            showToast?.(aboutFormModal.editData ? "About item updated!" : "About item added!", "success");
            setAboutFormModal({ isOpen: false, editData: null });
            fetchAboutItems();
        } else {
            showToast?.(result.error || "Failed to save about item", "error");
        }

        setActionLoading(false);
    };

    const handleDeleteAbout = (item) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete About Item",
            message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
            onConfirm: async () => {
                setActionLoading(true);
                const result = await deleteAbout(item.id);
                if (result.success) {
                    showToast?.("About item deleted!", "success");
                    fetchAboutItems();
                } else {
                    showToast?.(result.error || "Failed to delete about item", "error");
                }
                setActionLoading(false);
                setConfirmModal({ isOpen: false });
            },
        });
    };

    const handleDeleteAllAbouts = () => {
        setConfirmModal({
            isOpen: true,
            title: "Delete All About Items",
            message: "Are you sure you want to delete ALL about items? This action cannot be undone.",
            onConfirm: async () => {
                setActionLoading(true);
                const result = await deleteAllAbouts();
                if (result.success) {
                    showToast?.("All about items deleted!", "success");
                    setAboutItems([]);
                } else {
                    showToast?.(result.error || "Failed to delete about items", "error");
                }
                setActionLoading(false);
                setConfirmModal({ isOpen: false });
            },
        });
    };

    const handlePreviewAbout = (item) => {
        setPreviewModal({
            isOpen: true,
            src: item.computedImageUrl || item.mainImage,
            title: item.title,
            description: item.description,
        });
    };

    return (
        <>
            {/* Modals */}
            <ConfirmationModal
                {...confirmModal}
                isLoading={actionLoading}
                onCancel={() => setConfirmModal({ isOpen: false })}
            />
            <AboutFormModal
                isOpen={aboutFormModal.isOpen}
                editData={aboutFormModal.editData}
                isLoading={actionLoading}
                onClose={() => setAboutFormModal({ isOpen: false, editData: null })}
                onSave={handleSaveAbout}
            />
            <PreviewModal
                isOpen={previewModal.isOpen}
                src={previewModal.src}
                title={previewModal.title}
                description={previewModal.description}
                onClose={() => setPreviewModal({ isOpen: false, src: "", title: "", description: "" })}
            />

            {/* Main Content */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-green-700">About Section (Text & Image)</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddAbout}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                        {aboutItems.length > 0 && (
                            <button
                                onClick={handleDeleteAllAbouts}
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
                    {aboutLoading ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        </div>
                    ) : (
                        <AboutPreview items={aboutItems} />
                    )}
                </div>

                {/* About Items Grid */}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-3">
                        All Items ({aboutItems.length})
                    </h3>
                    {aboutLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : aboutItems.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">No about items yet</p>
                            <button
                                onClick={handleAddAbout}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                            >
                                Add Your First Item
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aboutItems.map((item) => (
                                <AboutCard
                                    key={item.id}
                                    item={item}
                                    onEdit={handleEditAbout}
                                    onDelete={handleDeleteAbout}
                                    onPreview={handlePreviewAbout}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
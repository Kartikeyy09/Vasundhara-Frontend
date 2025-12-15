// src/AdminPannel/AdminOurWork.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Upload,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  Link as LinkIcon,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Import API functions
import {
  getOurWorkItems,
  getOurWorkById,
  createOurWork,
  updateOurWork,
  deleteOurWork,
  deleteAllOurWork,
  fileToDataURL,
} from "../api/admin/ourWorkAdminApi";

/* ---------- Helpers & Configuration ---------- */

// Safer UID
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------- Reusable UI Components ---------- */
function IconButton({ title, onClick, children, className = "", disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles = {
    success: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5" />,
    },
  };
  const style = styles[type] || styles.info;

  return (
    <div
      className={`fixed top-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-lg shadow-lg ${style.bg} ${style.text} animate-slideIn`}
    >
      {style.icon}
      <span className="font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 -mr-1 p-1 rounded-full hover:bg-black/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) {
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
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
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

/* ---------- Create Page Modal ---------- */
function CreatePageModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}) {
  const [pageName, setPageName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadType, setUploadType] = useState("file"); // "file" or "url"
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPageName("");
      setCoverFile(null);
      setCoverUrl("");
      setCoverPreview("");
      setUploadType("file");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setCoverPreview(dataUrl);
    }
  };

  const handleUrlChange = (url) => {
    setCoverUrl(url);
    setCoverPreview(url);
    setCoverFile(null);
    setUploadType("url");
  };

  const handleSubmit = () => {
    if (!pageName.trim()) {
      return;
    }

    if (uploadType === "file" && !coverFile) {
      return;
    }

    if (uploadType === "url" && !coverUrl.trim()) {
      return;
    }

    onSave({
      title: pageName.trim(),
      coverImageUrl: uploadType === "url" ? coverUrl.trim() : undefined,
    }, uploadType === "file" ? coverFile : null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create a New Page</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Enter a name and cover image for your new page (e.g., "Railways", "Bus Stand").
        </p>

        <div className="space-y-4">
          {/* Page Name */}
          <div>
            <label htmlFor="pageName" className="font-semibold text-gray-700 block mb-1">
              Page Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              id="pageName"
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg p-2.5"
              placeholder="e.g., Government"
            />
          </div>

          {/* Image Source Toggle */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
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

            {uploadType === "file" ? (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition"
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload cover image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {coverFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {coverFile.name}</p>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            )}

            {/* Preview */}
            {coverPreview && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Preview:</p>
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "";
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !pageName.trim() || (uploadType === "file" ? !coverFile : !coverUrl.trim())}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Page
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page Editor (react-hook-form) ---------- */
const editorSchema = yup.object({
  heroTitle: yup.string().max(1000, "Keep it concise").nullable(),
  whyTitle: yup.string().max(300).nullable(),
  whyDescription: yup.string().max(5000).nullable(),
  whatTitle: yup.string().max(300).nullable(),
  whatDescription: yup.string().max(5000).nullable(),
  solutionsTitle: yup.string().max(300).nullable(),
  solutionsDescription: yup.string().max(8000).nullable(),
});

function SectionWrapper({ title, open, onToggle, children }) {
  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
      >
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && <div className="p-4 md:p-6 space-y-4">{children}</div>}
    </div>
  );
}

function PageEditorRHF({ page, onBack, onSave, isLoading }) {
  const [openSections, setOpenSections] = useState({
    hero: true,
    whySection: true,
    whatWeDo: true,
    solutions: true,
    gallery: true,
  });

  // File states for uploads
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [heroUploadType, setHeroUploadType] = useState("file");

  const [whatFile, setWhatFile] = useState(null);
  const [whatPreview, setWhatPreview] = useState("");
  const [whatUploadType, setWhatUploadType] = useState("file");

  // Solutions: track both new files and existing images separately
  const [solutionsFiles, setSolutionsFiles] = useState([]); // New files to upload
  const [solutionsPreviews, setSolutionsPreviews] = useState([]); // Previews for new files
  const [existingSolutionsImages, setExistingSolutionsImages] = useState([]); // Existing images from API

  // Gallery: track both new files and existing images separately
  const [galleryFiles, setGalleryFiles] = useState([]); // New files to upload
  const [galleryPreviews, setGalleryPreviews] = useState([]); // Previews for new files
  const [existingGalleryImages, setExistingGalleryImages] = useState([]); // Existing images from API

  const defaultValues = useMemo(
    () => ({
      heroTitle: page?.heroTitle || page?.hero?.title || "",
      heroImageUrl: page?.heroImageUrl || "",
      whyTitle: page?.whyTitle || page?.whySection?.title || `WHY ${page?.name?.toUpperCase() || ""}?`,
      whyDescription: page?.whyDescription || page?.whySection?.description || "",
      whatTitle: page?.whatTitle || page?.whatWeDo?.title || "",
      whatDescription: page?.whatDescription || page?.whatWeDo?.description || "",
      whatImageUrl: page?.whatImageUrl || "",
      solutionsTitle: page?.solutions?.title || `Sustainable Solutions to ${page?.name || ""} Sanitation`,
      solutionsDescription: page?.solutions?.description || "",
    }),
    [page]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(editorSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    reset(defaultValues);

    // Set existing previews
    if (page?.heroComputedUrl || page?.hero?.bgImage) {
      setHeroPreview(page.heroComputedUrl || page.hero?.bgImage);
      setHeroUploadType(page.heroUseUpload ? "file" : "url");
    }

    if (page?.whatComputedUrl || page?.whatWeDo?.image) {
      setWhatPreview(page.whatComputedUrl || page.whatWeDo?.image);
      setWhatUploadType(page.whatUseUpload ? "file" : "url");
    }

    // Set existing solutions images
    if (page?.solutions?.images?.length > 0) {
      setExistingSolutionsImages(
        page.solutions.images.map((img) => ({
          url: img.computedUrl || img.imageUrl,
          id: img.id || img._id || uid(),
        }))
      );
    } else {
      setExistingSolutionsImages([]);
    }

    // Set existing gallery images
    if (page?.gallery?.length > 0) {
      setExistingGalleryImages(
        page.gallery.map((img) => ({
          url: img.computedUrl || img.imageUrl,
          id: img.id || img._id || uid(),
        }))
      );
    } else {
      setExistingGalleryImages([]);
    }

    // Reset new file states
    setHeroFile(null);
    setWhatFile(null);
    setSolutionsFiles([]);
    setSolutionsPreviews([]);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  }, [reset, defaultValues, page]);

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Watch fields
  const wHeroTitle = watch("heroTitle");
  const wHeroImageUrl = watch("heroImageUrl");
  const wWhyTitle = watch("whyTitle");
  const wWhyDescription = watch("whyDescription");
  const wWhatTitle = watch("whatTitle");
  const wWhatDescription = watch("whatDescription");
  const wWhatImageUrl = watch("whatImageUrl");
  const wSolutionsTitle = watch("solutionsTitle");
  const wSolutionsDescription = watch("solutionsDescription");

  // Calculate total images for solutions and gallery
  const totalSolutionsImages = existingSolutionsImages.length + solutionsFiles.length;
  const totalGalleryImages = existingGalleryImages.length + galleryFiles.length;

  // File handlers
  const handleHeroFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      setHeroUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setHeroPreview(dataUrl);
    }
  };

  const handleHeroUrlChange = (url) => {
    setValue("heroImageUrl", url, { shouldDirty: true });
    setHeroPreview(url);
    setHeroFile(null);
    setHeroUploadType("url");
  };

  const handleWhatFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setWhatFile(file);
      setWhatUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setWhatPreview(dataUrl);
    }
  };

  const handleWhatUrlChange = (url) => {
    setValue("whatImageUrl", url, { shouldDirty: true });
    setWhatPreview(url);
    setWhatFile(null);
    setWhatUploadType("url");
  };

  // FIXED: Solutions files handler - append instead of replace
  const handleSolutionsFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Calculate how many more images we can add (max 4 total)
      const remainingSlots = 4 - totalSolutionsImages;

      if (remainingSlots <= 0) {
        alert("Maximum 4 images allowed. Please remove some images first.");
        return;
      }

      // Only take files up to the remaining slots
      const filesToAdd = files.slice(0, remainingSlots);

      // Generate previews for new files
      const newPreviews = await Promise.all(filesToAdd.map(fileToDataURL));

      // Append to existing files and previews
      setSolutionsFiles((prev) => [...prev, ...filesToAdd]);
      setSolutionsPreviews((prev) => [...prev, ...newPreviews]);
    }

    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  // Remove a new solution file (not yet uploaded)
  const removeSolutionFile = (index) => {
    setSolutionsFiles((prev) => prev.filter((_, i) => i !== index));
    setSolutionsPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing solution image
  const removeExistingSolutionImage = (index) => {
    setExistingSolutionsImages((prev) => prev.filter((_, i) => i !== index));
  };

  // FIXED: Gallery files handler - append instead of replace
  const handleGalleryFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Calculate how many more images we can add (max 6 total)
      const remainingSlots = 6 - totalGalleryImages;

      if (remainingSlots <= 0) {
        alert("Maximum 6 images allowed. Please remove some images first.");
        return;
      }

      // Only take files up to the remaining slots
      const filesToAdd = files.slice(0, remainingSlots);

      // Generate previews for new files
      const newPreviews = await Promise.all(filesToAdd.map(fileToDataURL));

      // Append to existing files and previews
      setGalleryFiles((prev) => [...prev, ...filesToAdd]);
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }

    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  // Remove a new gallery file (not yet uploaded)
  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing gallery image
  const removeExistingGalleryImage = (index) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearHeroImage = () => {
    setHeroFile(null);
    setHeroPreview("");
    setValue("heroImageUrl", "", { shouldDirty: true });
  };

  const clearWhatImage = () => {
    setWhatFile(null);
    setWhatPreview("");
    setValue("whatImageUrl", "", { shouldDirty: true });
  };

  const onSubmit = (values) => {
    // Validate minimum images
    if (totalSolutionsImages > 0 && totalSolutionsImages < 1) {
      alert("Solutions section requires at least 1 image.");
      return;
    }

    if (totalGalleryImages > 0 && totalGalleryImages < 3) {
      alert("Gallery section requires at least 3 images.");
      return;
    }

    // Prepare data for API
    const ourWorkData = {
      heroTitle: values.heroTitle,
      whyTitle: values.whyTitle,
      whyDescription: values.whyDescription,
      whatTitle: values.whatTitle,
      whatDescription: values.whatDescription,
      solutionsTitle: values.solutionsTitle,
      solutionsDescription: values.solutionsDescription,
      // Pass existing image IDs to keep
      keepSolutionsImages: existingSolutionsImages.map(img => img.id),
      keepGalleryImages: existingGalleryImages.map(img => img.id),
    };

    // Handle hero image
    if (heroUploadType === "url" && values.heroImageUrl) {
      ourWorkData.heroImageUrl = values.heroImageUrl;
      ourWorkData.heroUseUpload = false;
    } else if (heroFile) {
      ourWorkData.heroUseUpload = true;
    }

    // Handle what image
    if (whatUploadType === "url" && values.whatImageUrl) {
      ourWorkData.whatImageUrl = values.whatImageUrl;
      ourWorkData.whatUseUpload = false;
    } else if (whatFile) {
      ourWorkData.whatUseUpload = true;
    }

    // Prepare files object - only new files
    const files = {};
    if (heroFile) files.heroImage = heroFile;
    if (whatFile) files.whatImage = whatFile;
    if (solutionsFiles.length > 0) files.solutionsImages = solutionsFiles;
    if (galleryFiles.length > 0) files.galleryImages = galleryFiles;

    onSave(ourWorkData, files);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-gray-100/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center py-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold disabled:opacity-50"
            >
              <ArrowLeft size={20} /> Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mt-2">
              Editing: {page?.name || page?.title}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform disabled:opacity-50 ${isDirty ? "" : "opacity-80"
              }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Form sections */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto space-y-6 mt-6"
      >
        {/* 1. Hero Banner */}
        <SectionWrapper
          title="1. Hero Banner"
          open={openSections.hero}
          onToggle={() => toggle("hero")}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-2">Background Image</label>

              {/* Image Source Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setHeroUploadType("file")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${heroUploadType === "file"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setHeroUploadType("url")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${heroUploadType === "url"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <LinkIcon className="w-4 h-4" /> URL
                </button>
              </div>

              {heroUploadType === "file" ? (
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleHeroFileChange}
                    />
                    <div className="bg-blue-500 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 hover:bg-blue-600">
                      <Upload size={16} /> Upload Image
                    </div>
                  </label>
                  {heroFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {heroFile.name}</p>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  {...register("heroImageUrl")}
                  onChange={(e) => handleHeroUrlChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              )}

              <label className="font-semibold block mt-4 mb-2">Hero Title</label>
              <textarea
                {...register("heroTitle")}
                rows={3}
                className="w-full border p-3 rounded-md"
                placeholder="Enter hero title..."
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">Preview</label>
              {heroPreview ? (
                <div className="relative">
                  <img
                    src={heroPreview}
                    alt="Hero Preview"
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearHeroImage}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-full h-48 border border-dashed rounded-md flex items-center justify-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon />
                    <span>No image</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>

        {/* 2. WHY Section */}
        <SectionWrapper
          title={`2. 'WHY ${page?.name?.toUpperCase() || ""}' Section`}
          open={openSections.whySection}
          onToggle={() => toggle("whySection")}
        >
          <label className="font-semibold block mb-2">Title</label>
          <input
            type="text"
            {...register("whyTitle")}
            className="w-full border p-3 rounded-md"
            placeholder={`WHY ${page?.name?.toUpperCase() || ""}?`}
          />

          <label className="font-semibold block mt-4 mb-2">Description</label>
          <textarea
            {...register("whyDescription")}
            rows={6}
            className="w-full border p-3 rounded-md"
            placeholder="Enter why section description..."
          />
        </SectionWrapper>

        {/* 3. WHAT WE DO */}
        <SectionWrapper
          title="3. WHAT WE DO Section"
          open={openSections.whatWeDo}
          onToggle={() => toggle("whatWeDo")}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="font-semibold block mb-2">Title</label>
                <input
                  type="text"
                  {...register("whatTitle")}
                  className="w-full border p-3 rounded-md"
                  placeholder="Enter what we do title..."
                />
              </div>
              <div>
                <label className="font-semibold block mb-2">Description</label>
                <textarea
                  {...register("whatDescription")}
                  rows={6}
                  className="w-full border p-3 rounded-md"
                  placeholder="Enter what we do description..."
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-2">Image</label>

              {/* Image Source Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setWhatUploadType("file")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${whatUploadType === "file"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setWhatUploadType("url")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${whatUploadType === "url"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <LinkIcon className="w-4 h-4" /> URL
                </button>
              </div>

              {whatUploadType === "file" ? (
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleWhatFileChange}
                    />
                    <div className="bg-blue-500 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 hover:bg-blue-600">
                      <Upload size={16} /> Upload Image
                    </div>
                  </label>
                  {whatFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {whatFile.name}</p>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  {...register("whatImageUrl")}
                  onChange={(e) => handleWhatUrlChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* Preview */}
              <div className="mt-3">
                {whatPreview ? (
                  <div className="relative">
                    <img
                      src={whatPreview}
                      alt="What We Do Preview"
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearWhatImage}
                      className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-40 border border-dashed rounded-md flex items-center justify-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon />
                      <span>No image</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* 4. Sustainable Solutions */}
        <SectionWrapper
          title="4. Sustainable Solutions Section"
          open={openSections.solutions}
          onToggle={() => toggle("solutions")}
        >
          <label className="font-semibold block mb-2">Title</label>
          <input
            type="text"
            {...register("solutionsTitle")}
            className="w-full border p-3 rounded-md"
            placeholder={`Sustainable Solutions to ${page?.name || ""} Sanitation`}
          />

          <label className="font-semibold block mt-4 mb-2">Description</label>
          <textarea
            {...register("solutionsDescription")}
            rows={8}
            className="w-full border p-3 rounded-md"
            placeholder="Enter solutions description..."
          />

          <div className="mt-4">
            <label className="font-semibold block mb-2">
              Images ({totalSolutionsImages}/4) - Min: 1, Max: 4
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Add images one by one. New images will be added to existing ones.
            </p>

            {/* Add image button - disabled if max reached */}
            <label className={`cursor-pointer inline-flex items-center gap-2 ${totalSolutionsImages >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleSolutionsFilesChange}
                disabled={totalSolutionsImages >= 4}
              />
              <div className={`bg-blue-500 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 ${totalSolutionsImages >= 4 ? '' : 'hover:bg-blue-600'}`}>
                <Plus size={16} /> Add Image{totalSolutionsImages >= 4 ? ' (Max reached)' : ''}
              </div>
            </label>

            {/* Existing images */}
            {existingSolutionsImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Current images ({existingSolutionsImages.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingSolutionsImages.map((img, index) => (
                    <div key={`exist-sol-${img.id}`} className="relative group">
                      <img
                        src={img.url}
                        alt={`Solution ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=Error";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <IconButton
                          title="Remove"
                          onClick={() => removeExistingSolutionImage(index)}
                        >
                          <Trash2 className="text-white" />
                        </IconButton>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        Existing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New uploads preview */}
            {solutionsPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  New uploads ({solutionsPreviews.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {solutionsPreviews.map((preview, index) => (
                    <div key={`new-sol-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New Solution ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <IconButton
                          title="Remove"
                          onClick={() => removeSolutionFile(index)}
                        >
                          <Trash2 className="text-white" />
                        </IconButton>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {totalSolutionsImages === 0 && (
              <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>No images added yet. Add at least 1 image.</p>
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* 5. Image Gallery */}
        <SectionWrapper
          title="5. Image Gallery"
          open={openSections.gallery}
          onToggle={() => toggle("gallery")}
        >
          <div>
            <label className="font-semibold block mb-2">
              Gallery Images ({totalGalleryImages}/6) - Min: 3, Max: 6
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Add images one by one. New images will be added to existing ones.
            </p>

            {/* Add image button - disabled if max reached */}
            <label className={`cursor-pointer inline-flex items-center gap-2 ${totalGalleryImages >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryFilesChange}
                disabled={totalGalleryImages >= 6}
              />
              <div className={`bg-blue-500 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 ${totalGalleryImages >= 6 ? '' : 'hover:bg-blue-600'}`}>
                <Plus size={16} /> Add Image{totalGalleryImages >= 6 ? ' (Max reached)' : ''}
              </div>
            </label>

            {/* Existing images */}
            {existingGalleryImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Current images ({existingGalleryImages.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingGalleryImages.map((img, index) => (
                    <div key={`exist-gal-${img.id}`} className="relative group">
                      <img
                        src={img.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=Error";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <IconButton
                          title="Remove"
                          onClick={() => removeExistingGalleryImage(index)}
                        >
                          <Trash2 className="text-white" />
                        </IconButton>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        Existing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New uploads preview */}
            {galleryPreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  New uploads ({galleryPreviews.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={`new-gal-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <IconButton
                          title="Remove"
                          onClick={() => removeGalleryFile(index)}
                        >
                          <Trash2 className="text-white" />
                        </IconButton>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {totalGalleryImages === 0 && (
              <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>No images added yet. Add at least 3 images.</p>
              </div>
            )}

            {/* Warning for minimum */}
            {totalGalleryImages > 0 && totalGalleryImages < 3 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Minimum 3 images required. Currently have {totalGalleryImages}.
                </p>
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* Bottom Save (mobile-friendly) */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Page Card Component ---------- */
function PageCard({ page, onEdit, onDelete, isLoading }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4">
      <div className="flex items-center gap-4">
        {/* Cover thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {page.coverComputedUrl ? (
            <img
              src={page.coverComputedUrl}
              alt={page.name || page.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>
        <div>
          <span className="font-semibold text-lg text-gray-800">
            {page.name || page.title}
          </span>
          <p className="text-sm text-gray-500">Order: {page.order || 0}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(page)}
          disabled={isLoading}
          className="text-blue-600 font-semibold py-2 px-4 rounded-md flex items-center gap-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(page)}
          disabled={isLoading}
          className="text-red-600 font-semibold py-2 px-4 rounded-md flex items-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Admin Component ---------- */
export default function AdminOurWork() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast + Modal
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const showToast = (message, type = "success") =>
    setToast({ visible: true, message, type });

  // Fetch all pages from API
  const fetchPages = async () => {
    setIsPageLoading(true);
    const result = await getOurWorkItems();
    if (result.success) {
      setPages(result.data);
    } else {
      showToast(result.error || "Failed to fetch pages", "error");
    }
    setIsPageLoading(false);
  };

  // Load pages on mount
  useEffect(() => {
    fetchPages();
  }, []);

  // Create new page
  const handleCreatePage = async (pageData, coverFile) => {
    setActionLoading(true);
    const result = await createOurWork(pageData, coverFile);

    if (result.success) {
      showToast(`"${pageData.title}" created. Click Edit to add content.`, "success");
      setIsCreating(false);
      fetchPages();
    } else {
      showToast(result.error || "Failed to create page", "error");
    }
    setActionLoading(false);
  };

  // Delete page
  const handleDeletePage = (page) => {
    setModal({
      isOpen: true,
      title: "Confirm Page Deletion",
      message: `Are you sure you want to permanently delete "${page.name || page.title}" and all its content? This action cannot be undone.`,
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteOurWork(page.id);
        if (result.success) {
          showToast("Page deleted.", "info");
          if (currentPage?.id === page.id) {
            setCurrentPage(null);
          }
          fetchPages();
        } else {
          showToast(result.error || "Failed to delete page", "error");
        }
        setActionLoading(false);
        setModal({ ...modal, isOpen: false });
      },
    });
  };

  // Edit page - fetch full details
  const handleEditPage = async (page) => {
    setIsLoading(true);
    const result = await getOurWorkById(page.id);
    if (result.success) {
      setCurrentPage(result.data);
    } else {
      showToast(result.error || "Failed to load page details", "error");
    }
    setIsLoading(false);
  };

  // Save page changes
  const handleSaveForm = async (ourWorkData, files) => {
    if (!currentPage) return;

    setActionLoading(true);
    const result = await updateOurWork(currentPage.id, ourWorkData, files);

    if (result.success) {
      showToast(`"${currentPage.name || currentPage.title}" saved successfully!`, "success");
      // Refresh the current page data
      const refreshed = await getOurWorkById(currentPage.id);
      if (refreshed.success) {
        setCurrentPage(refreshed.data);
      }
      fetchPages();
    } else {
      showToast(result.error || "Failed to save changes", "error");
    }
    setActionLoading(false);
  };

  // Delete all pages
  const handleDeleteAllPages = () => {
    setModal({
      isOpen: true,
      title: "Delete All Pages",
      message: "Are you sure you want to delete ALL pages? This action cannot be undone.",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteAllOurWork();
        if (result.success) {
          showToast("All pages deleted.", "info");
          setPages([]);
          setCurrentPage(null);
        } else {
          showToast(result.error || "Failed to delete all pages", "error");
        }
        setActionLoading(false);
        setModal({ ...modal, isOpen: false });
      },
    });
  };

  // Editor view
  if (currentPage) {
    return (
      <>
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast({ ...toast, visible: false })}
          />
        )}
        <PageEditorRHF
          page={currentPage}
          onBack={() => setCurrentPage(null)}
          onSave={handleSaveForm}
          isLoading={actionLoading}
        />
      </>
    );
  }

  // Dashboard view
  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast({ ...toast, visible: false })}
        />
      )}
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={() => setModal({ ...modal, isOpen: false })}
        isLoading={actionLoading}
      />
      <CreatePageModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSave={handleCreatePage}
        isLoading={actionLoading}
      />

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            Manage Our Work Pages
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchPages}
              disabled={isPageLoading}
              className="bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCcw size={18} className={isPageLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              disabled={actionLoading}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Plus size={18} /> Add New Page
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {isPageLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading pages...</span>
            </div>
          ) : pages.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  {pages.length} page{pages.length !== 1 ? "s" : ""} found
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAllPages}
                  disabled={actionLoading}
                  className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <Trash2 size={14} /> Delete All
                </button>
              </div>
              <ul className="space-y-4">
                {pages.map((page) => (
                  <li key={page.id}>
                    <PageCard
                      page={page}
                      onEdit={handleEditPage}
                      onDelete={handleDeletePage}
                      isLoading={isLoading || actionLoading}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h2 className="text-xl font-semibold">No pages created yet.</h2>
              <p className="mt-1">Click "Add New Page" to get started.</p>
            </div>
          )}
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
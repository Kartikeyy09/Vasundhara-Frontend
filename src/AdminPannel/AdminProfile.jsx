// src/AdminPannel/AdminProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Upload,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  User,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Link as LinkIcon,
  Camera,
  RotateCcw,
  Eye,
} from "lucide-react";

// Import API functions
import {
  getAdminProfile,
  upsertProfile,
  updateProfilePicture,
  deleteProfilePicture,
  resetProfile,
  isValidEmail,
  isValidWebsite,
  isValidMobile,
  fileToDataURL,
} from "../api/admin/profileAdminApi";

/* ---------- Reusable UI Components ---------- */

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
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
        onClick={onDismiss}
        className="ml-2 -mr-1 p-1 rounded-full hover:bg-black/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Confirm",
  confirmColor = "red",
}) {
  if (!isOpen) return null;

  const colorStyles = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  };

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
          <div className={`p-2 rounded-full ${confirmColor === "red" ? "bg-red-100" : "bg-blue-100"}`}>
            <AlertTriangle className={`w-6 h-6 ${confirmColor === "red" ? "text-red-600" : "text-blue-600"}`} />
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
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 flex items-center gap-2 ${colorStyles[confirmColor]}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ isOpen, src, title, onClose }) {
  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <img
          src={src}
          alt={title}
          className="w-full max-h-[70vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

/* ---------- Input Components ---------- */

function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  maxLength,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-gray-300"
            }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
      />
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 text-right">
          {value?.length || 0} / {maxLength}
        </p>
      )}
    </div>
  );
}

/* ---------- Social Links Section ---------- */

function SocialLinksSection({ socialLinks, onChange, disabled }) {
  const socialPlatforms = [
    { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourpage" },
    { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/yourhandle" },
    { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourhandle" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/yourcompany" },
    { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourchannel" },
  ];

  const handleChange = (key, value) => {
    onChange({
      ...socialLinks,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <LinkIcon className="w-5 h-5" />
        Social Media Links
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={socialLinks[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Profile Picture Section ---------- */

function ProfilePictureSection({
  profilePicture,
  computedProfilePicture,
  useUpload,
  onFileChange,
  onUrlChange,
  onRemove,
  onPreview,
  isLoading,
  disabled,
}) {
  const [uploadType, setUploadType] = useState(useUpload ? "file" : "url");
  const [imageUrl, setImageUrl] = useState(profilePicture || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(computedProfilePicture || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setImagePreview(computedProfilePicture || "");
    setImageUrl(profilePicture || "");
    setUploadType(useUpload ? "file" : "url");
  }, [computedProfilePicture, profilePicture, useUpload]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadType("file");
      const dataUrl = await fileToDataURL(file);
      setImagePreview(dataUrl);
      onFileChange(file);
    }
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null);
    setUploadType("url");
    onUrlChange(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Profile Picture / Logo
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Preview */}
        <div className="flex-shrink-0">
          <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "";
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => onPreview(imagePreview)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onRemove}
                    disabled={isLoading || disabled}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <User className="w-12 h-12 mb-2" />
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-4">
          {/* Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Source
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadType("file")}
                disabled={disabled}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "file"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadType("url")}
                disabled={disabled}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${uploadType === "url"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50`}
              >
                <LinkIcon className="w-4 h-4" /> URL
              </button>
            </div>
          </div>

          {uploadType === "file" ? (
            <div>
              <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition ${disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
                disabled={disabled}
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
                placeholder="https://example.com/logo.png"
                disabled={disabled}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Admin Profile Component ---------- */

export default function AdminProfile() {
  // Profile state
  const [profile, setProfile] = useState({
    ngoName: "",
    description: "",
    mobileNo: "",
    email: "",
    website: "",
    address: "",
    addressMap: "",
    profilePicture: "",
    useUpload: false,
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  const [computedProfilePicture, setComputedProfilePicture] = useState("");

  // File upload state
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Modals
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    confirmText: "Confirm",
    confirmColor: "red",
  });

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    src: "",
    title: "",
  });

  // Toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  // Fetch profile
  const fetchProfile = async () => {
    setIsLoading(true);
    const result = await getAdminProfile();
    if (result.success && result.data) {
      setProfile({
        ngoName: result.data.ngoName || "",
        description: result.data.description || "",
        mobileNo: result.data.mobileNo || "",
        email: result.data.email || "",
        website: result.data.website || "",
        address: result.data.address || "",
        addressMap: result.data.addressMap || "",
        profilePicture: result.data.profilePicture || "",
        useUpload: result.data.useUpload || false,
        socialLinks: result.data.socialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
        },
      });
      setComputedProfilePicture(result.data.computedProfilePicture || "");
    } else {
      showToast(result.error || "Failed to fetch profile", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!profile.ngoName || profile.ngoName.trim() === "") {
      newErrors.ngoName = "NGO Name is required";
    }

    if (!profile.mobileNo || profile.mobileNo.trim() === "") {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!isValidMobile(profile.mobileNo)) {
      newErrors.mobileNo = "Invalid mobile number format";
    }

    if (profile.email && !isValidEmail(profile.email)) {
      newErrors.email = "Invalid email format";
    }

    if (profile.website && !isValidWebsite(profile.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    if (profile.description && profile.description.length > 5000) {
      newErrors.description = "Description cannot exceed 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) {
      showToast("Please fix the validation errors", "error");
      return;
    }

    setIsSaving(true);

    const profileData = {
      ngoName: profile.ngoName.trim(),
      description: profile.description.trim(),
      mobileNo: profile.mobileNo.trim(),
      email: profile.email.trim(),
      website: profile.website.trim(),
      address: profile.address.trim(),
      addressMap: profile.addressMap.trim(),
      socialLinks: profile.socialLinks,
    };

    // If URL mode, include the URL
    if (!profilePictureFile && profile.profilePicture) {
      profileData.profilePicture = profile.profilePicture;
      profileData.useUpload = false;
    }

    const result = await upsertProfile(profileData, profilePictureFile);

    if (result.success) {
      showToast(result.message || "Profile saved successfully!");
      setProfilePictureFile(null);
      if (result.data) {
        setComputedProfilePicture(result.data.computedProfilePicture || "");
        setProfile((prev) => ({
          ...prev,
          profilePicture: result.data.profilePicture || "",
          useUpload: result.data.useUpload || false,
        }));
      }
    } else {
      showToast(result.error || "Failed to save profile", "error");
    }

    setIsSaving(false);
  };

  // Handle profile picture file change
  const handleProfilePictureFileChange = (file) => {
    setProfilePictureFile(file);
  };

  // Handle profile picture URL change
  const handleProfilePictureUrlChange = (url) => {
    setProfile((prev) => ({
      ...prev,
      profilePicture: url,
      useUpload: false,
    }));
    setProfilePictureFile(null);
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Profile Picture",
      message: "Are you sure you want to remove the profile picture?",
      confirmText: "Remove",
      confirmColor: "red",
      onConfirm: async () => {
        setIsSaving(true);
        const result = await deleteProfilePicture();
        if (result.success) {
          showToast("Profile picture removed successfully!");
          setProfile((prev) => ({
            ...prev,
            profilePicture: "",
            useUpload: false,
          }));
          setComputedProfilePicture("");
          setProfilePictureFile(null);
        } else {
          showToast(result.error || "Failed to remove profile picture", "error");
        }
        setIsSaving(false);
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  // Reset profile
  const handleResetProfile = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reset Profile",
      message:
        "Are you sure you want to reset the profile to default values? This action cannot be undone.",
      confirmText: "Reset",
      confirmColor: "red",
      onConfirm: async () => {
        setIsSaving(true);
        const result = await resetProfile();
        if (result.success) {
          showToast("Profile reset to defaults successfully!");
          if (result.data) {
            setProfile({
              ngoName: result.data.ngoName || "Your NGO Name",
              description: result.data.description || "",
              mobileNo: result.data.mobileNo || "+91 00000 00000",
              email: result.data.email || "",
              website: result.data.website || "",
              address: result.data.address || "",
              addressMap: result.data.addressMap || "",
              profilePicture: result.data.profilePicture || "",
              useUpload: result.data.useUpload || false,
              socialLinks: result.data.socialLinks || {
                facebook: "",
                twitter: "",
                instagram: "",
                linkedin: "",
                youtube: "",
              },
            });
            setComputedProfilePicture(result.data.computedProfilePicture || "");
          }
          setProfilePictureFile(null);
          setErrors({});
        } else {
          showToast(result.error || "Failed to reset profile", "error");
        }
        setIsSaving(false);
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <span className="text-gray-600 text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
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
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          isLoading={isSaving}
          confirmText={confirmModal.confirmText}
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        />

        <PreviewModal
          isOpen={previewModal.isOpen}
          src={previewModal.src}
          title={previewModal.title}
          onClose={() => setPreviewModal({ isOpen: false, src: "", title: "" })}
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                Organization Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization's public profile and contact information
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchProfile}
                disabled={isLoading || isSaving}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50"
              >
                <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={handleResetProfile}
                disabled={isSaving}
                className="bg-red-50 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 disabled:opacity-50"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-6">
          <ProfilePictureSection
            profilePicture={profile.profilePicture}
            computedProfilePicture={computedProfilePicture}
            useUpload={profile.useUpload}
            onFileChange={handleProfilePictureFileChange}
            onUrlChange={handleProfilePictureUrlChange}
            onRemove={handleRemoveProfilePicture}
            onPreview={(src) =>
              setPreviewModal({ isOpen: true, src, title: "Profile Picture" })
            }
            isLoading={isSaving}
            disabled={isSaving}
          />
        </div>

        {/* Organization Details */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Organization Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField
                label="NGO Name"
                icon={Building2}
                value={profile.ngoName}
                onChange={(value) => handleFieldChange("ngoName", value)}
                placeholder="Your Organization Name"
                required
                error={errors.ngoName}
                disabled={isSaving}
              />
            </div>

            <InputField
              label="Mobile Number"
              icon={Phone}
              type="tel"
              value={profile.mobileNo}
              onChange={(value) => handleFieldChange("mobileNo", value)}
              placeholder="+91 99999 99999"
              required
              error={errors.mobileNo}
              disabled={isSaving}
            />

            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              value={profile.email}
              onChange={(value) => handleFieldChange("email", value)}
              placeholder="contact@organization.org"
              error={errors.email}
              disabled={isSaving}
            />

            <InputField
              label="Website"
              icon={Globe}
              type="url"
              value={profile.website}
              onChange={(value) => handleFieldChange("website", value)}
              placeholder="https://www.organization.org"
              error={errors.website}
              disabled={isSaving}
            />

            <InputField
              label="Address"
              icon={MapPin}
              value={profile.address}
              onChange={(value) => handleFieldChange("address", value)}
              placeholder="Full address"
              disabled={isSaving}
            />
            <InputField
              label="Address Map"
              icon={MapPin}
              value={profile.addressMap}
              onChange={(value) => handleFieldChange("addressMap", value)}
              placeholder="Full address"
              disabled={isSaving}
            />





            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                value={profile.description}
                onChange={(value) => handleFieldChange("description", value)}
                placeholder="Tell visitors about your organization..."
                rows={5}
                maxLength={5000}
                disabled={isSaving}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <SocialLinksSection
            socialLinks={profile.socialLinks}
            onChange={(socialLinks) =>
              setProfile((prev) => ({ ...prev, socialLinks }))
            }
            disabled={isSaving}
          />
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Make sure to save your changes before leaving this page.
            </p>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Profile
            </button>
          </div>
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
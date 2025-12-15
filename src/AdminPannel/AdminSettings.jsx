import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  X,
  Info,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Globe,
  Link2,
  Camera,
  Bird,
  Share2,
  PlayCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * AdminSettings.jsx
 * - General NGO settings + Social Media links
 * - react-hook-form + yup
 * - LocalStorage persistence
 * - Header scrolls with content (non-sticky)
 * - Reset changes, URL normalization, Toasts
 */

const SETTINGS_KEY = "ngoGeneralSettings";

const defaultSettings = {
  orgName: "",
  phone: "",
  email: "",
  address: "",
  socials: {
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
  },
};

const phoneRegex = /^[0-9+()\-.\s]{7,20}$/;

// Transform empty strings to null for optional URL fields
const emptyToNull = (value, originalValue) =>
  typeof originalValue === "string" && originalValue.trim() === "" ? null : value;

const schema = yup.object({
  orgName: yup.string().required("NGO name is required").min(2).max(120),
  phone: yup
    .string()
    .required("Contact number is required")
    .matches(phoneRegex, "Enter a valid phone number"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  address: yup.string().required("Address is required").max(2000, "Too long"),
  socials: yup.object({
    website: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    facebook: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    instagram: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    twitter: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    linkedin: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    youtube: yup.string().url("Enter a valid URL").nullable().transform(emptyToNull),
    // WhatsApp: allow URL or phone; validation stays flexible
    whatsapp: yup.string().nullable().transform(emptyToNull),
  }),
});

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = {
    success: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle /> },
    error: { bg: "bg-red-100", text: "text-red-800", icon: <AlertTriangle /> },
    info: { bg: "bg-blue-100", text: "text-blue-800", icon: <Info /> },
  };
  const style = styles[type] || styles.info;

  return (
    <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-lg shadow-lg ${style.bg} ${style.text}`}>
      {style.icon}
      <span className="font-medium">{message}</span>
      <button type="button" onClick={onDismiss} className="ml-2 -mr-1 p-1 rounded-full hover:bg-black/10">
        <X size={16} />
      </button>
    </div>
  );
}

function Section({ title, open, onToggle, children }) {
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

function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-sm text-red-600 mt-1">{error.message}</p>;
}

const normalizeUrl = (val) => {
  if (!val) return "";
  const v = val.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  return `https://${v}`;
};

// Build "Open" link href safely for each social
const getOpenHref = (key, val) => {
  if (!val) return null;
  const v = val.trim();

  if (key === "whatsapp") {
    // If it's already a link, return as is
    if (/^https?:\/\//i.test(v)) return v;
    // If it's a phone-like string, build wa.me link
    const digits = v.replace(/\D/g, "");
    if (digits.length >= 7) return `https://wa.me/${digits}`;
    // Fallback to normal URL normalization
    return normalizeUrl(v);
  }

  if (/^https?:\/\//i.test(v) || /^mailto:|^tel:/i.test(v)) return v;
  return normalizeUrl(v);
};

export default function AdminSettings() {
  const [open, setOpen] = useState({
    general: true,
    social: true,
  });

  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [savedValues, setSavedValues] = useState(defaultSettings);

  // Load saved settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedValues({
          ...defaultSettings,
          ...parsed,
          socials: { ...defaultSettings.socials, ...(parsed.socials || {}) },
        });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
      setSavedValues(defaultSettings);
      setToast({ visible: true, message: "Failed to load settings", type: "error" });
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => savedValues, [savedValues]),
    mode: "onChange",
  });

  // Keep form in sync when savedValues change
  useEffect(() => {
    reset(savedValues);
  }, [savedValues, reset]);

  const onSubmit = (values) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(values));
      setSavedValues(values);
      reset(values); // clear dirty state
      setToast({ visible: true, message: "Settings saved successfully!", type: "success" });
    } catch (e) {
      console.error(e);
      setToast({ visible: true, message: "Failed to save settings", type: "error" });
    }
  };

  const onResetChanges = () => {
    reset(savedValues);
  };

  // Address char count
  const addressVal = watch("address") || "";

  // Socials config
  const socialKeys = [
    { key: "website", label: "Website", icon: Globe, placeholder: "https://www.yourngo.org" },
    { key: "facebook", label: "Facebook", icon: Link2, placeholder: "https://facebook.com/yourpage" },
    { key: "instagram", label: "Instagram", icon: Camera, placeholder: "https://instagram.com/yourhandle" },
    { key: "twitter", label: "Twitter/X", icon: Bird, placeholder: "https://x.com/yourhandle" },
    { key: "linkedin", label: "LinkedIn", icon: Share2, placeholder: "https://linkedin.com/company/yourpage" },
    { key: "youtube", label: "YouTube", icon: PlayCircle, placeholder: "https://youtube.com/@yourchannel" },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/919876543210 or phone" },
  ];

  // Normalize non-phone URLs on blur
  const handleUrlBlur = (field) => (e) => {
    const val = e.target.value;
    if (!val || /^(\+|[0-9(])/.test(val)) {
      // Likely a phone number or empty (esp. for WhatsApp) -> don't force https
      return;
    }
    const normalized = normalizeUrl(val);
    setValue(field, normalized, { shouldDirty: true });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
        />
      )}

      {/* Header (scrolls with page) */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">Site Settings</h1>
            <p className="text-gray-600 text-sm">Manage your NGO’s general information and social links.</p>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <button
                type="button"
                onClick={onResetChanges}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300"
                title="Discard unsaved changes"
              >
                Reset Changes
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className={`bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform ${
                isDirty ? "" : "opacity-85"
              }`}
              title="Save Settings"
            >
              <Save size={18} /> Save
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto mt-6 space-y-6">
        {/* General/Organization */}
        <Section
          title="1. Organization Details"
          open={open.general}
          onToggle={() => setOpen((p) => ({ ...p, general: !p.general }))}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block mb-2">
                NGO Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("orgName")}
                className="w-full border p-3 rounded-md"
                placeholder="Your NGO Name"
              />
              <FieldError error={errors.orgName} />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full border p-3 pl-10 rounded-md"
                  placeholder="contact@yourngo.org"
                />
              </div>
              <FieldError error={errors.email} />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Contact No. <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  {...register("phone")}
                  className="w-full border p-3 pl-10 rounded-md"
                  placeholder="+91 98765 43210"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Digits, +, spaces, dashes allowed.</p>
              <FieldError error={errors.phone} />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  rows={4}
                  {...register("address")}
                  className="w-full border p-3 pl-10 rounded-md"
                  placeholder="Full address with city, state, PIN"
                />
              </div>
              <div className="flex items-center justify-between">
                <FieldError error={errors.address} />
                <p className="text-xs text-gray-500 ml-auto">{addressVal.length}/2000</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Social Media */}
        <Section
          title="2. Social Media Links"
          open={open.social}
          onToggle={() => setOpen((p) => ({ ...p, social: !p.social }))}
        >
          <p className="text-sm text-gray-600 mb-2">
            Optional. Enter full URLs. We’ll auto-add https:// if you forget. WhatsApp can be a phone number or a wa.me link.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {socialKeys.map(({ key, label, icon: Icon, placeholder }) => {
              const name = `socials.${key}`;
              const fieldError = errors?.socials?.[key];
              const val = watch(name);
              const href = getOpenHref(key, val);

              return (
                <div key={key}>
                  <label className="font-semibold block mb-2">{label}</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        {...register(name)}
                        onBlur={handleUrlBlur(name)}
                        className="w-full border p-3 pl-10 rounded-md"
                        placeholder={placeholder}
                      />
                    </div>

                    {val ? (
                      <a
                        href={href || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 text-sm font-semibold px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md"
                        title="Open link"
                      >
                        Open
                      </a>
                    ) : null}
                  </div>
                  <FieldError error={fieldError} />
                </div>
              );
            })}
          </div>
        </Section>

        {/* Bottom Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform"
          >
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
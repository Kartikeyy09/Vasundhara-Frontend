// src/Pages/ContactUs.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MapPin,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Building2,
} from "lucide-react";
import { submitInquiry } from "../api/public/inquiriesApi";
import { getPublicProfile } from "../api/admin/profileAdminApi";

// Validation Schema
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
      "Please enter a valid Indian phone number"
    ),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  organization: yup
    .string()
    .required("Organization/Company is required")
    .min(2, "Organization must be at least 2 characters"),
  subject: yup
    .string()
    .max(100, "Subject must not exceed 100 characters"),
  message: yup
    .string()
    .max(1000, "Message must not exceed 1000 characters"),
});

// Default contact info (fallback)
const DEFAULT_CONTACT = {
  ngoName: "Vasundhara Sanrakshan Samajik Sansthan",
  address: "House number 345, Sector H - Ayodhya Nagar, Bhopal - 462041 India",
  mobileNo: "+91 79746 91046",
  email: "vasundhara6757@gmail.com",
  website: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
  addressMap: "",
};

// Contact Info Card Component
function ContactCard({ icon: Icon, title, content, href, isLoading }) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? {
    href,
    target: href.startsWith('http') ? '_blank' : undefined,
    rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
  } : {};

  return (
    <CardWrapper
      {...cardProps}
      className="flex-1 bg-white border border-green-900 shadow-md rounded-2xl p-8 text-center transition transform hover:-translate-y-2 hover:shadow-lg cursor-pointer flex flex-col justify-center group"
    >
      <div className="flex justify-center mb-4">
        <div className="bg-green-900 p-4 rounded-full text-white group-hover:scale-110 transition-transform">
          <Icon size={32} />
        </div>
      </div>
      <h3 className="font-semibold text-green-900 mb-2">{title}</h3>
      {isLoading ? (
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mx-auto" />
      ) : (
        <p className="text-gray-700 text-sm md:text-base">{content}</p>
      )}
    </CardWrapper>
  );
}

// Social Link Button Component
function SocialButton({ icon: Icon, href, label }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="p-3 bg-green-900 text-white rounded-full hover:bg-green-800 transition-colors hover:scale-110 transform"
    >
      <Icon size={20} />
    </a>
  );
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiError, setApiError] = useState("");

  // Profile state
  const [profile, setProfile] = useState(DEFAULT_CONTACT);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      organization: "",
      subject: "",
      message: "",
    },
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      const result = await getPublicProfile();

      if (result.success && result.data) {
        setProfile({
          ngoName: result.data.ngoName || DEFAULT_CONTACT.ngoName,
          address: result.data.address || DEFAULT_CONTACT.address,
          mobileNo: result.data.mobileNo || DEFAULT_CONTACT.mobileNo,
          email: result.data.email || DEFAULT_CONTACT.email,
          website: result.data.website || DEFAULT_CONTACT.website,
          description: result.data.description || "",
          profilePicture: result.data.computedProfilePicture || "",
          addressMap: result.data.addressMap || "",
          socialLinks: {
            facebook: result.data.socialLinks?.facebook || "",
            twitter: result.data.socialLinks?.twitter || "",
            instagram: result.data.socialLinks?.instagram || "",
            linkedin: result.data.socialLinks?.linkedin || "",
            youtube: result.data.socialLinks?.youtube || "",
          },
        });
      }

      setIsLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setApiError("");

    // Format phone number
    const formattedData = {
      ...data,
      phone: data.phone.startsWith("+91") ? data.phone : `+91-${data.phone}`,
    };

    const result = await submitInquiry(formattedData);

    if (result.success) {
      setSubmitStatus("success");
      reset();

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } else {
      setSubmitStatus("error");
      setApiError(result.error || "Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  // Generate Google Maps URL from address
  const getMapUrl = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // Format phone number for tel: link
  const getPhoneLink = (phone) => {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    return `tel:${cleanPhone}`;
  };

  // Check if any social links exist
  const hasSocialLinks = Object.values(profile.socialLinks || {}).some(link => link && link.trim() !== '');

  return (
    <section className="bg-white py-16 mt-16">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you.
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {/* Organization Name */}
          {!isLoadingProfile && profile.ngoName && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-800">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">{profile.ngoName}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Left: Contact Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-green-900 h-full flex flex-col"
          >
            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Thank you for contacting us!</p>
                  <p className="text-sm">We'll get back to you soon.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Failed to submit form</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              </div>
            )}

            {/* Row 1: Name + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Enter your name"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="+91-9999999999"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Email + City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Enter your city"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.city ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Organization + Subject */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization/Company <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("organization")}
                  placeholder="Enter organization name"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.organization ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.organization && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.organization.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="Enter subject (optional)"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition ${errors.subject ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                {...register("message")}
                rows="8"
                placeholder="Write your message here... (optional)"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none transition resize-none ${errors.message ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  SUBMIT
                </>
              )}
            </button>
          </form>

          {/* Right: Contact Info Cards */}
          <div className="grid gap-6 h-full">
            {/* Address Card */}
            <ContactCard
              icon={MapPin}
              title="Our Address"
              content={profile.address}
              href={getMapUrl(profile.address)}
              isLoading={isLoadingProfile}
            />

            {/* Phone Card */}
            <ContactCard
              icon={Phone}
              title="Call Us"
              content={profile.mobileNo}
              href={getPhoneLink(profile.mobileNo)}
              isLoading={isLoadingProfile}
            />

            {/* Email Card */}
            <ContactCard
              icon={Mail}
              title="Email Us"
              content={profile.email}
              href={profile.email ? `mailto:${profile.email}` : undefined}
              isLoading={isLoadingProfile}
            />

            {/* Website Card (if available) */}

          </div>
        </div>

        {/* Social Media Links */}
        {hasSocialLinks && (
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Connect With Us</h3>
            <div className="flex justify-center gap-4">
              <SocialButton
                icon={Facebook}
                href={profile.socialLinks.facebook}
                label="Facebook"
              />
              <SocialButton
                icon={Twitter}
                href={profile.socialLinks.twitter}
                label="Twitter"
              />
              <SocialButton
                icon={Instagram}
                href={profile.socialLinks.instagram}
                label="Instagram"
              />
              <SocialButton
                icon={Linkedin}
                href={profile.socialLinks.linkedin}
                label="LinkedIn"
              />
              <SocialButton
                icon={Youtube}
                href={profile.socialLinks.youtube}
                label="YouTube"
              />
            </div>
          </div>
        )}

        {/* Bottom: Google Map Full Width */}
        {/* Bottom: Google Map Full Width */}
        <div className="mt-16 w-full h-[450px] rounded-xl overflow-hidden shadow-lg">
          {isLoadingProfile ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : profile.addressMap ? (
            <iframe
              src={profile.addressMap}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Map location not available</p>
                <p className="text-sm mt-2">{profile.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Organization Description (if available) */}
        {!isLoadingProfile && profile.description && (
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-green-900 mb-4">About Us</h3>
            <p className="text-gray-600 leading-relaxed">{profile.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
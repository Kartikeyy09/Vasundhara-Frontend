// src/AdminPannel/AdminContactUs.jsx
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  MessageSquare,
  Calendar,
  User,
  Search,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Inbox,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  MailOpen,
} from "lucide-react";

// Import API functions
import {
  getInquiries,
  getInquiryById,
  deleteInquiry,
  deleteMultipleInquiries,
  getInquiryStats,
  filterInquiriesByStatus,
  searchInquiries,
} from "../api/admin/inquiryAdminApi";

/* ---------- Constants ---------- */
const ITEMS_PER_PAGE = 10;

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
  confirmText = "Delete",
}) {
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
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inquiry Detail Modal ---------- */
function InquiryDetailModal({ isOpen, inquiry, onClose, isLoading }) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Inquiry Details
              </h3>
              <p className="text-sm text-gray-500">
                {inquiry?.formattedReceivedAt || ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : inquiry ? (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${inquiry.status === "New"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {inquiry.status === "New" ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <MailOpen className="w-4 h-4" />
                )}
                {inquiry.status}
              </span>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Name
                  </p>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {inquiry.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    City
                  </p>
                  <p className="font-medium text-gray-900">
                    {inquiry.city || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Organization
                  </p>
                  <p className="font-medium text-gray-900">
                    {inquiry.organization || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 uppercase tracking-wide mb-1">
                Subject
              </p>
              <p className="font-semibold text-gray-900">{inquiry.subject}</p>
            </div>

            {/* Message */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Message
              </p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Received: {inquiry.formattedReceivedAt}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Inquiry not found</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
          {inquiry && (
            <a
              href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Reply via Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Inquiry Card Component ---------- */
function InquiryCard({ inquiry, onView, onDelete, isSelected, onSelect }) {
  const isNew = inquiry.status === "New";

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition group ${isNew ? "border-l-4 border-l-blue-500" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(inquiry.id, e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {inquiry.name}
              </h4>
              {isNew && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {inquiry.formattedReceivedAt}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-1 truncate">
            {inquiry.subject}
          </p>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {inquiry.message}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {inquiry.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {inquiry.phone}
            </span>
            {inquiry.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {inquiry.city}
              </span>
            )}
            {inquiry.organization && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {inquiry.organization}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onView(inquiry)}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(inquiry)}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats Card Component ---------- */
function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

/* ---------- Main Admin Contact Us Component ---------- */
export default function AdminContactUs() {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter and search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    inquiry: null,
    isLoading: false,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
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

  // Fetch inquiries
  const fetchInquiries = async () => {
    setIsLoading(true);
    const result = await getInquiries();
    if (result.success) {
      setInquiries(result.data);
      applyFilters(result.data, statusFilter, searchTerm);
    } else {
      showToast(result.error || "Failed to fetch inquiries", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Apply filters when filter or search changes
  const applyFilters = (data, status, search) => {
    let filtered = filterInquiriesByStatus(data, status);
    filtered = searchInquiries(filtered, search);
    setFilteredInquiries(filtered);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  useEffect(() => {
    applyFilters(inquiries, statusFilter, searchTerm);
  }, [statusFilter, searchTerm, inquiries]);

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = getInquiryStats(inquiries);

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginatedInquiries.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  // View inquiry details
  const handleViewInquiry = async (inquiry) => {
    setDetailModal({ isOpen: true, inquiry: null, isLoading: true });

    const result = await getInquiryById(inquiry.id);
    if (result.success) {
      setDetailModal({ isOpen: true, inquiry: result.data, isLoading: false });
      // Update the inquiry in the list (status might have changed to Read)
      setInquiries((prev) =>
        prev.map((i) => (i.id === result.data.id ? result.data : i))
      );
    } else {
      showToast(result.error || "Failed to load inquiry details", "error");
      setDetailModal({ isOpen: false, inquiry: null, isLoading: false });
    }
  };

  // Delete single inquiry
  const handleDeleteInquiry = (inquiry) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Inquiry",
      message: `Are you sure you want to delete the inquiry from "${inquiry.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteInquiry(inquiry.id);
        if (result.success) {
          showToast("Inquiry deleted successfully!");
          setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
        } else {
          showToast(result.error || "Failed to delete inquiry", "error");
        }
        setActionLoading(false);
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  // Delete selected inquiries
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: "Delete Selected Inquiries",
      message: `Are you sure you want to delete ${selectedIds.length} selected inquiries? This action cannot be undone.`,
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteMultipleInquiries(selectedIds);
        if (result.success) {
          showToast(`${result.deletedCount} inquiries deleted successfully!`);
          setInquiries((prev) =>
            prev.filter((i) => !selectedIds.includes(i.id))
          );
          setSelectedIds([]);
        } else {
          showToast(result.error || "Failed to delete inquiries", "error");
        }
        setActionLoading(false);
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
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
          isLoading={actionLoading}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        />

        <InquiryDetailModal
          isOpen={detailModal.isOpen}
          inquiry={detailModal.inquiry}
          isLoading={detailModal.isLoading}
          onClose={() =>
            setDetailModal({ isOpen: false, inquiry: null, isLoading: false })
          }
        />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                Contact Inquiries
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and respond to contact form submissions
              </p>
            </div>
            <button
              onClick={fetchInquiries}
              disabled={isLoading}
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard
            icon={Inbox}
            label="Total Inquiries"
            value={stats.total}
            color="bg-gray-100 text-gray-600"
          />
          <StatsCard
            icon={Clock}
            label="New Inquiries"
            value={stats.new}
            color="bg-blue-100 text-blue-600"
          />
          <StatsCard
            icon={MailOpen}
            label="Read Inquiries"
            value={stats.read}
            color="bg-green-100 text-green-600"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("new")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${statusFilter === "new"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Clock className="w-4 h-4" />
                New
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${statusFilter === "read"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <MailOpen className="w-4 h-4" />
                Read
              </button>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-2xl shadow p-6">
          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700 font-medium">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}

          {/* Select All */}
          {paginatedInquiries.length > 0 && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <input
                type="checkbox"
                checked={
                  paginatedInquiries.length > 0 &&
                  paginatedInquiries.every((i) => selectedIds.includes(i.id))
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Select all on this page
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading inquiries...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No inquiries found</p>
              <p className="text-sm mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Contact form submissions will appear here"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedInquiries.map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    isSelected={selectedIds.includes(inquiry.id)}
                    onSelect={handleSelectOne}
                    onView={handleViewInquiry}
                    onDelete={handleDeleteInquiry}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredInquiries.length
                    )}{" "}
                    of {filteredInquiries.length} inquiries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
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
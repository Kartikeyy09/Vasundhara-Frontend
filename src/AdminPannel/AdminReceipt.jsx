// src/AdminPannel/AdminReceipt.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Eye, Pencil, Trash2, X, RefreshCw, AlertCircle } from "lucide-react";
import InvoiceForm from "./Components/invoice/InvoiceForm";
import InvoicePreview from "./Components/invoice/InvoicePreview";
import { useToast } from "../common/ToastContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import {
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} from "../api/admin/invoiceAdminApi";

// Calculate totals/taxes for invoice display
const calculateInvoiceDetails = (invoice) => {
    if (!invoice) return null;

    const items = (invoice.items || []).map((item) => {
        const amount = parseFloat(item.amount || 0) || 0;
        const cgstRate = parseFloat(item.cgstRate || 0) || 0;
        const sgstRate = parseFloat(item.sgstRate || 0) || 0;
        const igstRate = parseFloat(item.igstRate || 0) || 0;
        const cgstAmount = amount * (cgstRate / 100);
        const sgstAmount = amount * (sgstRate / 100);
        const igstAmount = amount * (igstRate / 100);
        const total = amount + cgstAmount + sgstAmount + igstAmount;
        return {
            ...item,
            amount,
            cgstRate,
            sgstRate,
            igstRate,
            cgstAmount,
            sgstAmount,
            igstAmount,
            total,
        };
    });

    const totalAmount = items.reduce((s, i) => s + i.amount, 0);
    const totalCgst = items.reduce((s, i) => s + i.cgstAmount, 0);
    const totalSgst = items.reduce((s, i) => s + i.sgstAmount, 0);
    const totalIgst = items.reduce((s, i) => s + i.igstAmount, 0);
    const grandTotal = items.reduce((s, i) => s + i.total, 0);

    const taxSummary = items.reduce((acc, item) => {
        const hsn = item.hsn || "N/A";
        if (!acc[hsn]) {
            acc[hsn] = {
                taxableValue: 0,
                cgstRate: item.cgstRate,
                sgstRate: item.sgstRate,
                igstRate: item.igstRate,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0,
            };
        }
        acc[hsn].taxableValue += item.amount;
        acc[hsn].cgstAmount += item.cgstAmount;
        acc[hsn].sgstAmount += item.sgstAmount;
        acc[hsn].igstAmount += item.igstAmount;
        return acc;
    }, {});

    return {
        ...invoice,
        items,
        totalAmount,
        totalCgst,
        totalSgst,
        totalIgst,
        grandTotal,
        totalTaxAmount: totalCgst + totalSgst + totalIgst,
        taxSummary,
    };
};

const formatDate = (d) => {
    if (!d) return "";
    try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        return dt.toLocaleDateString("en-GB");
    } catch {
        return "";
    }
};

export default function AdminReceipt() {
    const [invoices, setInvoices] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [error, setError] = useState(null);

    const toast = useToast();

    // Fetch invoices from API
    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getInvoices();

            if (result.success) {
                setInvoices(result.data || []);
            } else {
                throw new Error(result.error || 'Failed to fetch invoices');
            }
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError(err.message);
            toast.error('Failed to load invoices: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    // Load invoices on mount
    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleAddNew = () => {
        setEditingInvoice(null);
        setIsFormVisible(true);
    };

    const handleEdit = (invoice) => {
        setEditingInvoice(invoice);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this invoice? This cannot be undone.")) return;

        setIsDeleting(id);

        try {
            const result = await deleteInvoice(id);

            if (result.success) {
                setInvoices((prev) => prev.filter((i) => i.id !== id));
                toast.success('Invoice deleted successfully');
            } else {
                throw new Error(result.error || 'Failed to delete invoice');
            }
        } catch (err) {
            console.error('Error deleting invoice:', err);
            toast.error('Failed to delete invoice: ' + err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    const handlePreview = (invoice) => {
        setViewingInvoice(invoice);
    };

    const handleSave = async (formData) => {
        setIsSaving(true);

        try {
            let result;

            if (editingInvoice) {
                // Update existing invoice
                result = await updateInvoice(editingInvoice.id, formData);

                if (result.success) {
                    setInvoices((prev) =>
                        prev.map((i) =>
                            i.id === editingInvoice.id ? result.data : i
                        )
                    );
                    toast.success('Invoice updated successfully');
                }
            } else {
                // Create new invoice
                result = await createInvoice(formData);

                if (result.success) {
                    setInvoices((prev) => [result.data, ...prev]);
                    toast.success('Invoice created successfully');
                    // Optional: open preview after create
                    setViewingInvoice(result.data);
                }
            }

            if (!result.success) {
                throw new Error(result.error || 'Failed to save invoice');
            }

            setIsFormVisible(false);
            setEditingInvoice(null);
        } catch (err) {
            console.error('Error saving invoice:', err);
            toast.error('Failed to save invoice: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelForm = () => {
        setIsFormVisible(false);
        setEditingInvoice(null);
    };

    const handleRefresh = () => {
        fetchInvoices();
    };

    // Loading State
    if (isLoading && invoices.length === 0) {
        return (
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="bg-white border rounded-xl shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center">
                        <LoadingSpinner size="lg" text="Loading invoices..." />
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error && invoices.length === 0) {
        return (
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="bg-white border rounded-xl shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Invoices</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700"
                        >
                            <RefreshCw size={18} /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No Invoices Yet</h3>
            <p className="text-gray-500">Click the button below to create your first invoice.</p>
            <button
                onClick={handleAddNew}
                className="mt-6 inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-sm"
            >
                <Plus size={18} /> New Invoice
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-white border rounded-xl shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-green-700">Invoice Management</h1>
                        <p className="text-gray-600 text-sm">Create, preview, print, and manage your invoices.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            type="button"
                            onClick={handleAddNew}
                            className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-transform"
                        >
                            <Plus size={18} /> New Invoice
                        </button>
                    </div>
                </div>
            </div>

            {/* Main */}
            {!isFormVisible ? (
                <div className="max-w-6xl mx-auto mt-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {invoices.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billed To</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {invoices.map((inv) => {
                                            const calc = calculateInvoiceDetails(inv);
                                            const isCurrentlyDeleting = isDeleting === inv.id;

                                            return (
                                                <tr key={inv.id} className={`hover:bg-gray-50 ${isCurrentlyDeleting ? 'opacity-50' : ''}`}>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                                        {calc.invoiceNo}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {calc.buyerName}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(calc.invoiceDate)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                                        ₹{(calc.grandTotal || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                className="p-2 rounded-full hover:bg-gray-100 text-blue-600 disabled:opacity-50"
                                                                title="Preview"
                                                                onClick={() => handlePreview(inv)}
                                                                disabled={isCurrentlyDeleting}
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-full hover:bg-gray-100 text-yellow-600 disabled:opacity-50"
                                                                title="Edit"
                                                                onClick={() => handleEdit(inv)}
                                                                disabled={isCurrentlyDeleting}
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-full hover:bg-gray-100 text-red-600 disabled:opacity-50"
                                                                title="Delete"
                                                                onClick={() => handleDelete(inv.id)}
                                                                disabled={isCurrentlyDeleting}
                                                            >
                                                                {isCurrentlyDeleting ? (
                                                                    <RefreshCw size={18} className="animate-spin" />
                                                                ) : (
                                                                    <Trash2 size={18} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto mt-6">
                    <InvoiceForm
                        initialData={editingInvoice}
                        onSave={handleSave}
                        onCancel={handleCancelForm}
                        isLoading={isSaving}
                    />
                </div>
            )}

            {/* Preview Modal */}
            {viewingInvoice && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
                    onClick={() => setViewingInvoice(null)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
                            <button
                                type="button"
                                onClick={() => setViewingInvoice(null)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="max-h-[80vh] overflow-y-auto">
                            <InvoicePreview invoiceData={calculateInvoiceDetails(viewingInvoice)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
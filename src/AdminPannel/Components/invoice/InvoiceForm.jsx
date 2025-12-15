// src/AdminPannel/Components/invoice/InvoiceForm.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// --- Reusable Section ---
const FormSection = ({ title, description, children }) => (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="space-y-6">{children}</div>
    </section>
);

// --- Input Field ---
const InputField = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    required = false,
    children,
    as = 'input',
    options = [],
    ...props
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {as === 'select' ? (
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        ) : children ? (
            React.cloneElement(children, {
                id: name,
                name,
                value,
                onChange,
                required,
                className:
                    'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors',
                ...props,
            })
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                {...props}
            />
        )}
    </div>
);

// --- States list with codes ---
const statesWithCodes = [
    { state: 'Jammu and Kashmir', code: '01' },
    { state: 'Himachal Pradesh', code: '02' },
    { state: 'Punjab', code: '03' },
    { state: 'Chandigarh', code: '04' },
    { state: 'Uttarakhand', code: '05' },
    { state: 'Haryana', code: '06' },
    { state: 'Delhi', code: '07' },
    { state: 'Rajasthan', code: '08' },
    { state: 'Uttar Pradesh', code: '09' },
    { state: 'Bihar', code: '10' },
    { state: 'Sikkim', code: '11' },
    { state: 'Arunachal Pradesh', code: '12' },
    { state: 'Nagaland', code: '13' },
    { state: 'Manipur', code: '14' },
    { state: 'Mizoram', code: '15' },
    { state: 'Tripura', code: '16' },
    { state: 'Meghalaya', code: '17' },
    { state: 'Assam', code: '18' },
    { state: 'West Bengal', code: '19' },
    { state: 'Jharkhand', code: '20' },
    { state: 'Odisha', code: '21' },
    { state: 'Chhattisgarh', code: '22' },
    { state: 'Madhya Pradesh', code: '23' },
    { state: 'Gujarat', code: '24' },
    { state: 'Daman and Diu', code: '25' },
    { state: 'Dadra and Nagar Haveli', code: '26' },
    { state: 'Maharashtra', code: '27' },
    { state: 'Andhra Pradesh (Before Division)', code: '28' },
    { state: 'Karnataka', code: '29' },
    { state: 'Goa', code: '30' },
    { state: 'Lakshadweep', code: '31' },
    { state: 'Kerala', code: '32' },
    { state: 'Tamil Nadu', code: '33' },
    { state: 'Puducherry', code: '34' },
    { state: 'Andaman and Nicobar Islands', code: '35' },
    { state: 'Telangana', code: '36' },
    { state: 'Andhra Pradesh (New)', code: '37' },
    { state: 'Ladakh', code: '38' },
    { state: 'Other Territory', code: '97' }
];

// Helper to format date for input
const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

// --- Main Form ---
const InvoiceForm = ({ initialData, onSave, onCancel, isLoading }) => {
    const emptyFormState = {
        formData: {
            // Seller Details
            sellerName: '',
            sellerAddress: '',
            sellerPan: '',
            sellerGstin: '',
            sellerEmail: '',
            sellerState: '',
            sellerStateCode: '',

            // Buyer Details
            buyerName: '',
            buyerAddress: '',
            buyerGstin: '',
            buyerState: '',
            buyerStateCode: '',

            // Invoice Info
            invoiceDate: new Date().toISOString().split('T')[0],
            periodFrom: '',
            periodTo: '',

            // Bank Details
            bankName: '',
            bankAcNo: '',
            bankIfsc: '',

            // Other Details
            declaration: 'We declare that this invoice shows the actual price of the service described and that all particulars are true and correct.',
            termsOfDelivery: '',

            // Extra fields (mapped to backend fields)
            supplierRef: '',      // maps to suppliersRef
            buyerOrder: '',       // maps to buyersOrderNo
            deliveryNoteDate: '',
            despatchedThrough: '',
        },
        items: [{ description: '', hsn: '', amount: '', cgstRate: '0', sgstRate: '0', igstRate: '0' }],
    };

    const getInitialState = () => {
        if (initialData) {
            const { items, ...mainData } = initialData;
            return {
                formData: {
                    ...emptyFormState.formData,
                    ...mainData,
                    // Handle field name mapping from backend
                    supplierRef: mainData.suppliersRef || mainData.supplierRef || '',
                    buyerOrder: mainData.buyersOrderNo || mainData.buyerOrder || '',
                    // Format dates
                    invoiceDate: formatDateForInput(mainData.invoiceDate),
                    periodFrom: formatDateForInput(mainData.periodFrom),
                    periodTo: formatDateForInput(mainData.periodTo),
                },
                items: items && items.length > 0
                    ? items.map(({ _id, ...item }) => ({
                        description: item.description || '',
                        hsn: item.hsn || '',
                        amount: item.amount?.toString() || '',
                        cgstRate: item.cgstRate?.toString() || '0',
                        sgstRate: item.sgstRate?.toString() || '0',
                        igstRate: item.igstRate?.toString() || '0',
                    }))
                    : emptyFormState.items,
            };
        }
        return emptyFormState;
    };

    const [formData, setFormData] = useState(() => getInitialState().formData);
    const [items, setItems] = useState(() => getInitialState().items);
    const [hsnSacOptions, setHsnSacOptions] = useState([]);

    // Reset form when initialData changes
    useEffect(() => {
        const state = getInitialState();
        setFormData(state.formData);
        setItems(state.items);
    }, [initialData]);

    useEffect(() => {
        const fallbackOptions = [
            { label: '998363 - Outdoor Advertising', value: '998363' },
            { label: '8528 - LED Display Units', value: '8528' },
            { label: '998717 - Installation Service', value: '998717' },
            { label: '998511 - Maintenance & Repair Services', value: '998511' },
            { label: '998521 - Security Services', value: '998521' },
            { label: '998531 - Cleaning & Sanitation Services', value: '998531' },
            { label: '998541 - IT Support Services', value: '998541' },
            { label: '998551 - Consultancy Services', value: '998551' },
            { label: '998561 - Audit & Accounting Services', value: '998561' },
            { label: '998571 - Training & Education Services', value: '998571' },
            { label: '998581 - Event Management Services', value: '998581' },
            { label: '998591 - Waste Management Services', value: '998591' },
            { label: '998601 - Transport Services', value: '998601' },
            { label: '998611 - Printing & Stationery Services', value: '998611' },
            { label: '998621 - Postal & Courier Services', value: '998621' },
            { label: '998631 - Advertising & PR Services', value: '998631' },
            { label: '998641 - Survey & Research Services', value: '998641' },
            { label: '998651 - Laboratory & Testing Services', value: '998651' },
            { label: '998661 - Facility Management Services', value: '998661' },
            { label: '998671 - Infrastructure Development Services', value: '998671' },
            { label: '998361 - Advertising Services', value: '998361' },
            { label: '998362 - Purchase or sale of advertising space or time, on commission', value: '998362' },
            { label: '998364 - Sale of television and radio advertising time', value: '998364' },
            { label: '998365 - Sale of internet advertising space', value: '998365' },
            { label: '998366 - Sale of Other Advertising Space Or Time (except on commission)', value: '998366' },
        ];
        setHsnSacOptions(fallbackOptions);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', hsn: '', amount: '', cgstRate: '0', sgstRate: '0', igstRate: '0' }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Remove fields that shouldn't be sent (like invoiceNo which is auto-generated)
        const { invoiceNo, id, _id, createdAt, updatedAt, ...restFormData } = formData;

        // Prepare data for API
        const submitData = {
            ...restFormData,
            items: items.map(item => ({
                description: item.description,
                hsn: item.hsn,
                amount: parseFloat(item.amount) || 0,
                cgstRate: parseFloat(item.cgstRate) || 0,
                sgstRate: parseFloat(item.sgstRate) || 0,
                igstRate: parseFloat(item.igstRate) || 0,
            })),
        };

        onSave(submitData);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto font-sans">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {initialData ? 'Edit Invoice' : 'Create New Invoice'}
                    </h1>
                    <p className="mt-1 text-gray-500">Fill in the details below to generate the invoice.</p>
                    {initialData?.invoiceNo && (
                        <p className="mt-2 text-sm text-blue-600 font-medium">
                            Invoice Number: {initialData.invoiceNo}
                        </p>
                    )}
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Seller & Buyer */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FormSection title="Seller Details">
                            <InputField label="Seller Name" name="sellerName" value={formData.sellerName} onChange={handleInputChange} required />
                            <InputField label="Address" name="sellerAddress" value={formData.sellerAddress} onChange={handleInputChange} required>
                                <textarea rows="3" />
                            </InputField>
                            <InputField label="GSTIN" name="sellerGstin" value={formData.sellerGstin} onChange={handleInputChange} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Email" name="sellerEmail" value={formData.sellerEmail} onChange={handleInputChange} type="email" />
                                <InputField label="PAN" name="sellerPan" value={formData.sellerPan} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <InputField
                                        label="State"
                                        name="sellerState"
                                        value={formData.sellerState}
                                        onChange={handleInputChange}
                                        as="select"
                                        options={statesWithCodes.map((s) => ({ label: s.state, value: s.state }))}
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Code"
                                    name="sellerStateCode"
                                    value={formData.sellerStateCode}
                                    onChange={handleInputChange}
                                    as="select"
                                    options={statesWithCodes.map((s) => ({ label: s.code, value: s.code }))}
                                    required
                                />
                            </div>
                        </FormSection>

                        <FormSection title="Buyer Details">
                            <InputField label="Buyer Name" name="buyerName" value={formData.buyerName} onChange={handleInputChange} required />
                            <InputField label="Address" name="buyerAddress" value={formData.buyerAddress} onChange={handleInputChange} required>
                                <textarea rows="3" />
                            </InputField>
                            <InputField label="GSTIN" name="buyerGstin" value={formData.buyerGstin} onChange={handleInputChange} required />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <InputField
                                        label="State"
                                        name="buyerState"
                                        value={formData.buyerState}
                                        onChange={handleInputChange}
                                        as="select"
                                        options={statesWithCodes.map((s) => ({ label: s.state, value: s.state }))}
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Code"
                                    name="buyerStateCode"
                                    value={formData.buyerStateCode}
                                    onChange={handleInputChange}
                                    as="select"
                                    options={statesWithCodes.map((s) => ({ label: s.code, value: s.code }))}
                                    required
                                />
                            </div>
                        </FormSection>
                    </div>

                    {/* Invoice Info */}
                    <FormSection title="Invoice Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Invoice Date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange} type="date" required />
                            <InputField label="Period From" name="periodFrom" value={formData.periodFrom} onChange={handleInputChange} type="date" />
                            <InputField label="Period To" name="periodTo" value={formData.periodTo} onChange={handleInputChange} type="date" />
                        </div>
                    </FormSection>

                    {/* Items */}
                    <FormSection title="Invoice Items" description="Add all services or products with their respective taxes.">
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/70 relative">
                                    <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                                        <div className="col-span-12 md:col-span-6">
                                            <InputField
                                                label={`Item #${index + 1} Description`}
                                                name="description"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, e)}
                                                required
                                            >
                                                <textarea rows="2" placeholder="Detailed description" />
                                            </InputField>
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <InputField
                                                label="HSN/SAC"
                                                name="hsn"
                                                value={item.hsn}
                                                onChange={(e) => handleItemChange(index, e)}
                                                as="select"
                                                options={hsnSacOptions}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-4">
                                            <InputField
                                                label="Amount (₹)"
                                                name="amount"
                                                value={item.amount}
                                                onChange={(e) => handleItemChange(index, e)}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-4 md:col-span-2">
                                            <InputField label="CGST %" name="cgstRate" value={item.cgstRate} onChange={(e) => handleItemChange(index, e)} type="number" step="0.01" min="0" />
                                        </div>
                                        <div className="col-span-4 md:col-span-2">
                                            <InputField label="SGST %" name="sgstRate" value={item.sgstRate} onChange={(e) => handleItemChange(index, e)} type="number" step="0.01" min="0" />
                                        </div>
                                        <div className="col-span-4 md:col-span-2">
                                            <InputField label="IGST %" name="igstRate" value={item.igstRate} onChange={(e) => handleItemChange(index, e)} type="number" step="0.01" min="0" />
                                        </div>
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="absolute -top-3 -right-3 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:scale-110 transition-transform"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 mt-4 bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Another Item
                        </button>
                    </FormSection>

                    {/* Bank */}
                    <FormSection title="Bank & Other Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} />
                            <InputField label="Account Number" name="bankAcNo" value={formData.bankAcNo} onChange={handleInputChange} />
                            <InputField label="IFSC Code" name="bankIfsc" value={formData.bankIfsc} onChange={handleInputChange} />
                        </div>
                        <InputField label="Terms of Delivery" name="termsOfDelivery" value={formData.termsOfDelivery} onChange={handleInputChange}>
                            <textarea rows="2" />
                        </InputField>
                        <InputField label="Declaration" name="declaration" value={formData.declaration} onChange={handleInputChange}>
                            <textarea rows="3" />
                        </InputField>
                        <InputField label="Supplier's Ref" name="supplierRef" value={formData.supplierRef} onChange={handleInputChange}>
                            <textarea rows="2" />
                        </InputField>
                        <InputField label="Buyer's Order No." name="buyerOrder" value={formData.buyerOrder} onChange={handleInputChange}>
                            <textarea rows="2" />
                        </InputField>
                        <InputField label="Delivery Note Date" name="deliveryNoteDate" value={formData.deliveryNoteDate} onChange={handleInputChange}>
                            <textarea rows="2" />
                        </InputField>
                        <InputField label="Despatched through" name="despatchedThrough" value={formData.despatchedThrough} onChange={handleInputChange}>
                            <textarea rows="2" />
                        </InputField>
                    </FormSection>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-10 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {isLoading && <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                            {initialData ? 'Update Invoice' : 'Create Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvoiceForm;
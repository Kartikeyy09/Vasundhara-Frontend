import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/solid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import seal from "./images/seal.png"
import sign from "./images/sign.png"

const InvoicePreview = ({ invoiceData }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [needsFullPage, setNeedsFullPage] = useState(true);
    const contentRef = useRef(null);

    // A4 dimensions in pixels (at 96 DPI)
    const A4_HEIGHT_PX = 1122; // ~297mm at 96 DPI

    useEffect(() => {
        // Check if content fits in one page
        const checkContentHeight = () => {
            if (contentRef.current) {
                const contentHeight = contentRef.current.scrollHeight;
                setNeedsFullPage(contentHeight < A4_HEIGHT_PX);
            }
        };

        checkContentHeight();
        window.addEventListener('resize', checkContentHeight);
        return () => window.removeEventListener('resize', checkContentHeight);
    }, [invoiceData]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return '';
        }
    };

    const convertAmountToWords = (amount) => {
        if (isNaN(amount)) return "";
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const numToWords = (num) => {
            if (num === 0) return "Zero";
            if (num < 20) return ones[num];
            if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
            if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numToWords(num % 100) : "");
            if (num < 100000) return numToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numToWords(num % 1000) : "");
            if (num < 10000000) return numToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numToWords(num % 100000) : "");
            return numToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numToWords(num % 10000000) : "");
        };
        const integerPart = Math.floor(amount);
        const decimalPart = Math.round((amount - integerPart) * 100);
        let words = "INR " + numToWords(integerPart);
        if (decimalPart > 0) { words += " and " + numToWords(decimalPart) + " Paise"; }
        return words + " Only";
    };

    // Multi-page PDF generator
    const generateInvoicePDF = async () => {
        const input = document.getElementById(`invoice-print-area-${invoiceData.id || 'preview'}`);

        const canvas = await html2canvas(input, {
            scale: 4,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            windowWidth: input.scrollWidth,
            windowHeight: input.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        return pdf;
    };

    const handleDownloadPDF = async () => {
        if (!invoiceData || isProcessing) return;
        setIsProcessing(true);
        try {
            const pdf = await generateInvoicePDF();
            pdf.save(`Invoice-${invoiceData.invoiceNo || 'receipt'}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF for download:", error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrint = async () => {
        if (!invoiceData || isProcessing) return;
        setIsProcessing(true);
        try {
            const pdf = await generateInvoicePDF();
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Failed to generate PDF for printing:", error);
            alert('Failed to prepare print. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!invoiceData) return null;

    const totalTax = (invoiceData.totalSgst || 0) + (invoiceData.totalCgst || 0) + (invoiceData.totalIgst || 0);
    const itemCount = invoiceData.items?.length || 0;
    const maxItemsForOnePage = 6;
    const emptyRowsNeeded = needsFullPage ? Math.max(0, maxItemsForOnePage - itemCount) : 0;

    return (
        <div>
            {/* Action Buttons */}
            <div className="p-4 flex justify-end gap-4 flex-wrap bg-gray-100">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isProcessing}
                    className="flex items-center gap-2 bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Download PDF'}
                </button>
                <button
                    onClick={handlePrint}
                    disabled={isProcessing}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <PrinterIcon className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Print'}
                </button>
            </div>

            {/* Invoice Content - Dynamic A4 Layout */}
            <div
                ref={contentRef}
                id={`invoice-print-area-${invoiceData.id || 'preview'}`}
                className="bg-white text-sm mx-auto"
                style={{
                    width: '210mm',
                    minHeight: needsFullPage ? '297mm' : 'auto',
                    padding: '4mm',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                {/* Main Invoice Container */}
                <div
                    className={`border border-black ${needsFullPage ? 'flex flex-col' : ''}`}
                    style={{
                        minHeight: needsFullPage ? '281mm' : 'auto'
                    }}
                >
                    {/* ==================== HEADER SECTION ==================== */}
                    <div className="flex items-center border-b border-black">
                        <div className="w-full">
                            <h1 className="text-center text-xl font-bold p-2">Tax Invoice</h1>
                        </div>
                    </div>

                    {/* ==================== SELLER & INVOICE INFO ==================== */}
                    <div className="flex border-b border-black">
                        {/* Seller Details */}
                        <div className="w-1/2 p-2 border-r border-black text-xs">
                            <p className="font-bold text-sm">{invoiceData.sellerName}</p>
                            <p className="whitespace-pre-wrap">{invoiceData.sellerAddress}</p>
                            {invoiceData.sellerPan && <p><span className="font-bold">PAN:</span> {invoiceData.sellerPan}</p>}
                            <p><span className="font-bold">GSTIN/UIN:</span> {invoiceData.sellerGstin}</p>
                            <p><span className="font-bold">State Name:</span> {invoiceData.sellerState}, <span className="font-bold">Code:</span> {invoiceData.sellerStateCode}</p>
                            <p><span className="font-bold">Email:</span> {invoiceData.sellerEmail}</p>
                        </div>

                        {/* Invoice Details */}
                        <div className="w-1/2 text-xs">
                            <div className="flex border-b border-black">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Invoice No.</span><br />{invoiceData.invoiceNo}
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <span className="font-bold">Dated</span><br />{formatDate(invoiceData.invoiceDate)}
                                </div>
                            </div>

                            <div className="flex border-b border-black">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Bank Details</span>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <span>{invoiceData.bankName}</span><br />
                                    <span>A/c: </span>{invoiceData.bankAcNo}<br />
                                    <span className="font-bold">IFSC:</span> {invoiceData.bankIfsc}
                                </div>
                            </div>

                            <div className="flex border-b border-black">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Period</span>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    {invoiceData.periodFrom && invoiceData.periodTo &&
                                        <span>{formatDate(invoiceData.periodFrom)} to {formatDate(invoiceData.periodTo)}</span>}
                                </div>
                            </div>

                            <div className="flex border-b border-black">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Supplier's Ref.</span>
                                </div>
                                <div className="w-1/2 p-1.5">{invoiceData.supplierRef}</div>
                            </div>

                            <div className="flex border-b border-black">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Buyer's Order No.</span>
                                </div>
                                <div className="w-1/2 p-1.5">{invoiceData.buyerOrder}</div>
                            </div>

                            <div className="flex">
                                <div className="w-1/2 p-1.5 border-r border-black">
                                    <span className="font-bold">Despatched through</span>
                                </div>
                                <div className="w-1/2 p-1.5">{invoiceData.despatchedThrough}</div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== BUYER & TERMS ==================== */}
                    <div className="flex border-b border-black">
                        <div className="w-1/2 p-2 border-r border-black text-xs">
                            <p className="font-bold">Buyer</p>
                            <p className="font-semibold">{invoiceData.buyerName}</p>
                            <p className="whitespace-pre-wrap">{invoiceData.buyerAddress}</p>
                            <p><span className="font-bold">GSTIN/UIN:</span> {invoiceData.buyerGstin}</p>
                            <p><span className="font-bold">State Name:</span> {invoiceData.buyerState}, <span className="font-bold">Code:</span> {invoiceData.buyerStateCode}</p>
                        </div>
                        <div className="w-1/2 text-xs">
                            <div className="p-2 h-full">
                                <span className="font-bold">Terms of Delivery</span><br />{invoiceData.termsOfDelivery}
                            </div>
                        </div>
                    </div>

                    {/* ==================== ITEMS TABLE ==================== */}
                    <div className={needsFullPage ? 'flex-grow flex flex-col' : ''}>
                        <table className="w-full text-center text-[9px] border-collapse">
                            <thead className="font-bold bg-gray-100">
                                <tr className="border-b border-black">
                                    <td className="w-8 p-1 border-r border-black">Sl<br />No.</td>
                                    <td className="p-1 border-r border-black">ITEM DESCRIPTION</td>
                                    <td className="w-14 p-1 border-r border-black">HSN/SAC</td>
                                    <td className="w-14 p-1 border-r border-black">Amount</td>
                                    <td colSpan="3" className="p-1 border-r border-black">GST Rates</td>
                                    <td colSpan="3" className="p-1 border-r border-black">GST Amount</td>
                                    <td className="w-16 p-1">Total</td>
                                </tr>
                                <tr className="border-b border-black">
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="w-9 border-r border-black p-1">SGST</td>
                                    <td className="w-9 border-r border-black p-1">CGST</td>
                                    <td className="w-9 border-r border-black p-1">IGST</td>
                                    <td className="w-12 border-r border-black p-1">SGST</td>
                                    <td className="w-12 border-r border-black p-1">CGST</td>
                                    <td className="w-12 border-r border-black p-1">IGST</td>
                                    <td className="p-1"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Actual Items */}
                                {invoiceData.items.map((item, index) => (
                                    <tr key={index} className="border-b border-black align-top">
                                        <td className="p-1 border-r border-black">{index + 1}</td>
                                        <td className="p-1 border-r border-black text-left whitespace-pre-wrap">{item.description}</td>
                                        <td className="p-1 border-r border-black">{item.hsn}</td>
                                        <td className="p-1 border-r border-black text-right">{item.amount.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black">{item.sgstRate}%</td>
                                        <td className="p-1 border-r border-black">{item.cgstRate}%</td>
                                        <td className="p-1 border-r border-black">{item.igstRate}%</td>
                                        <td className="p-1 border-r border-black text-right">{item.sgstAmount.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black text-right">{item.cgstAmount.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black text-right">{item.igstAmount.toFixed(2)}</td>
                                        <td className="p-1 text-right">{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}

                                {/* Empty rows ONLY if we need to fill the page */}
                                {needsFullPage && [...Array(emptyRowsNeeded)].map((_, index) => (
                                    <tr key={`empty-${index}`} className="border-b border-black" style={{ height: '30px' }}>
                                        <td className="p-1 border-r border-black">&nbsp;</td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1"></td>
                                    </tr>
                                ))}

                                {/* Flexible spacer row ONLY if we need full page */}
                                {needsFullPage && (
                                    <tr className="border-b border-black">
                                        <td className="p-1 border-r border-black" style={{ height: '40px' }}>&nbsp;</td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1"></td>
                                    </tr>
                                )}

                                {/* Total Row */}
                                <tr className="border-b border-black font-bold bg-gray-50">
                                    <td colSpan="3" className="p-1 text-right border-r border-black">Total</td>
                                    <td className="p-1 text-right border-r border-black">{invoiceData.totalAmount.toFixed(2)}</td>
                                    <td colSpan="3" className="border-r border-black"></td>
                                    <td className="p-1 text-right border-r border-black">{invoiceData.totalSgst.toFixed(2)}</td>
                                    <td className="p-1 text-right border-r border-black">{invoiceData.totalCgst.toFixed(2)}</td>
                                    <td className="p-1 text-right border-r border-black">{invoiceData.totalIgst.toFixed(2)}</td>
                                    <td className="p-1 text-right">{invoiceData.grandTotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* ==================== FOOTER SECTION ==================== */}
                    <div className={needsFullPage ? 'mt-auto' : ''}>
                        {/* Amount in Words */}
                        <div className="flex justify-between border-t border-black p-2 text-xs">
                            <div>
                                <span className="font-bold">Amount Chargeable (in words):</span><br />
                                <span className="font-semibold">{convertAmountToWords(invoiceData.grandTotal)}</span>
                            </div>
                            <div className="font-bold self-end">E. & O.E</div>
                        </div>

                        {/* Tax Summary Table - FIXED: Removed rowSpan, using single row headers */}
                        <div className="border-t border-black">
                            <table className="w-full text-center text-[9px] border-collapse">
                                <thead className="font-bold bg-gray-100">
                                    <tr className="border-b border-black">
                                        <td className="p-1 border-r border-black" style={{ width: '60px' }}>HSN/SAC</td>
                                        <td className="p-1 border-r border-black" style={{ width: '70px' }}>Taxable<br />Value</td>
                                        <td className="p-1 border-r border-black" style={{ width: '35px' }}>CGST<br />Rate</td>
                                        <td className="p-1 border-r border-black" style={{ width: '50px' }}>CGST<br />Amt</td>
                                        <td className="p-1 border-r border-black" style={{ width: '35px' }}>SGST<br />Rate</td>
                                        <td className="p-1 border-r border-black" style={{ width: '50px' }}>SGST<br />Amt</td>
                                        <td className="p-1 border-r border-black" style={{ width: '35px' }}>IGST<br />Rate</td>
                                        <td className="p-1 border-r border-black" style={{ width: '50px' }}>IGST<br />Amt</td>
                                        <td className="p-1" style={{ width: '60px' }}>Total<br />Tax</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(invoiceData.taxSummary).map(([hsn, data]) => (
                                        <tr key={hsn} className="border-b border-black">
                                            <td className="p-1 border-r border-black">{hsn}</td>
                                            <td className="p-1 border-r border-black text-right">{data.taxableValue.toFixed(2)}</td>
                                            <td className="p-1 border-r border-black">{data.cgstRate}%</td>
                                            <td className="p-1 border-r border-black text-right">{data.cgstAmount.toFixed(2)}</td>
                                            <td className="p-1 border-r border-black">{data.sgstRate}%</td>
                                            <td className="p-1 border-r border-black text-right">{data.sgstAmount.toFixed(2)}</td>
                                            <td className="p-1 border-r border-black">{data.igstRate}%</td>
                                            <td className="p-1 border-r border-black text-right">{data.igstAmount.toFixed(2)}</td>
                                            <td className="p-1 text-right">{(data.cgstAmount + data.sgstAmount + data.igstAmount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {/* Total row for tax summary */}
                                    <tr className="font-bold bg-gray-50">
                                        <td className="p-1 border-r border-black">Total</td>
                                        <td className="p-1 border-r border-black text-right">{invoiceData.totalAmount.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black text-right">{invoiceData.totalCgst.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black text-right">{invoiceData.totalSgst.toFixed(2)}</td>
                                        <td className="p-1 border-r border-black"></td>
                                        <td className="p-1 border-r border-black text-right">{invoiceData.totalIgst.toFixed(2)}</td>
                                        <td className="p-1 text-right">{totalTax.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Tax Amount in Words */}
                        <div className="border-t border-black p-2 text-xs">
                            <span className="font-bold">Tax Amount (in words): </span>
                            <span>{convertAmountToWords(totalTax)}</span>
                        </div>

                        {/* Declaration & Signature */}
                        <div className="flex border-t border-black">
                            <div className="w-1/2 p-2 border-r border-black text-xs">
                                <p className="font-bold">Declaration</p>
                                <p className="text-[10px] leading-tight">{invoiceData.declaration}</p>
                            </div>
                            <div className="w-1/2 p-2 text-center flex flex-col justify-between items-center" style={{ minHeight: '100px' }}>
                                <p className="font-bold text-xs">for {invoiceData.sellerName}</p>
                                <div className="flex-grow flex items-center justify-center relative">
                                    {/* Signature image placeholder */}
                                    <img src={seal} alt="Signature" className="max-h-12" />
                                    <div className='absolute'>
                                        <img src={sign} alt="Signature" className="max-h-12" />

                                    </div>
                                </div>
                                <p className="text-xs">Authorised Signatory</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center p-1 border-t border-black bg-gray-50">
                            <p className="font-semibold text-[10px]">SUBJECT TO BHOPAL JURISDICTION</p>
                            <p className="text-[9px] text-gray-600">This is a Computer Generated Invoice</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
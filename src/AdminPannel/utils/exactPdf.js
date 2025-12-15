// src/utils/exactPdf.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForFonts(doc = document) {
    if (doc.fonts && doc.fonts.ready) {
        try {
            await doc.fonts.ready;
        } catch { }
    }
}

async function waitForImages(root = document) {
    const imgs = Array.from(root.querySelectorAll('img'));
    if (!imgs.length) return;
    await Promise.all(
        imgs.map(
            (img) =>
                new Promise((resolve) => {
                    if (img.complete && img.naturalWidth) return resolve();
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                })
        )
    );
}

function copyHeadStyles(fromDoc, toDoc) {
    const base = fromDoc.querySelector('base');
    if (base) toDoc.head.appendChild(base.cloneNode(true));

    // copy stylesheets and inline styles
    const nodes = [
        ...fromDoc.querySelectorAll('link[rel="stylesheet"]'),
        ...fromDoc.querySelectorAll('style'),
    ];
    nodes.forEach((n) => toDoc.head.appendChild(n.cloneNode(true)));

    // print helpers for the new window
    const style = toDoc.createElement('style');
    style.textContent = `
    @page { size: A4; margin: 10mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    table { break-inside: auto; }
    tr, td, th { break-inside: avoid; page-break-inside: avoid; }
    body { margin: 0; }
  `;
    toDoc.head.appendChild(style);
}

function disableAnimations(doc) {
    const style = doc.createElement('style');
    style.setAttribute('data-pdf-no-anim', 'true');
    style.textContent = `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
      caret-color: transparent !important;
    }
  `;
    doc.head.appendChild(style);
    return () => style.remove();
}

async function elementToCanvas(el, { scale } = {}) {
    const rect = el.getBoundingClientRect();

    // Aim for ~300 DPI without overdoing memory (cap ~3.25)
    const TARGET_DPI = 300;
    const scaleFrom96 = TARGET_DPI / 96; // ~3.125
    const finalScale = Math.min(3.25, Math.max(2, scale || scaleFrom96));

    await waitForFonts(document);
    await waitForImages(el);
    await sleep(50); // small settle time

    const cleanup = disableAnimations(document);

    try {
        const canvas = await html2canvas(el, {
            scale: finalScale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            // ensure we capture exactly what's on screen
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            width: rect.width,
            height: rect.height,
            logging: false,
            onclone: async (clonedDoc) => {
                // Lock width and height of target in clone to avoid reflow
                const clonedEl = clonedDoc.getElementById(el.id);
                if (clonedEl) {
                    clonedEl.style.width = `${rect.width}px`;
                    clonedEl.style.height = `${rect.height}px`;
                }
                // Also disable animations in the clone
                disableAnimations(clonedDoc);
                await waitForFonts(clonedDoc);
                await waitForImages(clonedDoc);
            },
        });
        return canvas;
    } finally {
        cleanup();
    }
}

export async function downloadElementAsPDF(el, filename = 'document.pdf', options = {}) {
    const canvas = await elementToCanvas(el, options);
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Scale image to full page width
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
    }

    pdf.save(filename);
}

export async function printElement(el, { title = document.title } = {}) {
    const printWin = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1000');
    if (!printWin) return;

    // Build print doc early
    printWin.document.open();
    printWin.document.write('<!doctype html><html><head></head><body></body></html>');
    printWin.document.close();

    copyHeadStyles(document, printWin.document);

    // Clone the target node into the print window body
    const clone = el.cloneNode(true);
    clone.id = 'print-root'; // ensure unique id inside print window
    printWin.document.body.appendChild(clone);

    // Wait for fonts and images inside the print window
    await waitForFonts(printWin.document);
    await waitForImages(printWin.document);
    await sleep(50);

    // Set title
    printWin.document.title = title;

    // Print
    printWin.focus();
    printWin.print();

    // Optional auto-close after print (comment if you want to keep it)
    const handler = () => {
        printWin.close();
        printWin.removeEventListener('afterprint', handler);
    };
    printWin.addEventListener('afterprint', handler);
}
// Client-side DOCX -> PDF conversion.
//
// There is no reliable pure-browser way to convert a .docx into a vector PDF,
// so we render the document with docx-preview into an offscreen container and
// snapshot each page with html2canvas into a jsPDF document. The result is
// visually faithful but image-based (the text is not selectable). For
// selectable-text / vector PDFs a server-side converter (LibreOffice headless
// or a conversion API) would be required.

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function docxToPdf(docxBytes: Uint8Array): Promise<Uint8Array> {
  const [{ renderAsync }, { default: html2canvas }, { jsPDF }] =
    await Promise.all([
      import("docx-preview"),
      import("html2canvas"),
      import("jspdf"),
    ]);

  // Offscreen but laid-out container (display:none would break html2canvas).
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.zIndex = "-1";
  container.style.background = "#ffffff";
  document.body.appendChild(container);

  try {
    const blob = new Blob([docxBytes as BlobPart], { type: DOCX_MIME });
    await renderAsync(blob, container, undefined, {
      className: "docx",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
      experimental: true,
    });

    // docx-preview renders each page as a <section> inside .docx-wrapper.
    const pages = Array.from(
      container.querySelectorAll<HTMLElement>(".docx-wrapper > section"),
    );
    const targets = pages.length > 0 ? pages : [container];

    const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    let hasContent = false;
    for (const target of targets) {
      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const imgW = pageW;
      const imgH = (canvas.height / canvas.width) * imgW;

      if (imgH <= pageH) {
        if (hasContent) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
        hasContent = true;
      } else {
        // A single docx page is taller than A4: slice it across PDF pages by
        // re-adding the same image shifted up by one page height each time.
        let position = 0;
        while (position < imgH) {
          if (hasContent) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, -position, imgW, imgH);
          hasContent = true;
          position += pageH;
        }
      }
    }

    return new Uint8Array(pdf.output("arraybuffer"));
  } finally {
    document.body.removeChild(container);
  }
}

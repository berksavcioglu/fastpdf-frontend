import { useState } from "react";
 import { useRef } from "react";

const API_BASE = "https://fastpdf-backend.onrender.com/api/pdf";

export default function App() {
 
  const [files, setFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const fileInputRef = useRef(null);
const imageInputRef = useRef(null);

  const downloadBlob = async (response, filename) => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Something went wrong");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
    setTimeout(() => {
  setMergeLoading(false);
  setImagesLoading(false);
}, 300);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Select at least 2 PDF files");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setMergeLoading(true);
      const res = await fetch(`${API_BASE}/merge`, {
        method: "POST",
        body: formData,
      });
      await downloadBlob(res, "merged.pdf");
      setFiles([]);
fileInputRef.current.value = "";
      
    } catch (err) {
      alert(err.message);
    } finally {
     setImagesLoading(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (imageFiles.length === 0) {
      alert("Select at least 1 image");
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("files", file));

    try {
      setImagesLoading(true);
      const res = await fetch(`${API_BASE}/images-to-pdf`, {
        method: "POST",
        body: formData,
      });
      await downloadBlob(res, "images.pdf");
      setImageFiles([]);
imageInputRef.current.value = "";
      setImageFiles([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setMergeLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="navbar">
        <div className="logo">
          Fast<span>PDF</span>
        </div>
        <div className="navPill">Fast • Secure • Simple</div>
      </div>

      <section className="hero">
        <div className="heroText">
          <div className="badge">Modern PDF tools for everyone</div>
          <h1 className="heroTitle">
            Work with PDFs <span>beautifully</span>
          </h1>
          <p className="heroDesc">
            Merge PDF files and convert images to PDF with a cleaner, faster,
            and more modern experience. Built to feel simple and premium.
          </p>

          <div className="heroButtons">
            <button className="primaryHeroBtn">Start Free</button>
            <button className="secondaryHeroBtn">No sign-up required</button>
          </div>
        </div>

        <div className="heroVisual">
          <div className="previewCard">
            <div className="previewTop">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>

            <div className="previewPanel">
              <div className="previewPanelTitle">Quick actions</div>

              <div className="previewMiniCard">
                <strong>Merge PDF</strong>
                <span>Combine multiple PDF files into one output.</span>
              </div>

              <div className="previewMiniCard">
                <strong>Images to PDF</strong>
                <span>Turn JPG and PNG images into a clean PDF file.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="toolsSection">
        <h2 className="sectionTitle">Choose a tool</h2>
        <p className="sectionDesc">
          Designed to look good and work fast.
        </p>

        <div className="grid">
          <div className="card">
            <div className="cardIcon">📄</div>
            <h3>Merge PDF</h3>
            <p>Combine multiple PDF files into one polished document.</p>

            <div className="uploadBox">
              <p className="fileHint">Select at least 2 PDF files</p>
              <input
  ref={fileInputRef}
  className="fileInput"
  type="file"
  multiple
  accept=".pdf"
  onChange={(e) => setFiles([...e.target.files])}
/>
            </div>

            <div className="actions">
              <button
                className="primaryButton"
                onClick={handleMerge}
                disabled={mergeLoading}
              >
                {mergeLoading ? "Processing..." : "Merge PDF"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="cardIcon">🖼️</div>
            <h3>Images to PDF</h3>
            <p>Turn JPG, PNG, JPEG, or BMP images into a single PDF file.</p>

            <div className="uploadBox">
              <p className="fileHint">Select one or more images</p>
              <input
  ref={imageInputRef}
  className="fileInput"
  type="file"
  multiple
  accept=".jpg,.jpeg,.png,.bmp"
  onChange={(e) => setImageFiles([...e.target.files])}
/>
            </div>

            <div className="actions">
              <button
                className="primaryButton"
                onClick={handleImagesToPdf}
                disabled={imagesLoading}
              >
                {imagesLoading ? "Processing..." : "Convert to PDF"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="featureBox">
          <h4>Fast processing</h4>
          <p>Simple actions and clean flow without clutter.</p>
        </div>
        <div className="featureBox">
          <h4>Modern design</h4>
          <p>A better looking PDF tool experience with cleaner visuals.</p>
        </div>
        <div className="featureBox">
          <h4>No confusion</h4>
          <p>Upload, click, download. That’s it.</p>
        </div>
      </section>

      <div className="footerNote">
        FastPDF — clean PDF tools with a more modern feel.
      </div>
    </div>
  );
}
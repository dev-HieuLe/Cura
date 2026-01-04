export default function PdfThumbnail({ id }) {
  if (!id) {
    return (
      <div className="w-full h-52 rounded-xl flex items-center justify-center text-xs text-gray-400 bg-gray-100">
        No preview
      </div>
    );
  }

  const pdfUrl = `${import.meta.env.VITE_API_URL}/api/pdf/${id}`;

  return (
    <div className="w-full h-52 rounded-xl overflow-hidden bg-white border">
      {/* Scrollable PDF area */}
      <div className="w-full h-full overflow-auto">
        <embed
          src={`${pdfUrl}#page=1&toolbar=0&navpanes=0`}
          type="application/pdf"
          className="w-full min-h-full"
        />
      </div>
    </div>
  );
}

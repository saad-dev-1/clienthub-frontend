import { useState, useRef } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FileUpload({ onUpload, accept, maxSizeMB = 10 }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMB}MB allowed.`);
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);

    try {
      const result = await onUpload(file, (p) => setProgress(p));
      toast.success('File uploaded');
      setSelectedFile(null);
      return result;
    } catch (err) {
      console.error('Upload error:', err.response?.data);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.file?.[0] ||
        'Upload failed';
      toast.error(message);
      setSelectedFile(null);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-accent bg-accent-subtle/30'
            : 'border-border hover:border-border-strong hover:bg-bg-hover/30'
        } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
      >
        {uploading ? (
          <>
            <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center mx-auto mb-3">
              <Loader2 size={20} className="text-accent animate-spin" />
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">
              Uploading {selectedFile?.name}
            </p>
            <div className="max-w-xs mx-auto mt-3">
              <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-text-subtle mt-1.5 tabular-nums">
                {progress}%
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center mx-auto mb-3">
              <Upload size={18} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">
              Drop file here or click to upload
            </p>
            <p className="text-xs text-text-subtle">
              Max {maxSizeMB}MB per file
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
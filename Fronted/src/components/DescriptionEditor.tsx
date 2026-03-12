import { useState, useRef } from "react";
import { apiService } from "../services/api";

interface Props {
  value: string;
  onChange: (value: string) => void;
  descriptionImages?: string; // JSON array de imágenes base64
  onImagesChange?: (images: string) => void;
  disabled?: boolean;
}

interface Image {
  id: string;
  dataUrl: string;
}

export default function DescriptionEditor({
  value,
  onChange,
  descriptionImages,
  onImagesChange,
  disabled = false,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [images, setImages] = useState<Image[]>(() => {
    if (!descriptionImages) return [];
    try {
      const parsed = JSON.parse(descriptionImages);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const response = await apiService.uploadTaskImage(file);
      if (response.success && response.dataUrl) {
        const newImage: Image = {
          id: Date.now().toString(),
          dataUrl: response.dataUrl,
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange?.(JSON.stringify(updatedImages));
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Error al subir la imagen",
      );
    } finally {
      setIsUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setIsUploading(true);
          setUploadError("");

          try {
            const response = await apiService.uploadTaskImage(file);
            if (response.success && response.dataUrl) {
              const newImage: Image = {
                id: Date.now().toString(),
                dataUrl: response.dataUrl,
              };

              const updatedImages = [...images, newImage];
              setImages(updatedImages);
              onImagesChange?.(JSON.stringify(updatedImages));
            }
          } catch (error) {
            setUploadError(
              error instanceof Error
                ? error.message
                : "Error al pegar la imagen",
            );
          } finally {
            setIsUploading(false);
          }
        }
      }
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(JSON.stringify(updatedImages));
  };

  return (
    <div style={styles.container}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        disabled={disabled || isUploading}
        style={styles.textarea}
        placeholder="Escribe la descripción aquí... (puedes pegar imágenes directamente)"
      />

      <div style={styles.toolbar}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          style={styles.uploadBtn}
          title="Clic para seleccionar una imagen"
        >
          {isUploading ? "⏳ Subiendo..." : "📸 Agregar Imagen"}
        </button>
        <span style={styles.hint}>
          o pega (Ctrl+V / Cmd+V) una imagen directamente
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {uploadError && <div style={styles.error}>❌ {uploadError}</div>}

      {images.length > 0 && (
        <div style={styles.imagesContainer}>
          <p style={styles.imagesLabel}>Imágenes en la descripción:</p>
          <div style={styles.imagesList}>
            {images.map((image) => (
              <div key={image.id} style={styles.imageItem}>
                <img
                  src={image.dataUrl}
                  alt="Descripción"
                  style={styles.thumbnail}
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  disabled={disabled || isUploading}
                  style={styles.removeBtn}
                  title="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  } as React.CSSProperties,
  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    minHeight: "120px",
    resize: "vertical",
  } as React.CSSProperties,
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  } as React.CSSProperties,
  uploadBtn: {
    padding: "0.6rem 1rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
  } as React.CSSProperties,
  hint: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  error: {
    padding: "0.75rem",
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    borderRadius: "6px",
    fontSize: "0.9rem",
  },
  imagesContainer: {
    marginTop: "0.5rem",
  } as React.CSSProperties,
  imagesLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.75rem",
  },
  imagesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  } as React.CSSProperties,
  imageItem: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #334155",
  } as React.CSSProperties,
  thumbnail: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    display: "block",
  } as React.CSSProperties,
  removeBtn: {
    position: "absolute",
    top: "2px",
    right: "2px",
    width: "24px",
    height: "24px",
    padding: "0",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  } as React.CSSProperties,
};

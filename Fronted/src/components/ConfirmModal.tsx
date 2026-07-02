interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  danger = true,
}: Props) {
  return (
    <div style={styles.bg} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button
            onClick={onConfirm}
            style={{ ...styles.btn, ...(danger ? styles.dangerBtn : styles.confirmBtn) }}
          >
            {confirmLabel}
          </button>
          <button onClick={onCancel} style={{ ...styles.btn, ...styles.cancelBtn }}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  bg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "400px",
    width: "90%",
    border: "1px solid #334155",
    boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
  },
  message: {
    color: "#f1f5f9",
    fontSize: "1rem",
    lineHeight: 1.5,
    margin: 0,
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
  },
  btn: {
    padding: "0.6rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.9rem",
    transition: "all 0.2s",
  } as React.CSSProperties,
  dangerBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },
  confirmBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
  },
  cancelBtn: {
    backgroundColor: "#475569",
    color: "#fff",
  },
};

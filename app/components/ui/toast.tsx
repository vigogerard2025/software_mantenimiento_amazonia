"use client";

import { createRoot } from "react-dom/client";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

function ToastComponent({ message, type = "success" }: ToastProps) {
  const icons = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  const styles = {
    success: {
      bg: "linear-gradient(135deg, #065f46, #047857)",
      border: "rgba(52,211,153,0.3)",
      icon: "#6ee7b7",
    },
    error: {
      bg: "linear-gradient(135deg, #7f1d1d, #991b1b)",
      border: "rgba(252,165,165,0.3)",
      icon: "#fca5a5",
    },
    info: {
      bg: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
      border: "rgba(147,197,253,0.3)",
      icon: "#93c5fd",
    },
  };

  const s = styles[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "14px",
        padding: "14px 20px",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
        animation: "toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        maxWidth: "360px",
        backdropFilter: "blur(20px)",
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
      `}</style>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: s.icon,
          fontWeight: 700,
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {icons[type]}
      </div>
      <span
        style={{
          color: "#f0fdf4",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
      >
        {message}
      </span>
    </div>
  );
}

export function toast(
  message: string,
  type: "success" | "error" | "info" = "success",
) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ToastComponent message={message} type={type} />);

  setTimeout(() => {
    container.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(container);
    }, 300);
  }, 3000);
}

import { useEffect } from "react";
import { WarningCircle, CheckCircle, XCircle } from "@phosphor-icons/react";

export function AlertCustom({
  visible,
  onClose,
  title,
  message,
  type = "error",
}) {
  const config = {
    error: {
      color: "text-[#000]",
      bgColor: "bg-[#FFAD9E]",
      Icon: XCircle,
    },
    warning: {
      color: "text-[#000]",
      bgColor: "bg-[#FEFEB3]",
      Icon: WarningCircle,
    },
    success: {
      color: "text-[#000]",
      bgColor: "bg-[#D8FFCE]",
      Icon: CheckCircle,
    },
  };

  const { color, bgColor, Icon } = config[type];

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex justify-end items-start bg-black/10 z-[100]">
      <div
        className={`${bgColor} flex items-center gap-3 w-[80%] max-w-md rounded-2xl p-4 mt-10 mr-6 shadow-lg`}
      >
        <Icon size={40} className={color} />

        <div>
          <h2 className="text-[16px] font-normal">{title}</h2>
          <p className="text-[14px] text-light">{message}</p>
        </div>
      </div>
    </div>
  );
}

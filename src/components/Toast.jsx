import { useEffect } from "react";

function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="toast">
      <span className="toast-dot" />
      {message}
    </div>
  );
}

export default Toast;

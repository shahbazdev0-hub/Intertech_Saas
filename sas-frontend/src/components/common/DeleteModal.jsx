import { Button } from "./Button";
import { useEffect } from "react";

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  entityName = "Item",
  entityIdentifier = "",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 max-w-md w-full transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Delete {entityName}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to delete this {entityName.toLowerCase()}{" "}
          {entityIdentifier ? `"${entityIdentifier}"` : ""}? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { updateAlert } from "@/app/Firebase/Services/DatabaseService";
import Alert from "@/app/types/Alert";

const useUpdateAlertRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAlertAsRead = async (alert: Alert) => {
    if (!alert.id) return;
    if (alert.isRead) return; // Skip if already read

    setLoading(true);
    setError(null);

    try {
      await updateAlert(alert.id, { isRead: true });
      console.log("Alert marked as read");
    } catch (err) {
      console.error("Error updating alert:", err);
      setError("Failed to update alert");
    } finally {
      setLoading(false);
    }
  };

  return { markAlertAsRead, loading, error };
};

export default useUpdateAlertRead;

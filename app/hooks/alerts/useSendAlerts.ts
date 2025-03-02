import { useState } from "react";
import { createAlert } from "@/app/Firebase/Services/DatabaseService";
import { Alert } from "@/app/types/Alert";
import { Tenant } from "@/app/types/Tenant";

const useSendAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Sends an alert to one or multiple tenants.
   * @param tenants Array of tenant IDs (strings).
   * @param alertData Base alert data.
   */

  const sendAlerts = async (tenants: Tenant[], alertData: Alert) => {
    if (!tenants || tenants.length === 0) {
      setError("No tenants provided");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const alertPromises = tenants.map((tenant) => 
        createAlert({ ...alertData, receiver: tenant.user})
      );

      await Promise.all(alertPromises);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { sendAlerts, loading, error, success };
};

export default useSendAlerts;

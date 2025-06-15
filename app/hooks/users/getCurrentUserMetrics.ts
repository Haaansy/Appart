import { useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Metric } from "@/app/components/Analytics/AnalyticsGraph";
import { auth } from "@/app/Firebase/FirebaseConfig"; // Adjust the import based on your project structure

export const useCurrentUserMetrics = () => {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the latest metric (by createdAt)
  const latestMetric = metrics && metrics.length > 0
    ? metrics.reduce((latest, current) => {
        if (!latest) return current;
        const latestDate = latest.createdAt?.toDate ? latest.createdAt.toDate() : new Date(latest.createdAt.seconds * 1000);
        const currentDate = current.createdAt?.toDate ? current.createdAt.toDate() : new Date(current.createdAt.seconds * 1000);
        return currentDate > latestDate ? current : latest;
      }, null as Metric | null)
    : null;

  const fetchUserMetrics = async (
    month?: string,
    year?: number,
    day?: number,
    dateRange?: { start: Date; end: Date }
  ) => {
    setLoading(true);
    setError(null);
    const db = getFirestore();
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userId = user.uid;
    const collectionName = `${month}_${year}`;
    try {
      const metricsCol = collection(db, "User_Metrics", userId, collectionName);
      const snapshot = await getDocs(metricsCol);
      let metricsArr: Metric[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Metric);
      // If day is provided, filter for that day only
      if (day) {
        const dayId = `${month}_${day}_${year}`;
        metricsArr = metricsArr.filter(m => m.id === dayId);
      }
      
      setMetrics(metricsArr);
      setLoading(false);
      return metricsArr;
    } catch (error: any) {
      setError(error.message || 'Unknown error');
      setLoading(false);
      console.error('Error fetching user metrics:', error);
      throw error;
    }
  };

  const fetchDateRangeMetrics = async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    const db = getFirestore();
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    const userId = user.uid;

    // Helper to get all months between start and end
    const getMonthsInRange = (start: Date, end: Date) => {
      const months = [];
      const date = new Date(start);
      date.setDate(1);
      while (date <= end) {
        months.push({ month: date.toLocaleString('default', { month: 'long' }), year: date.getFullYear() });
        date.setMonth(date.getMonth() + 1);
      }
      return months;
    };

    try {
      const months = getMonthsInRange(start, end);
      let allMetrics: Metric[] = [];
      for (const { month, year } of months) {
        const collectionName = `${month}_${year}`;
        const metricsCol = collection(db, "User_Metrics", userId, collectionName);
        const snapshot = await getDocs(metricsCol);
        const metricsArr: Metric[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Metric);
        allMetrics = allMetrics.concat(metricsArr);
      }
      // Filter by date range
      allMetrics = allMetrics.filter(m => {
        const metricDate = m.createdAt?.toDate ? m.createdAt.toDate() : new Date(m.createdAt.seconds * 1000);
        return metricDate >= start && metricDate <= end;
      });
      setMetrics(allMetrics);
      setLoading(false);
      return allMetrics;
    } catch (error: any) {
      setError(error.message || 'Unknown error');
      setLoading(false);
      throw error;
    }
  };

  return {
    metrics,
    latestMetric,
    loading,
    error,
    fetch: fetchUserMetrics,
    fetchRange: fetchDateRangeMetrics
  };
};
import { useState, useCallback } from "react";

const MAPBOX_ACCESS_TOKEN = "sk.eyJ1IjoiaGFpaWFuZXhlIiwiYSI6ImNtN2lsODF3eDBoZ2wya3FwN201MDZsa2oifQ.BU1lPGsnv5cOWT-DcLEWow";

const getAddress = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(async (longitude: number, latitude: number): Promise<string | null> => {
    setLoading(true);
    setError(null);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features.length > 0) {
        const placeName = data.features[0].place_name;
        setAddress(placeName);
        return placeName;
      } else {
        setAddress(null);
        return null;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, reverseGeocode, loading, error };
};

export default getAddress;

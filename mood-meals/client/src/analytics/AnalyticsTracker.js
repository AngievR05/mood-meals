import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-GNDG8TN9J3", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

export default AnalyticsTracker;


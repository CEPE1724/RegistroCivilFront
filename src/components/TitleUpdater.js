import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const TitleUpdater = ({ title }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null;
};

export default TitleUpdater;

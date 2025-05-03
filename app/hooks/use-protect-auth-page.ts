import { useNavigate } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";

export const useProtectAuthPage = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [showAuthContent, setShowAuthContent] = useState(false);
  const navigate = useNavigate();
  // TODO: Write redirect logic in component.....Abstract it into a hook to be shared by other routes

  useEffect(
    function () {
      if (isLoading) return;
      if (!isAuthenticated) {
        navigate({
          to: "/sign-in/$",
        });
      } else {
        setShowAuthContent(true);
      }
    },
    [isLoading, isAuthenticated]
  );

  return {
    showAuthContent,
    setShowAuthContent,
    isAuthenticated,
  };
};

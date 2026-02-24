import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import '@/lib/i18n';
import Index from "./pages/Index";
import LocalizedDentalPage from "./pages/LocalizedDentalPage";
import NotFound from "./pages/NotFound";
import { localizedSlugs, languages, defaultLanguage } from "./lib/i18n/config";

const queryClient = new QueryClient();

// GTM Tracking component to handle route changes in SPA
const GTMTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if dataLayer exists and push a pageview event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'pageview',
        page: location.pathname + location.search
      });
    }
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GTMTracker />
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Language-prefixed routes with localized slugs */}
          {languages.map((lang) => (
            <Route
              key={lang}
              path={`/${lang}/${localizedSlugs[lang]}`}
              element={<LocalizedDentalPage />}
            />
          ))}

          {/* Fallback for just language prefix */}
          {languages.map((lang) => (
            <Route
              key={`${lang}-redirect`}
              path={`/${lang}`}
              element={<Navigate to={`/${lang}/${localizedSlugs[lang]}`} replace />}
            />
          ))}

          {/* Handle legacy English route */}
          <Route
            path="/dental-implant-turkey"
            element={<Navigate to={`/${defaultLanguage}/${localizedSlugs[defaultLanguage]}`} replace />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

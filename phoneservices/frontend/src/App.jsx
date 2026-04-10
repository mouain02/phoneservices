
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/pages/Index";
import Reviews from "./components/pages/Reviews";
import Booking from "./components/pages/Booking";
import NotFound from "./components/pages/NotFound";
import Admin from "./components/pages/Admin";
import AdminLogin from "./components/pages/AdminLogin";
import RequireAdmin from "./components/routes/RequireAdmin";
import Navbar from "./components/ui/Navbar";
import { startCatalogAutoSync } from "@/components/data/phones";

const App = () => {
  useEffect(() => {
    const stopCatalogAutoSync = startCatalogAutoSync();
    return stopCatalogAutoSync;
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
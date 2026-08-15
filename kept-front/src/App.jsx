import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import GNB from "./components/GNB";
import Home from "./pages/Home";
import Care from "./pages/Care";
import PersonalCare from "./pages/PersonalCare";
import Report from "./pages/Report";
import MyBag from "./pages/MyBag";

const PAGE_PATHS = {
  home: "/",
  care: "/care",
  report: "/report",
  mybag: "/mybag",
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.startsWith("/care")
    ? "care"
    : location.pathname === "/report"
      ? "report"
      : location.pathname === "/mybag"
        ? "mybag"
        : "home";

  const handleSelectPage = (page) => {
    navigate(PAGE_PATHS[page]);
    setIsMenuOpen(false);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onOpenMenu={handleOpenMenu} />} />

        <Route path="/care" element={<Care onOpenMenu={handleOpenMenu} />} />

        <Route path="/care/personal" element={<PersonalCare />} />

        <Route
          path="/report"
          element={<Report onOpenMenu={handleOpenMenu} />}
        />

        <Route
          path="/mybag"
          element={<MyBag onOpenMenu={handleOpenMenu} />}
        />
      </Routes>

      {isMenuOpen && (
        <GNB
          currentPage={currentPage}
          onSelect={handleSelectPage}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default App;

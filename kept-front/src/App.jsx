import { useState } from "react";
import GNB from "./components/GNB";
import Home from "./pages/Home";
import Care from "./pages/Care";
import Report from "./pages/Report";

const PAGES = {
  home: Home,
  care: Care,
  report: Report,
};

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const CurrentPage = PAGES[currentPage];

  const handleSelectPage = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <CurrentPage onOpenMenu={() => setIsMenuOpen(true)} />

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

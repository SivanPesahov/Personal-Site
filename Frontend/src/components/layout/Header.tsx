import { Link } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkmodeContext";
import { Button } from "../ui/button";
import { useState } from "react";
import GlassSurface from "../GlassSurface";
import Typing from "../Typing";

function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/", icon: <span>🏠</span> },
    { label: "Projects", to: "/projects", icon: <span>🎒</span> },
    { label: "About", to: "/about", icon: <span>💬</span> },
    { label: "Contact", to: "/contact", icon: <span>✉️</span> },
  ];

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center px-3 pt-3">
      <GlassSurface width={"min(92vw, 1100px)"} borderRadius={80}>
        <div className="flex items-center justify-between w-full max-w-7xl px-5 py-3">
          <div className="flex items-center gap-3">
            <Typing strArr={["Sivan Pesahov's portfolio!"]} />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-sm font-medium ${
                  darkMode ? "text-white/90" : "text-black/70"
                } transition-all duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.9)]`}
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant={"ghost"}
              onClick={toggleDarkMode}
              className={`relative text-sm font-medium ${
                darkMode ? "text-white/90" : "text-black/70"
              } transition-all duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.9)] `}
            >
              {darkMode ? "Light" : "Dark"}
            </Button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="h-8 rounded-full px-3 text-xs"
            >
              <span className="block">🍔</span>
            </Button>
          </div>
        </div>
      </GlassSurface>

      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          } bg-black/20 backdrop-blur-lg backdrop-saturate-150`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-64 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div>
              <div className="flex items-center justify-between pb-2">
                <Typing strArr={["Menu"]} />
              </div>

              <nav className="mt-[2vh] flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors  w-[20vh]"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-4 p-1">
              <Button
                variant="ghost"
                onClick={toggleDarkMode}
                className="w-full rounded-xl hover:bg-white/10 justify-start text-left"
              >
                Toggle Theme 💡
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

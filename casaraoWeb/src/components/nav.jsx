import { useState, useEffect } from "react";
import { List, X, ArrowLeft, Sun, Moon } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoPreta from "/images/logoPreto.png";
import logoBranca from "/images/logoBranco.png";

export function Nav() {

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);


  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/menu";

  const routeNames = {
    "/usuarios": "Usuários",
    "/eventos": "Eventos",
    "/galeria": "Galeria",
    "/escalas": "Escalas",
    "/cursos": "Cursos",
    "/perfil": "Perfil",
  };

  const currentTitle = routeNames[location.pathname];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <nav className="w-full bg-transparent fixed top-0 left-0 z-50">
        <div className="px-4 h-16 flex items-center justify-between">

          {/* ===== MOBILE HEADER ===== */}
          <div className="flex items-center gap-3 md:hidden">

            {isHome ? (
              <div>
                <img
                  src={logoPreta}
                  alt="Logo"
                  className="block dark:hidden h-10 object-contain"
                />

                <img
                  src={logoBranca}
                  alt="Logo"
                  className="hidden dark:block h-10 object-contain"
                />
              </div>
            ) : (
              <>
                <button onClick={() => navigate(-1)}>
                  <ArrowLeft size={22} className="text-preto dark:text-branco"/>
                </button>

                <span className="text-lg font-normal text-preto dark:text-branco">
                  {currentTitle}
                </span>
              </>
            )}
          </div>

          {/* ===== DESKTOP MENU ===== */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/menu">Home</Link>
            <Link to="/usuarios">Usuários</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/galeria">Galeria</Link>
            <Link to="/escalas">Escalas</Link>
            <Link to="/cursos">Cursos</Link>
            <Link to="/perfil">Perfil</Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 transition-transform duration-300 hover:scale-110"
            >
              {darkMode ? (
                <Sun size={22} className="text-yellow-400" />
              ) : (
                <Moon size={22} />
              )}
            </button>
          </div>

          {/* ===== MOBILE BUTTONS ===== */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="transition-transform duration-300 hover:scale-110"
            >
              {darkMode ? (
                <Sun size={22} className="text-preto dark:text-branco" />
              ) : (
                <Moon size={22} className="text-preto dark:text-branco" />
              )}
            </button>

            <button onClick={() => setOpen(true)}>
              <List size={26} className="text-preto dark:text-branco" />
            </button>
          </div>

        </div>
      </nav>

      {/* ===== OVERLAY ===== */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[55] md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ===== DRAWER ===== */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-[70%] bg-branco dark:bg-preto-dark shadow-lg z-[60]
          transform transition-transform duration-300
          md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button onClick={() => setOpen(false)} className="p-5">
          <X size={26} className="text-preto dark:text-branco" />
        </button>

        <div className="flex flex-col gap-10 px-6 text-lg font-normal text-preto dark:text-branco items-center mt-[50%]">
          <Link to="/menu" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/usuarios" onClick={() => setOpen(false)}>Usuários</Link>
          <Link to="/eventos" onClick={() => setOpen(false)}>Eventos</Link>
          <Link to="/galeria" onClick={() => setOpen(false)}>Galeria</Link>
          <Link to="/escalas" onClick={() => setOpen(false)}>Escalas</Link>
          <Link to="/cursos" onClick={() => setOpen(false)}>Cursos</Link>
          <Link to="/perfil" onClick={() => setOpen(false)}>Perfil</Link>
        </div>
      </div>
    </>
  );
}

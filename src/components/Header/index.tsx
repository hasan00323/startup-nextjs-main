"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import ThemeToggler from "./ThemeToggler";
import { getMenuData } from "./menuData";
import { stopRefreshTokenTimer } from "@/lib/api";
import { useSticky, useNavbarState, useAuthLoader } from "@/hooks/useHeaderLogic";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, roleId, displayName, mounted } = useAuthLoader(pathname);
  const sticky = useSticky();
  const { navbarOpen, userMenuOpen, openIndex, toggleNavbar, handleSubmenu, closeAll, setUserMenuOpen } = useNavbarState();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const isAuthed = !!token;
  const roleName = roleId === 1 ? "Admin" : roleId === 2 ? "Student" : "User";
  const profileHref = roleName === "Admin" ? "/admin/profile" : "/students/profile";
  const menuData = useMemo(() => getMenuData(roleId, isAuthed), [roleId, isAuthed]);
  const userInitials = displayName ? displayName.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    if (!userMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [setUserMenuOpen, userMenuOpen]);

  const logout = async () => {
    try {
      await fetch("https://localhost:7145/api/Auth/Logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.clear();
    stopRefreshTokenTimer();
    closeAll();
    router.push("/signin");
  };

  if (!mounted) return <div className="h-[80px] w-full" />;

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center opacity-0 animate-[headerIn_.55s_ease-out_forwards] ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-50 bg-white/80 backdrop-blur-md transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full -translate-y-1 px-4 xl:mr-12">
              <Link
                href="/"
                onClick={closeAll}
                className={`header-logo block w-full opacity-0 animate-[itemIn_.75s_ease-out_forwards] ${
                  sticky ? "py-4 lg:py-3" : "py-8"
                }`}
              >
                <Image src="/images/logo/logo-2.svg" alt="logo" width={140} height={45} className="w-full dark:hidden" />
                <Image src="/images/logo/logo.svg" alt="logo" width={140} height={45} className="hidden w-full dark:block" />
              </Link>
            </div>

            <div className="flex w-full items-center justify-between px-4">
              <div className="-translate-y-1 opacity-0 animate-[itemIn_.85s_ease-out_forwards] lg:-translate-y-1.5">
                <button
                  onClick={toggleNavbar}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[7px] rotate-45" : ""}`} />
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0" : ""}`} />
                  <span className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "top-[-8px] -rotate-45" : ""}`} />
                </button>

                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 absolute right-0 z-30 w-[270px] rounded-xl border-[.5px] bg-white/90 px-6 py-4 backdrop-blur-xl duration-300 dark:bg-[#0B1220] lg:visible lg:static lg:w-auto lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 lg:backdrop-blur-none lg:dark:bg-transparent transition-[opacity,top,transform] ${
                    navbarOpen
                      ? "visible top-full opacity-100 translate-y-0 scale-100 animate-[menuIn_.18s_ease-out_forwards]"
                      : "invisible top-[120%] opacity-0 translate-y-2 scale-[0.99]"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem: any, index: number) => (
                      <li
                        key={index}
                        className="group relative opacity-0 animate-[navItemIn_.65s_ease-out_forwards]"
                        style={{ animationDelay: `${160 + index * 55}ms` }}
                      >
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={closeAll}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                              pathname === menuItem.path
                                ? "text-blue-600 dark:text-white"
                                : "text-gray-800 hover:text-blue-600 dark:text-white/70 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSubmenu(index)}
                              className="text-gray-800 group-hover:text-blue-600 flex w-full items-center justify-between py-2 text-base lg:w-auto lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z" fill="currentColor" />
                                </svg>
                              </span>
                            </button>
                            <div
                              className={`submenu relative top-full left-0 rounded-xl bg-white/90 p-2 backdrop-blur-xl transition-[top,opacity,transform] duration-300 dark:bg-[#0B1220] lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:bg-white lg:p-4 lg:opacity-0 lg:shadow-lg lg:backdrop-blur-none lg:dark:bg-[#0B1220] lg:group-hover:visible lg:group-hover:top-full lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:translate-y-1 lg:group-hover:animate-[dropdownIn_.18s_ease-out_forwards] ${
                                openIndex === index ? "block animate-[dropdownIn_.18s_ease-out_forwards]" : "hidden"
                              }`}
                            >
                              {menuItem.submenu?.map((sub: any, i: number) => (
                                <Link
                                  key={i}
                                  href={sub.path}
                                  onClick={closeAll}
                                  className="text-gray-800 hover:bg-gray-50 hover:text-blue-600 block rounded-lg px-3 py-2.5 text-sm dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white opacity-0 animate-[subItemIn_.45s_ease-out_forwards]"
                                  style={{ animationDelay: `${70 + i * 45}ms` }}
                                >
                                  {sub.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="flex translate-y-0.5 items-center justify-end gap-3 pr-16 opacity-0 animate-[itemIn_1s_ease-out_forwards] lg:translate-y-0 lg:pr-0">
                {!isAuthed ? (
                  <div className="hidden items-center gap-3 md:flex">
                    <Link href="/signin" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition duration-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">Sign In</Link>
                    <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 active:scale-[0.98]">Sign Up</Link>
                  </div>
                ) : (
                  <div ref={accountMenuRef} className="relative hidden md:block">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((open) => !open)}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="menu"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-transparent bg-gray-100/80 px-2.5 pr-3 text-sm transition duration-200 hover:bg-gray-200/80 dark:bg-white/10 dark:hover:bg-white/15"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary shadow-sm dark:bg-[#0B1220] dark:text-blue-300">
                        {userInitials}
                      </span>
                      <span className="max-w-[130px] truncate font-semibold text-gray-900 dark:text-white">
                        {displayName || roleName}
                      </span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="m7 10 5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      role="menu"
                      className={`absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-black/10 transition duration-150 dark:border-white/10 dark:bg-[#111827] ${
                        userMenuOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-3 py-3 dark:border-white/10">
                        <p className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900 dark:text-white">
                          {displayName || "User"}
                        </p>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/15 dark:text-blue-300">
                          {roleName}
                        </span>
                      </div>

                      <Link
                        href={profileHref}
                        role="menuitem"
                        onClick={closeAll}
                        className="mt-2 flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <span>My Profile</span>
                        <span className="text-gray-400">›</span>
                      </Link>

                      <Link
                        href="/auth/resetPassword"
                        role="menuitem"
                        onClick={closeAll}
                        className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <span>Reset Password</span>
                        <span className="text-gray-400">›</span>
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={logout}
                        className="mt-2 flex w-full items-center justify-center rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes headerIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes itemIn { 0% { opacity: 0; transform: translateY(-6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes navItemIn { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes menuIn { 0% { opacity: 0; transform: translateY(6px) scale(0.99); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dropdownIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes subItemIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.75; } }
      `}</style>
    </>
  );
};

export default Header;

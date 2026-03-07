"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import { getMenuData } from "./menuData";
import { stopRefreshTokenTimer } from "@/lib/api";

type RoleName = "Admin" | "Student" | "User";

const roleNameFromId = (roleId: number | null): RoleName => {
  if (roleId === 1) return "Admin";
  if (roleId === 2) return "Student";
  return "User";
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen((s) => !s);

  // حالة (State) جديدة للتحكم بالشريط الجانبي للمستخدم
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) =>
    setOpenIndex((prev) => (prev === index ? -1 : index));

  const [token, setToken] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("token");
    const ridRaw = localStorage.getItem("roleId");
    const rid = ridRaw ? Number(ridRaw) : null;

    const n =
      localStorage.getItem("fullName") ??
      localStorage.getItem("username") ??
      "";

    setToken(t);
    setRoleId(Number.isFinite(rid as number) ? rid : null);
    setDisplayName(n);

    setMounted(true);
  }, [pathname]);

  const isAuthed = !!token;
  const roleName = roleNameFromId(roleId);

  const profileHref =
    roleName === "Admin" ? "/admin/profile" : "/students/profile";

  const menuData = useMemo(
    () => getMenuData(roleId, isAuthed),
    [roleId, isAuthed]
  );

  const logout = async () => {
    try {
      await fetch("https://localhost:7145/api/Auth/Logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    setToken(null);
    setRoleId(null);
    setDisplayName("");

    stopRefreshTokenTimer();
    setUserMenuOpen(false);
    router.push("/signin");
  };

  const closeMobileNav = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
    setUserMenuOpen(false);
  };

  // استخراج أول حرف من الاسم للصورة الرمزية
  const userInitials = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header
        style={{ marginTop: "-13px" }}
        className={`header top-0 left-0 z-40 flex w-full items-center opacity-0 animate-[headerIn_.55s_ease-out_forwards] ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-50 bg-white/80 backdrop-blur-md transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* Logo */}
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                onClick={closeMobileNav}
                className={`header-logo block w-full opacity-0 animate-[itemIn_.75s_ease-out_forwards] ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                }`}
              >
                <Image
                  src="/images/logo/logo-2.svg"
                  alt="logo"
                  width={140}
                  height={45}
                  className="w-full dark:hidden"
                />
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  width={140}
                  height={45}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>

            {/* Navigation & Controls */}
            <div className="flex w-full items-center justify-between px-4">
              <div
                className="opacity-0 animate-[itemIn_.85s_ease-out_forwards]"
                style={{ marginTop: "-14px" }}
              >
                {/* Mobile Menu Toggle */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "top-[-8px] -rotate-45" : ""
                    }`}
                  />
                </button>

                {/* Main Navigation */}
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[270px] rounded-xl border-[.5px] bg-white/90 px-6 py-4 backdrop-blur-xl duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 transition-[opacity,top,transform] ${
                    navbarOpen
                      ? "visible top-full opacity-100 translate-y-0 scale-100 animate-[menuIn_.18s_ease-out_forwards]"
                      : "invisible top-[120%] opacity-0 translate-y-2 scale-[0.99]"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem: any, index: number) => (
                      <li
                        key={menuItem.id ?? index}
                        className="group relative opacity-0 animate-[navItemIn_.65s_ease-out_forwards]"
                        style={{ animationDelay: `${160 + index * 55}ms` }}
                      >
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={closeMobileNav}
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
                              type="button"
                              onClick={() => handleSubmenu(index)}
                              className="text-gray-800 group-hover:text-blue-600 flex w-full items-center justify-between py-2 text-base lg:w-auto lg:py-6 dark:text-white/70 dark:group-hover:text-white"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>

                            <div
                              className={`submenu dark:bg-[#0B1220] relative top-full left-0 rounded-xl bg-white/90 p-2 backdrop-blur-xl transition-[top,opacity,transform] duration-300 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:translate-y-1 lg:group-hover:animate-[dropdownIn_.18s_ease-out_forwards] ${
                                openIndex === index
                                  ? "block animate-[dropdownIn_.18s_ease-out_forwards]"
                                  : "hidden"
                              }`}
                            >
                              {menuItem.submenu?.map(
                                (submenuItem: any, si: number) => (
                                  <Link
                                    href={submenuItem.path}
                                    onClick={closeMobileNav}
                                    key={submenuItem.id ?? si}
                                    className="text-gray-800 hover:bg-gray-50 hover:text-blue-600 block rounded-lg px-3 py-2.5 text-sm dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white opacity-0 animate-[subItemIn_.45s_ease-out_forwards]"
                                    style={{
                                      animationDelay: `${70 + si * 45}ms`,
                                    }}
                                  >
                                    {submenuItem.title}
                                  </Link>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Auth Links for Mobile (Inside Navbar) */}
                  {!mounted ? null : !isAuthed ? (
                    <div className="mt-4 flex flex-col gap-2 md:hidden opacity-0 animate-[menuIn_.22s_ease-out_forwards]">
                      <Link
                        href="/signin"
                        onClick={closeMobileNav}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition duration-300 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMobileNav}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 active:scale-[0.98]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  ) : null}
                </nav>
              </div>

              {/* Desktop Auth Controls & Theme Toggler */}
              <div className="flex items-center justify-end pr-16 lg:pr-0 opacity-0 animate-[itemIn_1s_ease-out_forwards]">
                {!mounted ? null : !isAuthed ? (
                  <div className="hidden items-center gap-3 md:flex">
                    <Link
                      href="/signin"
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition duration-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 active:scale-[0.98]"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    {/* User Profile Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(true)}
                      className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2 text-base font-semibold text-gray-900 shadow-sm transition duration-200 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-[pulseDot_1.8s_ease-in-out_infinite]" />
                      <span className="max-w-[120px] truncate">
                        {displayName || (roleName === "Admin" ? "Admin" : "User")}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-600/20 dark:text-blue-400">
                        {roleName}
                      </span>
                    </button>
                  </div>
                )}

                <div className="ml-3 opacity-0 animate-[itemIn_1.1s_ease-out_forwards]">
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= USER SIDE DRAWER ================= */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0B0F19]/40 backdrop-blur-sm transition-all duration-300 ${
          userMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setUserMenuOpen(false)}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] flex h-screen w-[320px] flex-col overflow-y-auto border-l border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] dark:border-white/10 dark:bg-[#0B0F19]/90 ${
          userMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header & Close Button */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-white/10">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Account</h4>
          <button
            onClick={() => setUserMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-2xl font-bold text-white shadow-lg">
            {userInitials}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {displayName || "User"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Role: <span className="font-semibold text-blue-600 dark:text-blue-400">{roleName}</span>
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col gap-2 px-6">
          <Link
            href={profileHref}
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            My Profile
          </Link>

          <Link
            href="/auth/resetPassword"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Reset Password
          </Link>
        </div>

        {/* Footer / Logout */}
        <div className="border-t border-gray-200 p-6 dark:border-white/10">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-red-500 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <style>{`
        @keyframes headerIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemIn {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes navItemIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuIn {
          0% { opacity: 0; transform: translateY(6px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropdownIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes subItemIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.75; }
        }
      `}</style>
    </>
  );
};

export default Header;
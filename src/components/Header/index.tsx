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
  } catch {
  }

  localStorage.removeItem("token");
  localStorage.removeItem("roleId");
  localStorage.removeItem("fullName");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");

  setToken(null);
  setRoleId(null);
  setDisplayName("");

  stopRefreshTokenTimer();

  router.push("/signin");
};

  const closeMobileNav = () => {
    setNavbarOpen(false);
    setOpenIndex(-1);
  };

  return (
    <header
      className={`header top-0 left-0 z-40 flex w-full items-center ${
        sticky
          ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-9999 bg-white/80 backdrop-blur-xs transition"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4 xl:mr-12">
            <Link
              href="/"
              onClick={closeMobileNav}
              className={`header-logo block w-full ${
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

          <div className="flex w-full items-center justify-between px-4">
            <div>
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

              <nav
                id="navbarCollapse"
                className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[270px] rounded-xl border-[.5px] bg-white/90 px-6 py-4 backdrop-blur-xl duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen
                    ? "visible top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block lg:flex lg:space-x-12">
                  {menuData.map((menuItem: any, index: number) => (
                    <li key={menuItem.id ?? index} className="group relative">
                      {menuItem.path ? (
                        <Link
                          href={menuItem.path}
                          onClick={closeMobileNav}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            pathname === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSubmenu(index)}
                            className="text-dark group-hover:text-primary flex w-full items-center justify-between py-2 text-base lg:w-auto lg:py-6 dark:text-white/70 dark:group-hover:text-white"
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
                            className={`submenu dark:bg-dark relative top-full left-0 rounded-xl bg-white/90 p-2 backdrop-blur-xl transition-[top] duration-300 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full lg:group-hover:opacity-100 ${
                              openIndex === index ? "block" : "hidden"
                            }`}
                          >
                            {menuItem.submenu?.map(
                              (submenuItem: any, si: number) => (
                                <Link
                                  href={submenuItem.path}
                                  onClick={closeMobileNav}
                                  key={submenuItem.id ?? si}
                                  className="text-dark hover:text-primary block rounded-lg px-3 py-2.5 text-sm dark:text-white/70 dark:hover:text-white"
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

                {!mounted ? null : !isAuthed ? (
                  <div className="mt-4 flex flex-col gap-2 md:hidden">
                    <Link
                      href="/signin"
                      onClick={closeMobileNav}
                      className="
                        w-full rounded-2xl
                        border border-white/20
                        bg-white/10
                        px-4 py-3
                        text-center text-sm font-semibold
                        text-dark
                        shadow-sm
                        backdrop-blur-xl
                        transition duration-300
                        hover:bg-white/15 hover:border-white/30
                        dark:border-white/10 dark:bg-white/5 dark:text-white
                        dark:hover:bg-white/10 dark:hover:border-white/20
                      "
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMobileNav}
                      className="
                        w-full rounded-2xl
                        bg-primary
                        px-4 py-3
                        text-center text-sm font-semibold text-white
                        shadow-btn
                        transition duration-300
                        hover:bg-primary/90 hover:shadow-btn-hover
                        active:scale-[0.99]
                      "
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 md:hidden">
                    <Link
                      href={profileHref}
                      onClick={closeMobileNav}
                      className="
                        w-full rounded-2xl
                        border border-white/20
                        bg-white/10
                        px-4 py-3
                        text-center text-sm font-semibold
                        text-dark
                        shadow-sm
                        backdrop-blur-xl
                        transition duration-300
                        hover:bg-white/15 hover:border-white/30
                        dark:border-white/10 dark:bg-white/5 dark:text-white
                        dark:hover:bg-white/10 dark:hover:border-white/20
                      "
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        closeMobileNav();
                        logout();
                      }}
                      className="
                        w-full rounded-2xl
                        bg-red-600
                        px-4 py-3
                        text-center text-sm font-semibold text-white
                        shadow-sm
                        transition duration-300
                        hover:bg-red-700
                        active:scale-[0.99]
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </div>

            <div className="flex items-center justify-end pr-16 lg:pr-0">
              {!mounted ? null : !isAuthed ? (
                <div className="hidden items-center gap-3 md:flex">
                  <Link
                    href="/signin"
                    className="
                      inline-flex items-center justify-center
                      rounded-2xl
                      border border-white/20
                      bg-white/10
                      px-6 py-3
                      text-sm font-semibold
                      text-dark dark:text-white
                      backdrop-blur-xl
                      shadow-sm
                      transition duration-300
                      hover:bg-white/15 hover:border-white/30
                      dark:border-white/10 dark:bg-white/5
                      dark:hover:bg-white/10 dark:hover:border-white/20
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="
                      inline-flex items-center justify-center
                      rounded-2xl
                      bg-primary
                      px-6 py-3
                      text-sm font-semibold
                      text-white
                      shadow-btn
                      transition duration-300
                      hover:bg-primary/90 hover:shadow-btn-hover
                      active:scale-[0.99]
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="group relative hidden md:block">
                  <button
                    type="button"
                    className="
                      inline-flex items-center gap-3
                      rounded-full
                      px-5 py-2.5
                      text-base font-semibold
                      border border-white/20
                      bg-white/10
                      text-dark
                      shadow-sm
                      backdrop-blur-xl
                      transition duration-200
                      hover:bg-white/15 hover:border-white/30
                      dark:border-white/10 dark:bg-white/5 dark:text-white
                      dark:hover:bg-white/10 dark:hover:border-white/20
                    "
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-primary dark:bg-white" />

                    <span className="max-w-[160px] truncate">
                      {displayName || (roleName === "Admin" ? "Admin" : "User")}
                    </span>

                    <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary dark:bg-white/20 dark:text-white">
                      {roleName}
                    </span>

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 25 24"
                      className="opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <div className="dark:bg-dark invisible absolute right-0 top-[110%] w-[240px] rounded-2xl border border-white/10 bg-white/80 p-4 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:top-full group-hover:opacity-100 dark:bg-[#0B1220]/70">
                    <Link
                      href={profileHref}
                      className="text-dark hover:text-primary block rounded-lg px-3 py-2.5 text-sm dark:text-white/70 dark:hover:text-white"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/auth/resetPassword"
                      className="text-dark hover:text-primary block rounded-lg px-3 py-2.5 text-sm dark:text-white/70 dark:hover:text-white"
                    >
                      Reset Password
                    </Link>

                    <button
                      onClick={logout}
                      className="mt-2 w-full rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 active:scale-[0.99]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              <div className="ml-2">
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

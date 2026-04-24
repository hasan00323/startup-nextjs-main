import { useCallback, useEffect, useState } from "react";

export const useSticky = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateSticky = () => {
      const nextSticky = window.scrollY >= 80;
      setSticky((current) => (current === nextSticky ? current : nextSticky));
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateSticky);
    };

    updateSticky();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return sticky;
};

export const useNavbarState = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleNavbar = useCallback(() => setNavbarOpen((prev) => !prev), []);
  const handleSubmenu = useCallback(
    (index: number) => setOpenIndex((prev) => (prev === index ? -1 : index)),
    []
  );
  const closeAll = useCallback(() => {
    setNavbarOpen(false);
    setUserMenuOpen(false);
    setOpenIndex(-1);
  }, []);

  return { 
    navbarOpen, userMenuOpen, openIndex, 
    toggleNavbar, handleSubmenu, closeAll, setUserMenuOpen 
  };
};

export const useAuthLoader = (pathname: string) => {
  const [authState, setAuthState] = useState({
    token: null as string | null,
    roleId: null as number | null,
    displayName: "",
    mounted: false
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    const ridRaw = localStorage.getItem("roleId");
    const rid = ridRaw ? Number(ridRaw) : null;
    const name = localStorage.getItem("fullName") ?? localStorage.getItem("username") ?? "";
    
    setAuthState({ 
      token: t, 
      roleId: rid, 
      displayName: name, 
      mounted: true 
    });
  }, [pathname]);

  return authState;
};

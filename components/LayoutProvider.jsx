"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { usePathname, useRouter } from "next/navigation";
import { configs } from "../configs";
import { ToastContainer } from "react-toastify";

/**
 * Public routes that shouldn't require auth.
 * Add more as needed: "/register", "/forgot-password", etc.
 */
const PUBLIC_PREFIXES = ["/login", "/register", "/forgot-password"];

function useAuthState(tokenKey) {
  const read = () => {
    if (typeof window === "undefined") return false;
    const v = localStorage.getItem(tokenKey);
    // treat any non-empty string as "logged in"
    return Boolean(v && v.trim() && v !== "undefined" && v !== "null");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return read();
  });

  useEffect(() => {
    // Check auth state on mount and when tokenKey changes
    setIsLoggedIn(read());
    
    const onStorage = (e) => {
      if (e.key === tokenKey) {
        setIsLoggedIn(read());
      }
    };
    
    const onFocus = () => {
      setIsLoggedIn(read());
    };
    
    // Custom event listener for immediate updates (when login happens in same tab)
    const onAuthChange = () => {
      setIsLoggedIn(read());
    };
    
    // Listen for custom auth change events (can be dispatched from login page)
    window.addEventListener("auth-state-changed", onAuthChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    
    return () => {
      window.removeEventListener("auth-state-changed", onAuthChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [tokenKey]);

  return isLoggedIn;
}

export default function LayoutProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Use your configured key name (not the value), fallback to "token"
  const tokenKey = configs?.tokenKey || configs?.AUTH_COOKIE_NAME || "token";
  const isLoggedIn = useAuthState(tokenKey);

  // Is current path public?
  const isPublic = useMemo(
    () => PUBLIC_PREFIXES.some((p) => pathname?.startsWith(p)),
    [pathname]
  );

  // Redirect decisions happen in an effect (not during render!)
  useEffect(() => {
    if (!pathname) return;
    
    // If NOT logged in and trying to access a protected route -> /login
    if (!isLoggedIn && !isPublic) {
      router.replace("/login");
      return;
    }
    
    // If logged in and on a public auth page (like /login) -> redirect to home
    if (isLoggedIn && isPublic) {
      router.replace("/");
      return;
    }
  }, [isLoggedIn, isPublic, pathname, router]);


  if (!isLoggedIn && !isPublic) {
    return null;
  }

  return <Provider store={store}>{children}
  <ToastContainer />
  </Provider>;
}

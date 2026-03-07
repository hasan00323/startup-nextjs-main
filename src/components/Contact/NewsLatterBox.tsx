"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NewsLatterBox = () => {
  const { theme } = useTheme();
  
  // لضمان عدم حدوث مشاكل Hydration مع الـ theme في Next.js
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-[#0B0F19]/40 dark:backdrop-blur-xl sm:p-8">
      
      <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
        Get Future Dev updates
      </h3>

      <p className="mb-7 border-b border-gray-200 pb-7 text-sm leading-relaxed text-gray-600 dark:border-white/10 dark:text-gray-400">
        Subscribe to receive new course announcements, feature updates, and helpful learning tips.
        We only send important updates.
      </p>

      <form>
        {/* Name Input */}
        <div className="mb-4">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50 dark:focus-within:ring-blue-500/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path
                d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-5">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50 dark:focus-within:ring-blue-500/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path
                d="M4 6.5h16v11H4v-11Zm1.5 1.6 6.2 4.8c.2.2.5.2.7 0l6.1-4.8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mb-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 active:scale-[0.98]"
        >
          Subscribe
        </button>

        <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">
          No spam. You can unsubscribe anytime.
        </p>
      </form>

      {/* Decorative Background SVGs */}
      {mounted && (
        <div className="pointer-events-none">
          <span className="absolute top-6 left-2">
            <svg width="57" height="65" viewBox="0 0 57 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.5" d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z" fill="url(#paint0_linear_1028_600)" />
              <defs>
                <linearGradient id="paint0_linear_1028_600" x1="-18.3187" y1="55.1044" x2="37.161" y2="15.3509" gradientUnits="userSpaceOnUse">
                  <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <span className="absolute bottom-22 left-1.5">
            <svg width="39" height="32" viewBox="0 0 39 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.5" d="M14.7137 31.4215L38.6431 4.24115L6.96581e-07 0.624124L14.7137 31.4215Z" fill="url(#paint0_linear_1028_601)" />
              <defs>
                <linearGradient id="paint0_linear_1028_601" x1="39.1948" y1="38.335" x2="10.6982" y2="10.2511" gradientUnits="userSpaceOnUse">
                  <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <span className="absolute top-[130px] right-2">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.5" d="M10.6763 35.3091C23.3976 41.6367 38.1681 31.7045 37.107 17.536C36.1205 4.3628 21.9407 -3.46901 10.2651 2.71063C-2.92254 9.69061 -2.68321 28.664 10.6763 35.3091Z" fill="url(#paint0_linear_1028_602)" />
              <defs>
                <linearGradient id="paint0_linear_1028_602" x1="-0.571054" y1="-37.1717" x2="28.7937" y2="26.7564" gradientUnits="userSpaceOnUse">
                  <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>

          <span className="absolute top-0 right-0">
            <svg width="162" height="91" viewBox="0 0 162 91" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.3">
                <path opacity="0.45" d="M1 89.9999C8 77.3332 27.7 50.7999 50.5 45.9999C79 39.9999 95 41.9999 106 30.4999C117 18.9999 126 -3.50014 149 -3.50014C172 -3.50014 187 4.99986 200.5 -8.50014C214 -22.0001 210.5 -46.0001 244 -37.5001C270.8 -30.7001 307.167 -45 322 -53" stroke="url(#paint0_linear_1028_603)" />
                <path opacity="0.45" d="M43 64.9999C50 52.3332 69.7 25.7999 92.5 20.9999C121 14.9999 137 16.9999 148 5.49986C159 -6.00014 168 -28.5001 191 -28.5001C214 -28.5001 229 -20.0001 242.5 -33.5001C256 -47.0001 252.5 -71.0001 286 -62.5001C312.8 -55.7001 349.167 -70 364 -78" stroke="url(#paint1_linear_1028_603)" />
                <path opacity="0.45" d="M4 73.9999C11 61.3332 30.7 34.7999 53.5 29.9999C82 23.9999 98 25.9999 109 14.4999C120 2.99986 129 -19.5001 152 -19.5001C175 -19.5001 190 -11.0001 203.5 -24.5001C217 -38.0001 213.5 -62.0001 247 -53.5001C273.8 -46.7001 310.167 -61 325 -69" stroke="url(#paint2_linear_1028_603)" />
                <path opacity="0.45" d="M41 40.9999C48 28.3332 67.7 1.79986 90.5 -3.00014C119 -9.00014 135 -7.00014 146 -18.5001C157 -30.0001 166 -52.5001 189 -52.5001C212 -52.5001 227 -44.0001 240.5 -57.5001C254 -71.0001 250.5 -95.0001 284 -86.5001C310.8 -79.7001 347.167 -94 362 -102" stroke="url(#paint3_linear_1028_603)" />
              </g>
              <defs>
                <linearGradient id="paint0_linear_1028_603" x1="291.35" y1="12.1032" x2="179.211" y2="237.617" gradientUnits="userSpaceOnUse">
                  <stop offset="0.328125" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_1028_603" x1="333.35" y1="-12.8968" x2="221.211" y2="212.617" gradientUnits="userSpaceOnUse">
                  <stop offset="0.328125" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_1028_603" x1="294.35" y1="-3.89678" x2="182.211" y2="221.617" gradientUnits="userSpaceOnUse">
                  <stop offset="0.328125" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint3_linear_1028_603" x1="331.35" y1="-36.8968" x2="219.211" y2="188.617" gradientUnits="userSpaceOnUse">
                  <stop offset="0.328125" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} />
                  <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default NewsLatterBox;
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type RegisterResponse = {
  token?: string;
  accessToken?: string;
};

const SignupPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [uniName, setUniName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Glassy input classes (same vibe as your navbar)
  const inputClass = useMemo(
    () =>
      `
      w-full rounded-2xl
      border border-white/20
      bg-white/10
      px-5 py-3
      text-sm md:text-base
      text-dark placeholder:text-dark/50
      shadow-sm
      backdrop-blur-xl
      outline-none
      transition duration-300
      focus:border-primary/60 focus:ring-2 focus:ring-primary/20
      dark:border-white/10 dark:bg-white/5
      dark:text-white dark:placeholder:text-white/50
      dark:focus:border-white/30 dark:focus:ring-white/10
    `,
    []
  );

  const labelClass = useMemo(
    () => "mb-2 block text-sm font-semibold text-dark dark:text-white",
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accepted) {
      setError("Please accept Terms & Conditions.");
      return;
    }

    if (password !== confirmedPassword) {
      setError("Password and Confirmed Password do not match.");
      return;
    }

    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://localhost:7145/api/Auth/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          dob: new Date(dob).toISOString(),
          password,
          uniName,
          confirmedPassword,
        }),
      });

      if (!res.ok) {
        let msg = `Signup failed (${res.status})`;
        try {
          const errJson = await res.json();
          msg = errJson?.message || errJson?.error || msg;
        } catch {
          const t = await res.text().catch(() => "");
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      const data: RegisterResponse = await res.json();
      const token = data.token || data.accessToken;

      if (token) {
        localStorage.setItem("token", String(token));
        router.push("/");
      } else {
        router.push("/signin");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 md:pt-32 lg:pt-[150px] lg:pb-24">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            {/* ✅ Smaller, glassy, curved card */}
            <div
              className="
                mx-auto
                w-full
                max-w-[460px]
                rounded-3xl
                border border-white/15
                bg-white/10
                p-6
                shadow-sticky
                backdrop-blur-xl
                md:p-10
                dark:border-white/10
                dark:bg-white/5
              "
            >
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-extrabold text-dark dark:text-white md:text-3xl">
                  Create your account
                </h3>
                <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                  It’s totally free and super easy
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* ✅ Two-column layout on md, one-column on mobile */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="e.g. +9627..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>University Name</label>
                    <input
                      type="text"
                      name="uniName"
                      placeholder="Enter your university name"
                      value={uniName}
                      onChange={(e) => setUniName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmedPassword"
                      placeholder="Confirm your password"
                      value={confirmedPassword}
                      onChange={(e) => setConfirmedPassword(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* ✅ checkbox block (glassy) */}
                <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-body-color shadow-sm backdrop-blur-xl transition hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-body-color-dark dark:hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 accent-primary"
                  />
                  <span className="leading-relaxed">
                    By creating account means you agree to the{" "}
                    <a href="#0" className="text-primary hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and our{" "}
                    <a href="#0" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                {/* ✅ Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    shadow-btn hover:shadow-btn-hover
                    bg-primary hover:bg-primary/90
                    flex w-full items-center justify-center
                    rounded-2xl
                    px-8 py-3.5
                    text-base font-semibold text-white
                    transition duration-300
                    disabled:opacity-60
                    active:scale-[0.99]
                  "
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm font-medium text-body-color dark:text-body-color-dark">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background SVG (kept from template) */}
      <div className="absolute top-0 left-0 z-[-1]">
        <svg
          width="1440"
          height="969"
          viewBox="0 0 1440 969"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_95:1005"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1440"
            height="969"
          >
            <rect width="1440" height="969" fill="#090E34" />
          </mask>
          <g mask="url(#mask0_95:1005)">
            <path
              opacity="0.1"
              d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
              fill="url(#paint0_linear_95:1005)"
            />
            <path
              opacity="0.1"
              d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
              fill="url(#paint1_linear_95:1005)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_95:1005"
              x1="1178.4"
              y1="151.853"
              x2="780.959"
              y2="453.581"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_95:1005"
              x1="160.5"
              y1="220"
              x2="1099.45"
              y2="1192.04"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default SignupPage;

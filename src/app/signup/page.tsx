"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50";
const labelClass = "mb-2 block text-sm font-semibold text-white";

const SignupPage = () => {
  const router = useRouter();

  // ستيت وحدة بتلم كل حقول الفورم
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    uniName: "",
    password: "",
    confirmedPassword: "",
    accepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // فنكشن واحد للتعامل مع كل التغييرات (للنصوص والـ Checkbox)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accepted) return setError("Please accept Terms & Conditions.");
    if (formData.password !== formData.confirmedPassword) return setError("Passwords do not match.");
    if (!formData.dob) return setError("Please select your date of birth.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://localhost:7145/api/Auth/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dob: new Date(formData.dob).toISOString(),
          password: formData.password,
          uniName: formData.uniName,
          confirmedPassword: formData.confirmedPassword,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.message || errJson?.error || `Signup failed (${res.status})`);
      }

      const data = await res.json();
      const token = data?.token || data?.accessToken;

      localStorage.setItem("token", String(token));
      router.push("/signin");
     
    } catch (err: any) {
      setError(err?.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-full bg-[#0B0F19] opacity-0 animate-[pageFade_.5s_ease-out_forwards]" style={{ marginTop: "80px" }}>
        
        {/* ================= LEFT SIDE: BRANDING & IMAGE ================= */}
        <div className="relative hidden w-full items-center justify-center overflow-hidden lg:flex lg:w-1/2 xl:w-[50%] 2xl:w-[55%]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>

          <div className="relative z-10 flex flex-col items-center text-center opacity-0 animate-[itemUp_.8s_ease-out_forwards] [animation-delay:400ms] px-8">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Join Future Dev
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-300">
              Start your journey with us today. Create an account to unlock powerful tools, connect with peers, and build the future.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FORM ================= */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 xl:w-[50%] 2xl:w-[45%]" style={{ marginRight: "120px" }}>
          <div className="mx-auto w-full max-w-[550px] opacity-0 animate-[cardFade_.6s_ease-out_forwards]">
            
            <div className="mb-8 text-left">
              <h3 className="mb-2 text-3xl font-bold text-white opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:120ms]">
                Create your account
              </h3>
              <p className="text-sm font-medium text-gray-400 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:180ms]">
                It’s totally free and super easy. Join us today!
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 opacity-0 animate-[itemUp_.4s_ease-out_forwards]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                
                <div className="md:col-span-2 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:200ms]">
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required className={inputClass} />
                </div>

                <div className="md:col-span-2 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:240ms]">
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className={inputClass} />
                </div>

                <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:280ms]">
                  <label className={labelClass}>Phone Number</label>
                  <input type="text" name="phoneNumber" placeholder="e.g. +9627..." value={formData.phoneNumber} onChange={handleChange} required className={inputClass} />
                </div>

                <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:320ms]">
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.6]`} />
                </div>

                <div className="md:col-span-2 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:360ms]">
                  <label className={labelClass}>University Name</label>
                  <input type="text" name="uniName" placeholder="Enter your university name" value={formData.uniName} onChange={handleChange} required className={inputClass} />
                </div>

                <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:400ms]">
                  <label className={labelClass}>Password</label>
                  <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className={inputClass} />
                </div>

                <div className="opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:440ms]">
                  <label className={labelClass}>Confirm Password</label>
                  <input type="password" name="confirmedPassword" placeholder="Confirm your password" value={formData.confirmedPassword} onChange={handleChange} required className={inputClass} />
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400 transition hover:bg-white/10 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:480ms]">
                <input type="checkbox" name="accepted" checked={formData.accepted} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 accent-blue-600 focus:ring-blue-600 focus:ring-offset-gray-800" />
                <span className="leading-relaxed">
                  By creating an account, you agree to the <a href="#0" className="text-blue-500 hover:underline">Terms and Conditions</a> and our <a href="#0" className="text-blue-500 hover:underline">Privacy Policy</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 disabled:opacity-60 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:520ms]"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-medium text-gray-400 opacity-0 animate-[itemUp_.6s_ease-out_forwards] [animation-delay:560ms]">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-blue-500 transition hover:text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pageFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes cardFade {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes itemUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
};

export default SignupPage;
"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-gray-50 pb-16 pt-32 dark:bg-[#0B0F19] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px]"
      >
        {/* ================= BACKGROUND GLOW EFFECTS ================= */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px] dark:bg-blue-600/20"></div>
        <div className="absolute right-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-600/15"></div>

        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            
            {/* ================= LEFT SIDE: CONTENT ================= */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[600px] lg:mb-0">
                
                {/* Badge */}
                <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] backdrop-blur-md">
                  <span className="mr-2 flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Future Dev Platform 2.0
                </div>

                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl md:text-[54px] md:leading-[1.15] opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:100ms]">
                  Manage your courses with{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                    Ultimate Clarity
                  </span>
                </h1>

                <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-400 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:200ms]">
                  Future Dev gives instructors and admins a clean dashboard to
                  create courses, track progress, and control access with secure
                  authentication. All in one place.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:300ms]">
                  <Link
                    href="/signin"
                    className="
                      inline-flex items-center justify-center
                      rounded-xl bg-blue-600 px-8 py-4
                      text-base font-semibold text-white shadow-lg shadow-blue-500/30
                      transition duration-300
                      hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/40
                      active:scale-[0.98]
                    "
                  >
                    Get Started Free
                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <Link
                    href="/courses"
                    className="
                      inline-flex items-center justify-center
                      rounded-xl border border-gray-200 bg-white/50 px-8 py-4
                      text-base font-semibold text-gray-900 shadow-sm
                      backdrop-blur-xl transition duration-300
                      hover:-translate-y-1 hover:bg-white/80 hover:border-gray-300
                      dark:border-white/10 dark:bg-white/5 dark:text-white
                      dark:hover:bg-white/10 dark:hover:border-white/20
                      active:scale-[0.98]
                    "
                  >
                    Discover Courses
                  </Link>
                </div>
                
                <p className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-500 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] [animation-delay:400ms]">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>

            {/* ================= RIGHT SIDE: ABSTRACT DASHBOARD ================= */}
            <div className="w-full px-4 lg:w-1/2 opacity-0 animate-[fadeInUp_1s_ease-out_forwards] [animation-delay:300ms]">
              <div className="relative mx-auto w-full max-w-[550px] animate-[float_6s_ease-in-out_infinite]">
                
                {/* Main Glass Panel */}
                <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0B1220]/60 sm:p-8">
                  {/* Fake MacOS Window Dots */}
                  <div className="mb-6 flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Active Courses Overview</h3>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Monitoring real-time student progress</p>

                  {/* Fake Progress Bars */}
                  <div className="space-y-5">
                    {[
                      { title: "Advanced React Patterns", percent: "85%", color: "bg-blue-500" },
                      { title: "Next.js App Router Mastery", percent: "60%", color: "bg-purple-500" },
                      { title: "C# & .NET Microservices", percent: "40%", color: "bg-green-500" },
                    ].map((item, index) => (
                      <div key={index} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-white/5">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{item.percent}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.percent }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Element 1 (Total Students) */}
                <div className="absolute -right-6 top-20 z-20 flex animate-[float_5s_ease-in-out_infinite_reverse] items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#151E32]/80 sm:-right-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Students</p>
                    <p className="text-xl font-extrabold text-gray-900 dark:text-white">12,450</p>
                  </div>
                </div>

                {/* Floating Element 2 (Revenue / Success) */}
                <div className="absolute -bottom-8 -left-6 z-20 flex animate-[float_7s_ease-in-out_infinite] items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#151E32]/80 sm:-left-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">System Status</p>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-white">All Systems Go</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </>
  );
};

export default Hero;
"use client";

import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative z-10 overflow-hidden py-16 md:py-20 lg:py-28"
    >
      {/* خلفية جمالية خفيفة (Glow) خلف التصميم */}
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px] dark:bg-blue-500/10"></div>

      <div className="container">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="mx-auto mb-16 max-w-2xl text-center opacity-0 animate-[contactItemUp_.6s_ease-out_forwards]">
          <span className="mb-2 block text-sm font-semibold text-blue-600 dark:text-blue-400">
            Need Help?
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-[40px]">
            Let's build the future together
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            Whether you have a question about courses, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* ----- LEFT COLUMN: CONTACT FORM (Spans 7 columns on large screens) ----- */}
          <div className="lg:col-span-7 xl:col-span-8 opacity-0 animate-[contactCardIn_.7s_ease-out_forwards] [animation-delay:150ms]">
            <div className="h-full rounded-3xl border border-gray-200 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F19]/60 sm:p-10">
              <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Send us a Message
              </h3>

              <form>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.5v.75h15v-.75c0-2.4-3.3-4.5-7.5-4.5Z" fill="currentColor" opacity="0.9" />
                      </svg>
                      <input id="name" type="text" placeholder="John Doe" className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white" />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M4 6.5h16v11H4v-11Zm1.5 1.6 6.2 4.8c.2.2.5.2.7 0l6.1-4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input id="email" type="email" placeholder="john@example.com" className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white" />
                    </div>
                  </div>

                  {/* Subject Input (جديد) */}
                  <div className="md:col-span-2">
                    <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      Subject
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input id="subject" type="text" placeholder="e.g. Course Enrollment Issue" className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white" />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      Your Message
                    </label>
                    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/50 px-4 py-3 transition duration-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-blue-500/50">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-1 text-gray-400">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <textarea id="message" name="message" rows={5} placeholder="How can we help you?" className="w-full resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white"></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2">
                    <button type="submit" className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-10 py-4 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500 hover:-translate-y-1 active:scale-[0.98] sm:w-auto">
                      Send Message
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="ml-2">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

          {/* ----- RIGHT COLUMN: CONTACT INFO & NEWSLETTER (Spans 5 columns) ----- */}
          <div className="flex flex-col gap-8 lg:col-span-5 xl:col-span-4 opacity-0 animate-[contactSideIn_.7s_ease-out_forwards] [animation-delay:250ms]">
            
            {/* Quick Contact Info Card */}
            <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
              <h3 className="mb-6 text-xl font-bold">Contact Information</h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6.5h16v11H4v-11Zm1.5 1.6 6.2 4.8c.2.2.5.2.7 0l6.1-4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-200">Email Us</h4>
                    <p className="text-base font-semibold">support@futuredev.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-200">Location</h4>
                    <p className="text-base font-semibold">Amman, Jordan<br/>King Hussein Business Park</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Component */}
            <div className="w-full">
              <NewsLatterBox />
            </div>

          </div>
          
        </div>
      </div>

      <style jsx>{`
        @keyframes contactItemUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes contactCardIn {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes contactSideIn {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
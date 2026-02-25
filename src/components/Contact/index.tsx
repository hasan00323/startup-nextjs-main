"use client";

import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  return (
    <section
      id="contact"
      className="overflow-hidden py-12 md:py-16 lg:py-20 opacity-0 animate-[contactSectionIn_.6s_ease-out_forwards]"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-start">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="mb-10 bg-white px-6 py-8 shadow-three dark:bg-gray-dark sm:px-10 sm:py-10 lg:mb-5 opacity-0 animate-[contactCardIn_.7s_ease-out_forwards] [animation-delay:100ms]"
              data-wow-delay=".15s"
              style={{ borderRadius: 18 }}
            >
              <h2 className="mb-2 text-[22px] font-bold leading-snug text-black dark:text-white sm:text-[28px] lg:text-[24px] xl:text-[28px] opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:180ms]">
                Contact Future Dev Support
              </h2>
              <p className="mb-8 text-sm font-medium leading-relaxed text-body-color sm:text-base opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:240ms]">
                Have a question about courses, enrollment, or your account? Send us a message and we’ll respond as soon as possible.
              </p>

              <form>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2 opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:300ms]">
                    <div className="mb-6">
                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-medium text-dark dark:text-white sm:text-sm"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="border-stroke w-full border bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-hidden transition focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none focus:scale-[1.01]"
                        style={{ borderRadius: 12 }}
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2 opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:360ms]">
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-medium text-dark dark:text-white sm:text-sm"
                      >
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-stroke w-full border bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-hidden transition focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none focus:scale-[1.01]"
                        style={{ borderRadius: 14 }}
                      />
                    </div>
                  </div>

                  <div className="w-full px-4 opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:420ms]">
                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="mb-2 block text-xs font-medium text-dark dark:text-white sm:text-sm"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us what you need help with (course, enrollment, login, etc.)"
                        className="border-stroke w-full resize-none border bg-[#f8f8f8] px-4 py-2.5 text-sm text-body-color outline-hidden transition focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none focus:scale-[1.01]"
                        style={{ borderRadius: 16 }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="w-full px-4 opacity-0 animate-[contactItemUp_.6s_ease-out_forwards] [animation-delay:480ms]">
                    <button
                      type="submit"
                      className="bg-primary px-7 py-3 text-sm font-medium text-white shadow-submit transition duration-300 hover:bg-primary/90 hover:-translate-y-1 hover:shadow-lg dark:shadow-submit-dark active:scale-[0.98]"
                      style={{ borderRadius: 15 }}
                    >
                      Send Message
                    </button>

                    <p className="mt-4 text-xs text-body-color sm:text-sm">
                      Tip: Include your email and the course name (if related) to help us respond faster.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full px-4 lg:w-5/12 xl:w-4/12 opacity-0 animate-[contactSideIn_.7s_ease-out_forwards] [animation-delay:180ms]">
            <NewsLatterBox />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes contactSectionIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes contactCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes contactItemUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes contactSideIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
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
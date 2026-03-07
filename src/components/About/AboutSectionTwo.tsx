"use client";

import Image from "next/image";

const AboutSectionTwo = () => {
  // مكوّن فرعي للعناصر لضمان التناسق
  const FeatureItem = ({ title, desc, icon, delay }: { title: string, desc: string, icon: React.ReactNode, delay: string }) => (
    <div className={`mb-9 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] ${delay}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm backdrop-blur-md dark:bg-white/5 dark:text-white">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
      </div>
      <p className="text-base font-medium leading-relaxed text-body-color dark:text-gray-400 sm:text-lg pl-12">
        {desc}
      </p>
    </div>
  );

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-28">
      
      {/* Background Glow خلف الصورة */}
      <div className="absolute right-1/2 top-1/4 -z-10 h-[500px] w-[500px] translate-x-[-20%] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10"></div>

      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          
          {/* ================= IMAGE SIDE (LEFT) ================= */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto mb-12 aspect-square max-w-[500px] opacity-0 animate-[fadeInUp_.7s_ease-out_forwards] [animation-delay:120ms] lg:m-0">
              
              {/* Decorative Circle خلف الصورة */}
              <div className="absolute inset-0 scale-75 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-pulse"></div>

              <div className="relative h-full w-full animate-[float_8s_ease-in-out_infinite]">
                <Image
                  src="/images/about/about-image-2.svg"
                  alt="Learning experience"
                  fill
                  className="object-contain drop-shadow-2xl dark:hidden"
                />
                <Image
                  src="/images/about/about-image-2-dark.svg"
                  alt="Learning experience"
                  fill
                  className="hidden object-contain drop-shadow-2xl dark:block"
                />
              </div>
            </div>
          </div>

          {/* ================= CONTENT SIDE (RIGHT) ================= */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[520px] lg:pl-8">
              
              <FeatureItem 
                title="Clear learning journey"
                delay="[animation-delay:200ms]"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                }
                desc="Future Dev organizes each course into a simple flow so students always know what to do next. Lessons are structured and progress is easy to follow."
              />

              <FeatureItem 
                title="Organized student profiles"
                delay="[animation-delay:300ms]"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                }
                desc="Each student has a profile that keeps key details and enrollment history organized. This makes it easier to manage records and support students."
              />

              <FeatureItem 
                title="Reliable access and privacy"
                delay="[animation-delay:400ms]"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                desc="Accounts are protected with secure login and backend validation. Personal information is handled carefully, and sensitive actions remain restricted."
              />

            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default AboutSectionTwo;
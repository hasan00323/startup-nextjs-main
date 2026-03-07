"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text, delay }: { text: string, delay: string }) => (
    <div className={`flex items-center gap-4 mb-5 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards] ${delay}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm backdrop-blur-md dark:bg-white/10 dark:text-white">
        {checkIcon}
      </div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {text}
      </p>
    </div>
  );

  return (
    <section id="about" className="relative overflow-hidden pt-16 md:pt-20 lg:pt-28">
      
      {/* Background Glows لربط التصميم بباقي الموقع */}
      <div className="absolute left-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10"></div>

      <div className="container">
        <div className="border-b border-gray-200 pb-16 dark:border-white/5 md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            
            {/* ================= CONTENT SIDE ================= */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
                <SectionTitle
                  title="About Future Dev"
                  paragraph="Future Dev is an online course management platform designed for modern learning. Students can discover courses, enroll in seconds, and track progress in one place, while instructors manage everything through a clean dashboard."
                  mb="44px"
                />
              </div>

              <div className="mb-12 max-w-[570px] lg:mb-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <List text="Easy Course Search" delay="[animation-delay:200ms]" />
                    <List text="Instant Enrollment" delay="[animation-delay:300ms]" />
                    <List text="Secure JWT Auth" delay="[animation-delay:400ms]" />
                  </div>
                  <div>
                    <List text="Instructor Tools" delay="[animation-delay:250ms]" />
                    <List text="Admin Dashboard" delay="[animation-delay:350ms]" />
                    <List text="Modern SaaS UI" delay="[animation-delay:450ms]" />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= IMAGE SIDE ================= */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-square max-w-[500px] opacity-0 animate-[fadeInUp_.8s_ease-out_forwards] [animation-delay:300ms]">
                
                {/* Decorative Gradient Background behind image */}
                <div className="absolute inset-0 scale-90 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl animate-pulse"></div>

                <div className="relative h-full w-full animate-[float_8s_ease-in-out_infinite]">
                  <Image
                    src="/images/about/about-image.svg"
                    alt="Platform preview"
                    fill
                    className="object-contain drop-shadow-2xl dark:hidden"
                  />
                  <Image
                    src="/images/about/about-image-dark.svg"
                    alt="Platform preview"
                    fill
                    className="hidden object-contain drop-shadow-2xl dark:block"
                  />
                </div>
              </div>
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

export default AboutSectionOne;
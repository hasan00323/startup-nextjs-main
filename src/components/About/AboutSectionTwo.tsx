import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <>
      <section className="py-16 md:py-20 lg:py-28 opacity-0 animate-[aboutTwoSectionIn_.6s_ease-out_forwards]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="relative mx-auto mb-12 aspect-25/24 max-w-[500px] text-center lg:m-0 opacity-0 animate-[aboutTwoImageIn_.7s_ease-out_forwards] [animation-delay:120ms]"
                data-wow-delay=".15s"
              >
                <Image
                  src="/images/about/about-image-2.svg"
                  alt="Future Dev learning experience preview"
                  fill
                  className="drop-shadow-three dark:hidden dark:drop-shadow-none animate-[aboutTwoFloat_8s_ease-in-out_infinite]"
                />
                <Image
                  src="/images/about/about-image-2-dark.svg"
                  alt="Future Dev learning experience preview"
                  fill
                  className="hidden drop-shadow-three dark:block dark:drop-shadow-none animate-[aboutTwoFloat_8s_ease-in-out_infinite]"
                />
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="max-w-[470px]">
                <div className="mb-9 opacity-0 animate-[aboutTwoItemUp_.6s_ease-out_forwards] [animation-delay:200ms]">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Clear learning journey
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                    Future Dev organizes each course into a simple flow so students always know what to do next. 
                    Lessons are structured, progress is easy to follow, and everything stays in one place.
                  </p>
                </div>

                <div className="mb-9 opacity-0 animate-[aboutTwoItemUp_.6s_ease-out_forwards] [animation-delay:280ms]">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Organized student profiles
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                    Each student has a profile that keeps key details and enrollment history organized. 
                    This makes it easier to manage records, support students, and keep data consistent across the platform.
                  </p>
                </div>

                <div className="mb-1 opacity-0 animate-[aboutTwoItemUp_.6s_ease-out_forwards] [animation-delay:360ms]">
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                    Reliable access and privacy
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                    Accounts are protected with secure login and backend validation to ensure the right users access the right features.
                    Personal information is handled carefully, and sensitive actions remain restricted by permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes aboutTwoSectionIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutTwoImageIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aboutTwoItemUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutTwoFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
};

export default AboutSectionTwo;
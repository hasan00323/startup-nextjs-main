import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const List = ({ text }) => (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium opacity-0 animate-[aboutItemUp_.6s_ease-out_forwards]">
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md opacity-0 animate-[aboutIconPop_.55s_ease-out_forwards] [animation-delay:120ms]">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  return (
    <>
      <section
        id="about"
        className="pt-16 md:pt-20 lg:pt-28 opacity-0 animate-[aboutSectionIn_.6s_ease-out_forwards]"
      >
        <div className="container">
          <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2">
                <div className="opacity-0 animate-[aboutTextIn_.65s_ease-out_forwards] [animation-delay:120ms]">
                  <SectionTitle
                    title="About Future Dev"
                    paragraph="Future Dev is an online course management platform designed for modern learning. Students can discover courses, enroll in seconds, and track progress in one place, while instructors and admins manage courses, enrollments, and student records through a clean and secure dashboard."
                    mb="44px"
                  />
                </div>

                <div
                  className="mb-12 max-w-[570px] lg:mb-0 opacity-0 animate-[aboutTextIn_.65s_ease-out_forwards] [animation-delay:200ms]"
                  data-wow-delay=".15s"
                >
                  <div className="mx-[-12px] flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:260ms]">
                        <List text="Browse & search courses easly" />
                      </div>
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:320ms]">
                        <List text="Instant enrollment + progress tracking" />
                      </div>
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:380ms]">
                        <List text="Secure sign in with JWT authentication" />
                      </div>
                    </div>

                    <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:260ms]">
                        <List text="Instructor tools to create & manage courses" />
                      </div>
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:320ms]">
                        <List text="Enrollment management for admins" />
                      </div>
                      <div className="opacity-0 animate-[aboutColIn_.6s_ease-out_forwards] [animation-delay:380ms]">
                        <List text="Modern UI built Design" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-4 lg:w-1/2">
                <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0 opacity-0 animate-[aboutImageIn_.7s_ease-out_forwards] [animation-delay:200ms]">
                  <Image
                    src="/images/about/about-image.svg"
                    alt="Future Dev platform preview"
                    fill
                    className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0 animate-[aboutFloat_8s_ease-in-out_infinite]"
                  />
                  <Image
                    src="/images/about/about-image-dark.svg"
                    alt="Future Dev platform preview"
                    fill
                    className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0 animate-[aboutFloat_8s_ease-in-out_infinite]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes aboutSectionIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutTextIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutColIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutItemUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutIconPop {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes aboutImageIn {
          0% { opacity: 0; transform: translateY(14px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aboutFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
};

export default AboutSectionOne;
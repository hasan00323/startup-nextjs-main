import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg width="40" height="41" viewBox="0 0 40 41" className="fill-current">
        <path
          opacity="0.5"
          d="M37.7778 40.2223H24C22.8954 40.2223 22 39.3268 22 38.2223V20.0001C22 18.8955 22.8954 18.0001 24 18.0001H37.7778C38.8823 18.0001 39.7778 18.8955 39.7778 20.0001V38.2223C39.7778 39.3268 38.8823 40.2223 37.7778 40.2223Z"
        />
        <path d="M23.2222 0C22.6699 0 22.2222 0.447715 22.2222 1V12.3333C22.2222 12.8856 22.6699 13.3333 23.2222 13.3333H39C39.5523 13.3333 40 12.8856 40 12.3333V0.999999C40 0.447714 39.5523 0 39 0H23.2222ZM0 39C0 39.5523 0.447715 40 1 40H16.7778C17.3301 40 17.7778 39.5523 17.7778 39V27.6667C17.7778 27.1144 17.3301 26.6667 16.7778 26.6667H1C0.447716 26.6667 0 27.1144 0 27.6667V39ZM0 21.2222C0 21.7745 0.447715 22.2222 1 22.2222H16.7778C17.3301 22.2222 17.7778 21.7745 17.7778 21.2222V0.999999C17.7778 0.447714 17.3301 0 16.7778 0H1C0.447716 0 0 0.447715 0 1V21.2222Z" />
      </svg>
    ),
    title: "Course Management Dashboard",
    paragraph:
      "Create, edit, delete, and manage all courses from a single dashboard with a clean, organized, and user-friendly experience.",
  },
  {
    id: 2,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M20.5914 34.2584C20.2394 34.5172 19.7603 34.5175 19.408 34.2593L4.19163 23.1079C3.8395 22.8498 3.36065 22.85 3.00873 23.1084L1.09802 24.5111C0.553731 24.9107 0.553731 25.7237 1.09802 26.1233L19.4082 39.5655C19.7604 39.824 20.2396 39.824 20.5918 39.5655L38.9029 26.1226C39.4469 25.7232 39.4473 24.9107 38.9036 24.5109L36.9701 23.0889C36.6177 22.8298 36.1378 22.8297 35.7854 23.0888L20.5914 34.2584Z"
        />
        <path d="M19.408 28.931C19.7603 29.1896 20.2396 29.1894 20.5918 28.9306L36.3556 17.3466L38.8979 15.4883C39.4437 15.0894 39.4446 14.275 38.8996 13.8749L20.5918 0.43445C20.2396 0.175911 19.7604 0.175913 19.4082 0.434452L1.09706 13.8774C0.553051 14.2767 0.552712 15.0892 1.09638 15.4891L3.62222 17.3466L19.408 28.931Z" />
      </svg>
    ),
    title: "Secure Authentication (JWT)",
    paragraph:
      "Secure login using JWT, with tokens stored in the browser and automatically attached to protected requests such as Create, Update, and Delete.",
  },
  {
    id: 3,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"
        />
        <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z" />
      </svg>
    ),
    title: "Courses Catalog & Details",
    paragraph:
      "A well-structured courses catalog with detailed pages for each course, including title, description, price, dates, and category, with smooth navigation.",
  },
  {
    id: 4,
    icon: (
      <svg width="40" height="42" viewBox="0 0 40 42" className="fill-current">
        <path
          opacity="0.5"
          d="M28 3H12C10.8954 3 10 3.89543 10 5V8H30V5C30 3.89543 29.1046 3 28 3Z"
        />
        <path
          opacity="0.5"
          d="M8 10H32C34.2091 10 36 11.7909 36 14V35C36 37.2091 34.2091 39 32 39H8C5.79086 39 4 37.2091 4 35V14C4 11.7909 5.79086 10 8 10Z"
        />
        <path d="M12 18C12 17.4477 12.4477 17 13 17H27C27.5523 17 28 17.4477 28 18C28 18.5523 27.5523 19 27 19H13C12.4477 19 12 18.5523 12 18Z" />
        <path d="M12 26.5L17.2 31.7C17.5907 32.0907 18.2238 32.0907 18.6144 31.7L29.7 20.6144C30.0907 20.2238 30.0907 19.5907 29.7 19.2C29.3093 18.8093 28.6762 18.8093 28.2856 19.2L17.9072 29.5784L13.4144 25.0856C13.0238 24.6949 12.3907 24.6949 12 25.0856C11.6095 25.4762 11.6095 26.1093 12 26.5Z" />
      </svg>
    ),
    title: "Smart Validation & Dates Handling",
    paragraph:
      "Automatic validation for inputs such as price and dates, with proper handling of Start/End dates and conversion from datetime-local to ISO format before sending data to the backend.",
  },
  {
    id: 5,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M39 12C39.5523 12 40 12.4477 40 13V39C40 39.5523 39.5523 40 39 40H13C12.4477 40 12 39.5523 12 39V33C12 32.4477 12.4477 32 13 32H31C31.5523 32 32 31.5523 32 31V13C32 12.4477 32.4477 12 33 12H39Z"
        />
        <rect width="28" height="28" rx="1" />
      </svg>
    ),
    title: "Clean UI for Students & Admins",
    paragraph:
      "A modern and responsive user interface designed for both students and administrators, focusing on clarity, usability, and a smooth user experience.",
  },
  {
    id: 6,
    icon: (
      <svg width="40" height="45" viewBox="0 0 40 45" className="fill-current">
        <path
          opacity="0.5"
          d="M20 2L36 11V29C36 31.2091 34.2091 33 32 33H8C5.79086 33 4 31.2091 4 29V11L20 2Z"
        />
        <path d="M20 8L30 13.5V24.5L20 30L10 24.5V13.5L20 8ZM13 15.2V22.8L20 26.65L27 22.8V15.2L20 11.35L13 15.2Z" />
        <path d="M2 38C2 37.4477 2.44772 37 3 37H37C37.5523 37 38 37.4477 38 38C38 38.5523 37.5523 39 37 39H3C2.44772 39 2 38.5523 2 38Z" />
        <path d="M9 43C9 42.4477 9.44772 42 10 42H30C30.5523 42 31 42.4477 31 43C31 43.5523 30.5523 44 30 44H10C9.44772 44 9 43.5523 9 43Z" />
      </svg>
    ),
    title: "Modern Stack (Next.js + ASP.NET API)",
    paragraph:
      "Built using a modern tech stack with Next.js on the frontend and ASP.NET Core Web API on the backend, ensuring scalability, performance, and clean architecture.",
  },
];

export default featuresData;

import { Menu } from "@/types/menu";

export const getMenuData = (roleId: number | null, isAuthed: boolean): Menu[] => {
  if (!isAuthed) {
    return [
      { id: 1, title: "Courses", path: "/courses", newTab: false },
      { id: 2, title: "About Us", path: "/about", newTab: false },
      { id: 3, title: "Support", path: "/contact", newTab: false },
    ];
  }

  const isAdmin = roleId === 1; // ✅ 1 Admin
  const isStudent = roleId === 2; // ✅ 2 Student

  if (isAdmin) {
    return [
      {
        id: 10,
        title: "Courses",
        newTab: false,
        submenu: [
          { id: 101, title: "All Courses", path: "/courses", newTab: false },
          { id: 104, title: "Search", path: "/courses/search", newTab: false },
        ],
      },
      {
        id: 11,
        title: "Students",
        newTab: false,
        submenu: [{ id: 111, title: "All Students", path: "/students/getAllStudents", newTab: false }],
      },
      {
        id: 12,
        title: "Enrollments",
        newTab: false,
        submenu: [
          { id: 121, title: "All Enrollments", path: "/enrollments", newTab: false },
          { id: 122, title: "Create Enrollment", path: "/enrollments/create", newTab: false },
        ],
      },
    ];
  }

  if (isStudent) {
    return [
      {
        id: 20,
        title: "Courses",
        newTab: false,
        submenu: [
          { id: 201, title: "All Courses", path: "/courses", newTab: false },
          { id: 203, title: "Search", path: "/courses/search", newTab: false },
        ],
      },
      {
        id: 21,
        title: "Enrollments",
        newTab: false,
        submenu: [{ id: 211, title: "My Enrollments", path: "/enrollments/myEnrollments", newTab: false }],
      },
      { id: 22, title: "Support", path: "/contact", newTab: false },
    ];
  }

  // ✅ fallback لأي role ثاني
  return [
    { id: 30, title: "Courses", path: "/courses", newTab: false },
    { id: 31, title: "Support", path: "/contact", newTab: false },
  ];
};

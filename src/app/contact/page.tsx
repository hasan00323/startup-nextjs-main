import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page",
  description: "",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Us"
        description="Have questions about courses, enrollment, or your account? The Future Dev support team is here to help you with any issue or inquiry."
      />

      <Contact />
    </>
  );
};

export default ContactPage;

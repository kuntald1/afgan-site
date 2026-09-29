import ContactForm from "./ContactForm";
import GoogleMap from "./GoogleMap";

export default function ContactFormSection() {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          <ContactForm />
          <GoogleMap />
        </div>
      </div>
    </section>
  );
}

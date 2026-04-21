import Link from "next/link";
import Image from "next/image";
import logo from "@/app/logo.png";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-white px-8 py-16 w-full max-w-screen-2xl mx-auto min-h-[614px] flex flex-col justify-end">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24 items-start">
        <div data-g-step="true" className="md:col-span-6">
          <div className="mb-8">
            <Image
              src={logo}
              alt="BHEARD"
              height={56}
              width={56}
              className="w-auto h-14"
            />
          </div>
          <p className="font-body text-neutral-600 max-w-md text-lg">
            Bheard is a digital marketing agency helping businesses grow through
            branding, social media, and performance marketing.
          </p>
        </div>
        <div data-g-step="true" className="md:col-span-3">
          <h6 className="text-orange-500 font-bold uppercase text-sm mb-6">
            Network
          </h6>
          <ul className="flex flex-col gap-4">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="text-neutral-600 hover:text-neutral-900 transition-all font-headline uppercase text-xl"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-g-step="true" className="md:col-span-3">
          <h6 className="text-orange-500 font-bold uppercase text-sm mb-6">
            Contact
          </h6>
          <p className="text-neutral-900 font-headline text-2xl lowercase mb-2">
            hello@bheard.in
          </p>
          <p className="text-neutral-600">121 Kinetic Blvd, Future City</p>
        </div>
      </div>
      <div data-g-step="true" className="relative border-t border-outline-variant/10 pt-16 overflow-visible">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div className="text-neutral-600 text-sm tracking-widest font-bold uppercase">
            &copy; 2024 BHEARD. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <Link
              className="text-neutral-600 hover:text-neutral-900 transition-all text-sm uppercase font-bold tracking-widest"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="text-neutral-600 hover:text-neutral-900 transition-all text-sm uppercase font-bold tracking-widest"
              href="#"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import {
  FrazierPageShell,
  Prose,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function DentalImplantsBlogPage() {
  return (
    <FrazierPageShell
      title="Dental Implants: An Option to Replace Missing Teeth"
      subtitle="By Dr. Karla Frazier · July 9"
      accent
    >
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
        <Image
          src="/frazier-dentistry/homeandblog-dentalimplants.jpg"
          alt="Dental Implants"
          fill
          className="object-cover"
        />
      </div>
      <Prose>
        <p>
          Dental implants are a popular and effective long-term solution for
          people who suffer from missing teeth, failing teeth, or chronic dental
          problems. They fit, feel, and function like natural teeth — and with
          proper care, can last a lifetime.
        </p>
        <h3 style={{ color: FRAZIER_COLORS.brown, fontWeight: 700 }}>
          What Are Dental Implants?
        </h3>
        <p>
          A dental implant is a titanium post that is surgically positioned into
          the jawbone beneath the gum line, allowing your dentist to mount
          replacement teeth or a bridge into that area. Unlike dentures,
          implants don&apos;t come loose and can benefit general oral health
          because they do not need to be anchored to other teeth.
        </p>
        <h3 style={{ color: FRAZIER_COLORS.brown, fontWeight: 700 }}>
          Types of Implants
        </h3>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>Single tooth implants</strong> — replace individual missing
            teeth
          </li>
          <li>
            <strong>Anterior implants</strong> — restore front teeth aesthetics
          </li>
          <li>
            <strong>Posterior implants</strong> — restore chewing function in
            back teeth
          </li>
          <li>
            <strong>Full upper replacement</strong> — All-On-4 implant-supported
            dentures
          </li>
        </ul>
        <p>
          At Frazier Dentistry, Dr. Frazier is trained in the Hiossen Implant
          System and All-On-4 implant-supported fixed denture restoration.
          Schedule a consultation to see if dental implants are right for you.
        </p>
      </Prose>
    </FrazierPageShell>
  );
}

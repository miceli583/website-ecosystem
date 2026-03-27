"use client";

import Image from "next/image";
import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function MeetDrFrazierPage() {
  return (
    <FrazierPageShell title="Meet Dr. Frazier" accent>
      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
        <div
          className="relative h-56 w-56 shrink-0 overflow-hidden rounded-xl border-2"
          style={{ borderColor: FRAZIER_COLORS.beige }}
        >
          <Image
            src="/frazier-dentistry/meet-dr-frazier.jpg"
            alt="Dr. Karla Frazier"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2
            className="mb-1 text-2xl font-bold"
            style={{ color: FRAZIER_COLORS.brown }}
          >
            Dr. Karla Frazier, D.M.D.
          </h2>
          <p className="mb-3 text-sm" style={{ color: FRAZIER_COLORS.copper }}>
            Founder &amp; Lead Dentist
          </p>
          <Prose>
            <p>
              Dr. Karla Frazier grew up in Jackson, Mississippi and earned her
              B.S. in Biology from Jackson State University in 1992. She went on
              to receive her Dental Medicine Doctorate from the University of
              Pennsylvania School of Dental Medicine in 1996.
            </p>
          </Prose>
        </div>
      </div>

      <Prose>
        <p>
          After dental school, Dr. Frazier served as a Captain in the United
          States Air Force, practicing dentistry at Beale Air Force Base in
          California. She moved to Austin in 1999, entered private practice as
          an associate, and since 2001 has been the sole practitioner in her own
          dental practice.
        </p>
      </Prose>

      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Advanced Training">
          <ul className="list-inside list-disc space-y-1">
            <li>Hiossen Implant System</li>
            <li>CEREC CAD-CAM Technology</li>
            <li>Er, Cr: YSGG Laser (Biolase Waterlase &amp; Epic Diode)</li>
            <li>Invisalign Orthodontic Therapy</li>
            <li>Zoom! Whitening</li>
            <li>All-On-4 Implant Supported Dentures</li>
            <li>Nitrous Oxide Administration</li>
          </ul>
        </SectionCard>

        <SectionCard title="Professional Memberships">
          <ul className="list-inside list-disc space-y-1">
            <li>American Dental Association</li>
            <li>Texas Dental Association</li>
            <li>Capital Area Dental Society</li>
            <li>World Clinical Laser Institute</li>
          </ul>
        </SectionCard>
      </div>

      <div className="my-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Community Involvement">
          <p>
            Dr. Frazier has served as an Investigator for the State of Texas
            Investigator General&apos;s Office for Dental Medicaid fraud. She
            co-founded The Professional Institute of Dental Assisting and was
            the former official dentist of the NBA D-League Austin Toros (now
            Austin Spurs) and Connally High School Athletics Department.
          </p>
          <p className="mt-2">
            She regularly speaks to children in schools about the dental
            profession and mentors high school students, UT pre-dental students,
            and young professionals.
          </p>
        </SectionCard>

        <SectionCard title="Personal">
          <p>
            Outside the office, Dr. Frazier enjoys traveling, music, helping
            others, and spending time with family and friends. She believes in
            living a fun, low-stress life.
          </p>
        </SectionCard>
      </div>

      {/* Philosophy Quote */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: FRAZIER_COLORS.cream,
          borderLeft: `4px solid ${FRAZIER_COLORS.copper}`,
        }}
      >
        <p
          className="leading-relaxed italic"
          style={{ color: FRAZIER_COLORS.brown }}
        >
          &ldquo;When patients become a part of our dental family our goal is to
          treat them as if they were friends and family, offering the same
          treatment options that we would want for ourselves. We want our
          patients to be able to get the best treatment available to them, and
          we want to do what is right for them. We want to help them get their
          life smile.&rdquo;
        </p>
        <p
          className="mt-3 text-sm font-medium"
          style={{ color: FRAZIER_COLORS.copper }}
        >
          — Dr. Karla Frazier
        </p>
      </div>
    </FrazierPageShell>
  );
}

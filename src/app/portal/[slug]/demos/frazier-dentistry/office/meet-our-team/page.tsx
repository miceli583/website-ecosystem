"use client";

import Image from "next/image";
import {
  FrazierPageShell,
  Prose,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const team = [
  {
    name: "Dr. Karla Frazier",
    role: "Dentist",
    img: "/frazier-dentistry/meet-our-team-drfrazier.jpg",
  },
  {
    name: "Letitia Wilkins",
    role: "Office Manager",
    img: "/frazier-dentistry/meet-our-team-letitia-wilkins.jpg",
  },
  {
    name: "Juli Martinez",
    role: "Financial Coordinator",
    img: "/frazier-dentistry/meet-our-team-juli-martinez.jpg",
  },
  {
    name: "Cindy Reyes",
    role: "Dental Assistant",
    img: "/frazier-dentistry/meet-our-team-cindy-reyes.jpg",
  },
  {
    name: "Carissa Felix",
    role: "Dental Assistant",
    img: "/frazier-dentistry/meet-our-team-carissa-felix.jpg",
  },
  {
    name: "Katie Schulte",
    role: "Hygienist",
    img: "/frazier-dentistry/meet-our-team-katie-schulte.jpg",
  },
];

export default function MeetOurTeamPage() {
  return (
    <FrazierPageShell
      title="Meet Our Team"
      subtitle="Friendly, skilled professionals dedicated to your comfort and care"
      accent
    >
      <Prose>
        <p>
          We know that our office is only as effective and as welcoming as the
          people who work in it, which is why we take pride in our friendly and
          well-trained team members! We put your needs first to achieve
          efficient and comprehensive treatment in a supportive and nurturing
          environment.
        </p>
        <p>
          Our staff is uniquely trained and highly skilled, with specialized
          training and certifications, and years of experience. They regularly
          attend clinical continuing education courses in lasers, implants,
          CEREC, infection control, and OSHA, as well as administrative courses
          in HIPAA, insurance, and billing.
        </p>
      </Prose>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {team.map((member) => (
          <div key={member.name} className="text-center">
            <div
              className="relative mx-auto mb-3 h-40 w-40 overflow-hidden rounded-full border-2"
              style={{ borderColor: FRAZIER_COLORS.beige }}
            >
              <Image
                src={member.img}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
              {member.name}
            </h3>
            <p className="text-sm" style={{ color: FRAZIER_COLORS.copper }}>
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </FrazierPageShell>
  );
}

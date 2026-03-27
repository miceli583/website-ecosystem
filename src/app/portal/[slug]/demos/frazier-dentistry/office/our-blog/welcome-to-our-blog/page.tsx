"use client";

import Image from "next/image";
import {
  FrazierPageShell,
  Prose,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function WelcomeBlogPage() {
  return (
    <FrazierPageShell
      title="Why Moisturize Your Lips?"
      subtitle="By Dr. Karla Frazier · July 31"
      accent
    >
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
        <Image
          src="/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg"
          alt="Why Moisturize"
          fill
          className="object-cover"
        />
      </div>
      <Prose>
        <p>
          Welcome to the Frazier Dentistry blog! We&apos;re excited to share
          tips, insights, and news to help you maintain a healthy, beautiful
          smile.
        </p>
        <p>
          Keeping your lips moisturized is more important than you might think.
          Your lips are one of the most sensitive parts of your body, with thin
          skin that&apos;s more prone to drying out. Dry, cracked lips can lead
          to discomfort, bleeding, and even infection if not properly cared for.
        </p>
        <h3 style={{ color: FRAZIER_COLORS.brown, fontWeight: 700 }}>
          Tips for Healthy Lips
        </h3>
        <ul className="list-inside list-disc space-y-1">
          <li>Use a lip balm with SPF protection, especially in summer</li>
          <li>Stay hydrated — drink plenty of water throughout the day</li>
          <li>Avoid licking your lips, which actually makes them drier</li>
          <li>Use a humidifier in dry weather</li>
          <li>Choose lip products without harsh chemicals or fragrances</li>
        </ul>
        <p>
          If you experience persistent dry or cracked lips, it could be a sign
          of an underlying dental or health issue. Don&apos;t hesitate to bring
          it up at your next appointment!
        </p>
      </Prose>
    </FrazierPageShell>
  );
}

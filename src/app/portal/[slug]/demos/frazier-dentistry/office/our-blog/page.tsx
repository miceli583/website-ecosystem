"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const posts = [
  {
    slug: "welcome-to-our-blog",
    img: "/frazier-dentistry/hom-and-blog-welcometoourblog-whymoisturize.jpg",
    title: "Why Moisturize Your Lips?",
    date: "July 31",
    author: "Dr. Karla Frazier",
    excerpt:
      "Keeping your lips moisturized is more important than you might think. Dry, cracked lips can lead to discomfort and even infection...",
  },
  {
    slug: "dental-implants",
    img: "/frazier-dentistry/homeandblog-dentalimplants.jpg",
    title: "Dental Implants: An Option to Replace Missing Teeth",
    date: "July 9",
    author: "Dr. Karla Frazier",
    excerpt:
      "Dental implants are a popular and effective way to replace missing teeth. They look, feel, and function like natural teeth...",
  },
];

export default function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry/office/our-blog`;

  return (
    <FrazierPageShell
      title="Our Blog"
      subtitle="Tips, news, and insights from Frazier Dentistry"
      accent
    >
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`${base}/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md sm:flex-row"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <div className="relative h-48 shrink-0 sm:h-auto sm:w-56">
              <Image
                src={post.img}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-5">
              <p
                className="mb-1 text-xs"
                style={{ color: FRAZIER_COLORS.copper }}
              >
                {post.date} · {post.author}
              </p>
              <h3
                className="mb-2 text-lg font-bold"
                style={{ color: FRAZIER_COLORS.brown }}
              >
                {post.title}
              </h3>
              <p className="text-sm" style={{ color: "#5a5550" }}>
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </FrazierPageShell>
  );
}

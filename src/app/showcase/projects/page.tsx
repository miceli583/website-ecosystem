"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectKanban } from "~/components/projects/project-kanban";
import { SAMPLE_PROJECTS } from "~/components/showcase/sample-data";
import type { ProjectWithMeta } from "~/components/projects/types";

export default function ShowcaseProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithMeta[]>(SAMPLE_PROJECTS);

  const handleProjectMove = useCallback((id: number, newStatus: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: newStatus, updatedAt: new Date() } : p
      )
    );
  }, []);

  const handleViewDetail = useCallback(
    (id: number) => {
      router.push(`/showcase/projects/${id}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <Link
        href="/showcase#demos"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>

      <div className="mt-14">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Project Management
        </h1>
        <div className="overflow-x-auto">
          <ProjectKanban
            projects={projects}
            mode="admin"
            onMoveStatus={handleProjectMove}
            onViewDetail={handleViewDetail}
          />
        </div>
      </div>
    </div>
  );
}

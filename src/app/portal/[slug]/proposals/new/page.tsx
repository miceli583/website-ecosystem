"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProposalBuilder } from "~/components/portal/proposal-builder";

export default function NewProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/portal/${slug}/proposals`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>
      </div>

      <ProposalBuilder
        slug={slug}
        editProposalId={editId ? parseInt(editId) : undefined}
        onSaved={(id) => router.push(`/portal/${slug}/proposals/${id}`)}
      />
    </>
  );
}

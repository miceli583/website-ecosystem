"use client";

import { use } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type ClientAgreement = ClientBySlug["agreements"][number];
type UpdateWithProject = ClientUpdate & { projectName: string };
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { FileText, Loader2, AlertCircle } from "lucide-react";

export default function PortalProposalsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Portal not found
      </div>
    );
  }

  // Combine proposal-type updates and agreements
  const proposals = client.projects
    .flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "proposal")
        .map((u: ClientUpdate) => ({ ...u, projectName: p.name }))
    )
    .sort(
      (a: UpdateWithProject, b: UpdateWithProject) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Proposals & Agreements</h1>
      <p className="mb-8 text-gray-400">
        Project proposals, scope documents, and agreements.
      </p>

      {/* Agreements */}
      {client.agreements.length > 0 && (
        <>
          <h2 className="mb-4 text-xl font-semibold">Agreements</h2>
          <div className="mb-10 space-y-3">
            {client.agreements.map((agreement: ClientAgreement) => (
              <Card
                key={agreement.id}
                className="bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-semibold">{agreement.title}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(agreement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      agreement.status === "signed"
                        ? "bg-green-900/50 text-green-400"
                        : agreement.status === "sent"
                          ? "bg-yellow-900/50 text-yellow-400"
                          : "bg-gray-800 text-gray-400"
                    }
                  >
                    {agreement.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Proposals */}
      <h2 className="mb-4 text-xl font-semibold">Proposals</h2>
      {proposals.length === 0 && client.agreements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No proposals yet.</p>
        </div>
      ) : proposals.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No proposal documents yet.
        </p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal: UpdateWithProject) => (
            <Card
              key={proposal.id}
              className="bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <CardContent className="p-6">
                <h3 className="mb-1 text-lg font-semibold">{proposal.title}</h3>
                <p className="mb-3 text-sm text-gray-400">
                  {proposal.projectName} &middot;{" "}
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
                <div
                  className="prose prose-invert prose-sm max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: proposal.content }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ClientPortalLayout>
  );
}

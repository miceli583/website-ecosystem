"use client";

import { use } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["clients"]["getBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type UpdateWithProject = ClientUpdate & { projectName: string };
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { DollarSign } from "lucide-react";

export default function ClientBillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading } = api.clients.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
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

  // Get invoice-type updates
  const invoices = client.projects
    .flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "invoice")
        .map((u: ClientUpdate) => ({ ...u, projectName: p.name }))
    )
    .sort(
      (a: UpdateWithProject, b: UpdateWithProject) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Billing</h1>
      <p className="mb-8 text-gray-400">
        Invoices and payment history.
      </p>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No invoices yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Stripe payment integration coming soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice: UpdateWithProject) => (
            <Card
              key={invoice.id}
              className="bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <CardContent className="p-5">
                <h3 className="font-semibold">{invoice.title}</h3>
                <p className="text-sm text-gray-400">
                  {invoice.projectName} &middot;{" "}
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
                <div
                  className="prose prose-invert prose-sm mt-3 max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: invoice.content }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ClientPortalLayout>
  );
}

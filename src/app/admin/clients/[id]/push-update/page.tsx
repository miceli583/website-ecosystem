"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientDetail = NonNullable<RouterOutputs["clients"]["getById"]>;
type ClientProject = ClientDetail["projects"][number];
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";

export default function PushUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const clientId = Number(id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("projectId");

  const { data: client } = api.clients.getById.useQuery({ id: clientId });
  const pushUpdate = api.clients.pushUpdate.useMutation({
    onSuccess: () => {
      router.push(`/admin/clients/${clientId}`);
    },
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"demo" | "proposal" | "update" | "invoice">(
    "update"
  );
  const [projectId, setProjectId] = useState(
    projectIdParam ? Number(projectIdParam) : 0
  );

  const handleSubmit = () => {
    if (!title || !content || !projectId) return;
    pushUpdate.mutate({ projectId, title, content, type });
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/admin/clients/${clientId}`}
          className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {client?.name ?? "Client"}
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Push Update</h1>

        <Card
          className="bg-white/5 backdrop-blur-md"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <CardContent className="space-y-4 p-6">
            {/* Project selector */}
            {client?.projects && (
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                  className="w-full rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                >
                  <option value={0}>Select a project</option>
                  {client.projects.map((p: ClientProject) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Type selector */}
            <div>
              <label className="mb-1 block text-sm text-gray-400">Type</label>
              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as "demo" | "proposal" | "update" | "invoice"
                  )
                }
                className="w-full rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
              >
                <option value="update">Update</option>
                <option value="demo">Demo</option>
                <option value="proposal">Proposal</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm text-gray-400">Title</label>
              <input
                type="text"
                placeholder="Update title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Content
              </label>
              <textarea
                placeholder="Update content (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                rows={8}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!title || !content || !projectId || pushUpdate.isPending}
              className="w-full"
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                color: "black",
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              {pushUpdate.isPending ? "Pushing..." : "Push Update"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

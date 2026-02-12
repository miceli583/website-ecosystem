"use client";

import { use, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientDetail = NonNullable<RouterOutputs["clients"]["getBySlugAdmin"]>;
type ClientProject = ClientDetail["projects"][number];
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "~/components/portal/rich-text-editor";

export default function PushUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get("projectId");

  const { data: client } = api.clients.getBySlugAdmin.useQuery({ slug });
  const pushUpdate = api.clients.pushUpdate.useMutation({
    onSuccess: () => {
      router.push(`/admin/clients/${slug}`);
    },
  });

  const [title, setTitle] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [type, setType] = useState<"demo" | "proposal" | "update" | "invoice">(
    "update"
  );
  const [projectId, setProjectId] = useState(
    projectIdParam ? Number(projectIdParam) : 0
  );
  const editorRef = useRef<RichTextEditorRef>(null);

  const handleSubmit = () => {
    const content = editorRef.current?.getHTML() ?? "";
    if (!title || !content || !projectId) return;
    pushUpdate.mutate({ projectId, title, content, type });
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/admin/clients/${slug}`}
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

            {/* Content - Rich Text */}
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Content
              </label>
              <div
                className="rounded-lg border"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  backgroundColor: "rgba(10, 10, 10, 0.95)",
                }}
              >
                <RichTextEditor
                  ref={editorRef}
                  placeholder="Write your update..."
                  minHeight="180px"
                  onChange={(html) => {
                    // Check if content has meaningful text (not just empty tags)
                    const stripped = html.replace(/<[^>]*>/g, "").trim();
                    setHasContent(stripped.length > 0);
                  }}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!title || !hasContent || !projectId || pushUpdate.isPending}
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

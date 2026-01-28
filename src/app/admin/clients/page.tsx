"use client";

import { useState } from "react";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientListItem = RouterOutputs["clients"]["list"][number];
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Plus, Users, Building2 } from "lucide-react";

export default function AdminClientsPage() {
  const { data: clients, isLoading, refetch } = api.clients.list.useQuery();
  const createClient = api.clients.create.useMutation({
    onSuccess: () => void refetch(),
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("");
  const [company, setCompany] = useState("");

  const handleCreate = () => {
    if (!name || !email || !slug) return;
    createClient.mutate({
      name,
      email,
      slug,
      company: company || undefined,
    });
    setShowForm(false);
    setName("");
    setEmail("");
    setSlug("");
    setCompany("");
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-gray-400">Manage your client relationships</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              color: "black",
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <Card
            className="mb-8 bg-white/5 backdrop-blur-md"
            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
          >
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">New Client</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="URL Slug (e.g. acme-corp)"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                    )
                  }
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleCreate}
                  disabled={!name || !email || !slug || createClient.isPending}
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    color: "black",
                  }}
                >
                  {createClient.isPending ? "Creating..." : "Create Client"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Client list */}
        {isLoading && <p className="text-gray-400">Loading clients...</p>}

        {clients && clients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No clients yet. Create your first one above.</p>
          </div>
        )}

        <div className="grid gap-4">
          {clients?.map((client: ClientListItem) => (
            <Link key={client.id} href={`/admin/clients/${client.id}`}>
              <Card
                className="bg-white/5 backdrop-blur-md transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {client.name}
                      </h3>
                      <Badge
                        variant={
                          client.status === "active" ? "default" : "secondary"
                        }
                        className={
                          client.status === "active"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-800 text-gray-400"
                        }
                      >
                        {client.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{client.email}</p>
                    {client.company && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Building2 className="h-3 w-3" />
                        {client.company}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {client.projects.length} project
                    {client.projects.length !== 1 ? "s" : ""}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import { api } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { User, Loader2, AlertCircle, Mail, Building, Calendar } from "lucide-react";

export default function PortalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery({ slug });
  const { data: profile } = api.portal.getMyProfile.useQuery();

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

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Profile</h1>
      <p className="mb-8 text-gray-400">
        Your account information and settings.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <Card
          className="bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <User className="h-6 w-6" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Account</h2>
                <p className="text-sm text-gray-400">Your portal account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Name
                </label>
                <p className="text-white">{profile?.name ?? client.name}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <p className="flex items-center gap-2 text-white">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {profile?.email ?? client.email}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Role
                </label>
                <p className="text-white capitalize">{profile?.role ?? "client"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card
          className="bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <Building className="h-6 w-6" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Organization</h2>
                <p className="text-sm text-gray-400">Your company information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Company
                </label>
                <p className="text-white">{client.company ?? "—"}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Client ID
                </label>
                <p className="font-mono text-sm text-gray-400">{slug}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Member Since
                </label>
                <p className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {new Date(client.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientPortalLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, type RouterOutputs } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { ClientCardSkeletonGrid } from "~/components/portal";
import { Search, Users, LogOut, Loader2 } from "lucide-react";
import { createClient } from "~/lib/supabase/client";

type ClientListItem = RouterOutputs["portal"]["listClients"][number];

export default function PortalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const utils = api.useUtils();

  // Get current user's portal profile - always fresh
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = api.portal.getMyProfile.useQuery(undefined, { staleTime: 0 });

  // Get client list for admins
  const { data: clients, isLoading: clientsLoading } =
    api.portal.listClients.useQuery(undefined, {
      enabled: profile?.role === "admin",
    });

  // Redirect logic for clients
  useEffect(() => {
    if (!profileLoading && profile) {
      if (profile.role === "client" && profile.clientSlug) {
        // Client users redirect to their own portal
        router.push(`/portal/${profile.clientSlug}?domain=live`);
      }
    }
  }, [profile, profileLoading, router]);

  const handleSignOut = async () => {
    // Invalidate all cached data before signing out
    await utils.invalidate();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/?domain=live");
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  // No profile found - user might not have a portal account
  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="mb-6 text-gray-400">
          You don&apos;t have a portal account. Please contact your account
          manager.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm transition-colors hover:underline"
          style={{ color: "#D4AF37" }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  // Client role - show loading while redirecting
  if (profile.role === "client") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  // Filter clients based on search
  const filteredClients = clients?.filter(
    (client: ClientListItem) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Admin view - client list
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/brand/miracle-mind-orbit-star-v3.svg"
                alt="Miracle Mind"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Admin Portal</p>
              <p className="text-sm font-semibold">{profile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Admin Hub
            </Link>
            <Link
              href="/portal/profile?domain=live"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="mt-1 text-gray-400">
              Manage and view client portals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-gray-400">
              {clients?.length ?? 0} client{clients?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by name, email, company, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-800 bg-white/5 pl-10 text-white placeholder-gray-500"
          />
        </div>

        {/* Client list */}
        {clientsLoading ? (
          <ClientCardSkeletonGrid count={6} />
        ) : filteredClients?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {searchQuery ? "No clients match your search" : "No clients yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients?.map((client: ClientListItem) => (
              <Link
                key={client.id}
                href={`/portal/${client.slug}?domain=live`}
              >
                <Card
                  className="cursor-pointer bg-white/5 transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {client.name}
                        </h3>
                        {client.company && (
                          <p className="text-sm text-gray-400">
                            {client.company}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={
                          client.status === "active"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-800 text-gray-400"
                        }
                      >
                        {client.status}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">{client.email}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>/{client.slug}</span>
                      <span>
                        {client.projects.length} project
                        {client.projects.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

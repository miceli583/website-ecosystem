"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, type RouterOutputs } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import {
  Search,
  Users,
  LogOut,
  Loader2,
  UserCheck,
  Code2,
  ChevronDown,
  FolderKanban,
} from "lucide-react";
import { createClient } from "~/lib/supabase/client";
import { getPortalLoginUrl } from "~/lib/domains";

type ClientListItem = RouterOutputs["portal"]["listClients"][number];

export default function PortalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "newest" | "oldest" | "active" | "inactive"
  >("name");

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

  // Redirect logic
  useEffect(() => {
    if (!profileLoading && profile) {
      if (profile.role === "client" && profile.clientSlug) {
        // Client users redirect to their own portal
        router.push(`/portal/${profile.clientSlug}?domain=live`);
      } else if (profile.role === "admin") {
        // Team members redirect to admin clients page
        router.push("/admin/clients");
      }
    }
  }, [profile, profileLoading, router]);

  const handleSignOut = async () => {
    // Invalidate all cached data before signing out
    await utils.invalidate();
    const supabase = createClient();
    await supabase.auth.signOut();
    const url = getPortalLoginUrl();
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
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
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  // Filter + sort clients
  const filteredClients = clients
    ?.filter((client: ClientListItem) => {
      if (statusFilter !== "all" && client.status !== statusFilter)
        return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        client.company?.toLowerCase().includes(q) ||
        client.slug.toLowerCase().includes(q)
      );
    })
    .sort((a: ClientListItem, b: ClientListItem) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "active") return a.status === "active" ? -1 : 1;
      if (sortBy === "inactive") return a.status === "inactive" ? -1 : 1;
      return 0;
    });

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-sm text-gray-400">
            Manage and view client portals
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div
            className="relative flex-1"
            style={{ minWidth: "200px", maxWidth: "320px" }}
          >
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-white/5 py-2 pr-3 pl-10 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <option value="name">Name</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="active">Active First</option>
              <option value="inactive">Inactive First</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          <span className="text-sm text-gray-500">
            {filteredClients?.length ?? 0} client
            {(filteredClients?.length ?? 0) !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Client List */}
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {clientsLoading ? (
            <div
              className="divide-y"
              style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : !filteredClients?.length ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="mb-3 h-12 w-12 text-gray-600" />
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "No clients match your filters"
                  : "No clients yet"}
              </p>
            </div>
          ) : (
            <div
              className="divide-y"
              style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
            >
              {filteredClients.map((client: ClientListItem) => (
                <Link
                  key={client.id}
                  href={`/portal/${client.slug}?domain=live`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                >
                  {/* Name + company + email */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white transition-colors hover:text-[#D4AF37]">
                      {client.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {client.company && <span>{client.company}</span>}
                      <span>{client.email}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className="hidden flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline-flex"
                    style={{
                      backgroundColor:
                        client.status === "active"
                          ? "rgba(74, 222, 128, 0.1)"
                          : "rgba(156, 163, 175, 0.1)",
                      color: client.status === "active" ? "#4ade80" : "#9ca3af",
                    }}
                  >
                    {client.status === "active" ? "Active" : "Inactive"}
                  </span>

                  {/* Projects count */}
                  <span className="hidden flex-shrink-0 items-center gap-1 text-xs text-gray-500 md:inline-flex">
                    <FolderKanban className="h-3 w-3" />
                    {client.projects.length}
                  </span>

                  {/* Account Manager */}
                  {(
                    client as ClientListItem & {
                      accountManager?: { name: string } | null;
                    }
                  ).accountManager && (
                    <span
                      className="hidden flex-shrink-0 items-center gap-1 text-xs text-gray-500 lg:inline-flex"
                      style={{ minWidth: "120px" }}
                    >
                      <UserCheck
                        className="h-3 w-3 flex-shrink-0"
                        style={{ color: "#D4AF37" }}
                      />
                      <span className="truncate">
                        {
                          (
                            client as ClientListItem & {
                              accountManager: { name: string };
                            }
                          ).accountManager.name
                        }
                      </span>
                    </span>
                  )}

                  {/* Developer */}
                  {(
                    client as ClientListItem & {
                      assignedDeveloper?: { name: string } | null;
                    }
                  ).assignedDeveloper && (
                    <span
                      className="hidden flex-shrink-0 items-center gap-1 text-xs text-gray-500 xl:inline-flex"
                      style={{ minWidth: "120px" }}
                    >
                      <Code2 className="h-3 w-3 flex-shrink-0 text-blue-400" />
                      <span className="truncate">
                        {
                          (
                            client as ClientListItem & {
                              assignedDeveloper: { name: string };
                            }
                          ).assignedDeveloper.name
                        }
                      </span>
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

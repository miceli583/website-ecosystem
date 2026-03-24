"use client";

import { useState, useSyncExternalStore } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Shield,
  Save,
  FileText,
  Wallet,
  Eye,
  KeyRound,
} from "lucide-react";
import { api } from "~/trpc/react";
import { COMPANY_ROLES, type CompanyRole } from "~/lib/permissions";
import { createClient } from "~/lib/supabase/client";
import {
  setRoleOverride,
  getRoleOverride,
  subscribeRoleOverride,
} from "~/lib/role-override";

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

const ROLE_LABELS: Record<string, string> = {
  founder: "Founder",
  admin: "Admin",
  developer: "Developer",
  account_manager: "Account Manager",
};

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    founder: "bg-[#D4AF37]/20 text-[#D4AF37]",
    admin: "bg-white/10 text-white",
    developer: "bg-blue-500/20 text-blue-400",
    account_manager: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[role] ?? "bg-white/10 text-gray-400"}`}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

export default function AdminProfilePage() {
  const utils = api.useUtils();
  const { data: profile, isLoading } = api.portal.getMyProfile.useQuery();
  const { data: myRoles } = api.portal.getMyRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const roleOverride = useSyncExternalStore(
    subscribeRoleOverride,
    getRoleOverride,
    () => null
  );
  const [resetPasswordStatus, setResetPasswordStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const updateProfile = api.portal.updateMyProfile.useMutation({
    onSuccess: () => {
      void utils.portal.getMyProfile.invalidate();
      setIsEditing(false);
    },
  });

  const companyRoles = (profile?.companyRoles ?? []) as string[];
  const isFounder = companyRoles.includes("founder");

  async function handleResetPassword() {
    if (!profile?.email) return;
    setResetPasswordStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile.email,
        { redirectTo: `${window.location.origin}/portal/set-password` }
      );
      if (error) {
        setResetPasswordStatus("error");
      } else {
        setResetPasswordStatus("sent");
      }
    } catch {
      setResetPasswordStatus("error");
    }
  }

  function startEditing() {
    setEditName(profile?.name ?? "");
    setEditPhone(profile?.phone ?? "");
    setIsEditing(true);
  }

  function saveProfile() {
    updateProfile.mutate({
      name: editName,
      phone: editPhone || undefined,
    });
  }

  function setViewAsRole(role: string | null) {
    setRoleOverride(role);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="h-64 rounded-lg bg-white/5" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-gray-400">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <UserCircle className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{profile.name}</h1>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="rounded-lg border px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Info Card */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <h2 className="mb-4 text-sm font-medium tracking-wider text-gray-500 uppercase">
          Profile Information
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={inputClass}
                style={borderStyle}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                Phone
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className={inputClass}
                style={borderStyle}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={updateProfile.isPending}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                <Save className="h-4 w-4" />
                {updateProfile.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
                style={borderStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-white">
                  {profile.phone || "Not set"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Card */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-[#D4AF37]" />
          <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Security
          </h2>
        </div>
        <div className="mt-4">
          <p className="mb-3 text-xs text-gray-500">
            Send a password reset link to your email address.
          </p>
          <button
            onClick={handleResetPassword}
            disabled={resetPasswordStatus === "sending"}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            style={borderStyle}
          >
            <KeyRound className="h-3.5 w-3.5" />
            {resetPasswordStatus === "sending"
              ? "Sending..."
              : "Reset Password"}
          </button>
          {resetPasswordStatus === "sent" && (
            <p className="mt-2 text-xs text-green-400">
              Password reset email sent to {profile.email}. Check your inbox.
            </p>
          )}
          {resetPasswordStatus === "error" && (
            <p className="mt-2 text-xs text-red-400">
              Failed to send reset email. Please try again.
            </p>
          )}
        </div>
      </div>

      {/* Roles Card */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#D4AF37]" />
          <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Roles & Permissions
          </h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {companyRoles.length > 0 ? (
            companyRoles.map((role) => <RoleBadge key={role} role={role} />)
          ) : (
            <p className="text-sm text-gray-500">No roles assigned</p>
          )}
        </div>
        <p className="mt-3 text-xs text-gray-600">
          Roles determine which admin sections you can access. Contact a Founder
          or Admin to change your roles.
        </p>
      </div>

      {/* Founder: Role Switcher */}
      {isFounder && (
        <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
              View As Role (Founder Only)
            </h2>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Preview the admin experience as a different role. This only affects
            your view — no data is changed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setViewAsRole(null)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                !roleOverride
                  ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
              style={roleOverride ? borderStyle : undefined}
            >
              Founder (Default)
            </button>
            {COMPANY_ROLES.filter((r) => r !== "founder").map((role) => (
              <button
                key={role}
                onClick={() => setViewAsRole(role)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  roleOverride === role
                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "text-gray-400 hover:text-white"
                }`}
                style={roleOverride !== role ? borderStyle : undefined}
              >
                {ROLE_LABELS[role] ?? role}
              </button>
            ))}
          </div>
          {roleOverride && (
            <p className="mt-3 text-xs text-amber-400">
              Viewing as: {ROLE_LABELS[roleOverride] ?? roleOverride}.
              Navigation is filtered to this role&apos;s permissions.
            </p>
          )}
        </div>
      )}

      {/* Documents Placeholder */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Documents
          </h2>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Contracts and agreements will appear here.
        </p>
      </div>

      {/* Bank Balance Placeholder */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Bank Balance
          </h2>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Direct deposit and payout information will appear here.
        </p>
      </div>
    </div>
  );
}

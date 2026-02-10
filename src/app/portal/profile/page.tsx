"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ProfilePageSkeleton } from "~/components/portal";
import {
  User,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Shield,
  Pencil,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ArrowLeft,
  Building2,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  founder: "Founder",
  admin: "Admin",
  account_manager: "Account Manager",
  project_manager: "Project Manager",
  developer: "Developer",
  designer: "Designer",
};

export default function AdminProfilePage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: profile, isLoading, error } = api.portal.getMyProfile.useQuery(
    undefined,
    { staleTime: 0 } // Always fetch fresh profile data
  );

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  // Edit phone state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState("");

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updateProfile = api.portal.updateMyProfile.useMutation({
    onSuccess: () => {
      void utils.portal.getMyProfile.invalidate();
      setIsEditingName(false);
      setIsEditingPhone(false);
    },
  });

  const handleStartEditName = () => {
    setEditName(profile?.name ?? "");
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile.mutate({ name: editName.trim() });
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditName("");
  };

  const handleStartEditPhone = () => {
    setEditPhone(profile?.phone ?? "");
    setIsEditingPhone(true);
  };

  const handleSavePhone = () => {
    updateProfile.mutate({ phone: editPhone.trim() || undefined });
  };

  const handleCancelEditPhone = () => {
    setIsEditingPhone(false);
    setEditPhone("");
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch {
      setPasswordError("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    // Invalidate all cached data before signing out
    await utils.invalidate();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/?domain=live");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header skeleton */}
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
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        </header>
        {/* Content skeleton */}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mb-2 h-8 w-40 animate-pulse rounded bg-white/10" />
          <div className="mb-8 h-4 w-52 animate-pulse rounded bg-white/10" />
          <ProfilePageSkeleton />
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error?.message ?? "Profile not found"}</p>
      </div>
    );
  }

  // Redirect non-admins to their client portal
  if (profile.role !== "admin") {
    if (profile.clientSlug) {
      router.push(`/portal/${profile.clientSlug}/profile?domain=live`);
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

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
              href="/portal?domain=live"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Clients
            </Link>
            <Link
              href="/portal/profile?domain=live"
              className="text-sm transition-colors"
              style={{ color: "#D4AF37" }}
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
        <div className="mb-2">
          <Link
            href="/portal?domain=live"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </div>

        <h1 className="mb-2 text-3xl font-bold">
          {profile.isCompanyMember ? "My Profile" : "Admin Profile"}
        </h1>
        <p className="mb-8 text-gray-400">Manage your account settings.</p>

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
                  <p className="text-sm text-gray-400">Your admin account details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Name
                  </label>
                  {isEditingName ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-9 border-gray-700 bg-black/50 text-white"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={updateProfile.isPending}
                        className="h-9 px-2"
                        style={{ backgroundColor: "#D4AF37" }}
                      >
                        {updateProfile.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEditName}
                        className="h-9 px-2 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-white">{profile.name}</p>
                      <button
                        onClick={handleStartEditName}
                        className="text-gray-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <p className="flex items-center gap-2 text-white">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {profile.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Phone (optional)
                  </label>
                  {isEditingPhone ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="h-9 border-gray-700 bg-black/50 text-white"
                        placeholder="Enter phone number"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleSavePhone}
                        disabled={updateProfile.isPending}
                        className="h-9 px-2"
                        style={{ backgroundColor: "#D4AF37" }}
                      >
                        {updateProfile.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEditPhone}
                        className="h-9 px-2 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="flex items-center gap-2 text-white">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {profile.phone || "Not set"}
                      </p>
                      <button
                        onClick={handleStartEditPhone}
                        className="text-gray-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Info */}
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
                  <Shield className="h-6 w-6" style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Role & Permissions</h2>
                  <p className="text-sm text-gray-400">Your access level</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Portal Role
                  </label>
                  <p className="text-white capitalize">{profile.role}</p>
                </div>

                {profile.isCompanyMember && (
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500">
                      Organization Member
                    </label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                      <Building2 className="h-4 w-4" style={{ color: "#D4AF37" }} />
                      <span>Miracle Mind</span>
                    </div>
                  </div>
                )}

                {profile.companyRoles && profile.companyRoles.length > 0 ? (
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500">
                      Company Roles
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.companyRoles.map((role: string) => (
                        <span
                          key={role}
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(212, 175, 55, 0.1)",
                            color: "#D4AF37",
                            border: "1px solid rgba(212, 175, 55, 0.2)",
                          }}
                        >
                          {ROLE_LABELS[role] ?? role}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500">
                      Permissions
                    </label>
                    <ul className="mt-1 space-y-1 text-sm text-gray-400">
                      <li>• View all client portals</li>
                      <li>• Manage client resources</li>
                      <li>• Create proposals & demos</li>
                      <li>• Access billing information</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card
            className="bg-white/5 md:col-span-2"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <Lock className="h-6 w-6" style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Security</h2>
                  <p className="text-sm text-gray-400">Manage your account security</p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="mb-4 rounded-md bg-green-900/30 p-3 text-sm text-green-400">
                  Password changed successfully
                </div>
              )}

              {!showPasswordForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  className="border-gray-700 text-white hover:bg-white/10"
                >
                  Change Password
                </Button>
              ) : (
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-gray-700 bg-black/50 pr-10 text-white"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-gray-700 bg-black/50 pr-10 text-white"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-400">{passwordError}</p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      style={{ backgroundColor: "#D4AF37" }}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Password"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordError("");
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

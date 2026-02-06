"use client";

import { use, useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  User,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Building,
  Calendar,
  Pencil,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  UserCheck,
} from "lucide-react";

export default function PortalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const utils = api.useUtils();
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
  // Get logged-in user's profile to check if admin
  const { data: myProfile } = api.portal.getMyProfile.useQuery(
    undefined,
    { staleTime: 0 }
  );
  // Get the client's portal user profile (for this slug)
  const { data: clientProfile } = api.portal.getClientPortalUser.useQuery(
    { slug },
    { staleTime: 0 }
  );

  // Determine if current user is admin viewing a client's profile
  const isAdmin = myProfile?.role === "admin";
  const isViewingOwnProfile = myProfile?.clientSlug === slug;
  // Use clientProfile for display, which is the profile for this slug
  const displayProfile = clientProfile;

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  // Edit phone state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState("");

  // Edit company state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editCompany, setEditCompany] = useState("");

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
      toast.success("Profile updated");
      void utils.portal.getMyProfile.invalidate();
      void utils.portal.getClientPortalUser.invalidate({ slug });
      void utils.portal.getClientBySlug.invalidate({ slug });
      setIsEditingName(false);
      setIsEditingPhone(false);
      setIsEditingCompany(false);
    },
  });

  // Only allow editing if viewing own profile (not admin viewing client)
  const canEdit = !isAdmin || isViewingOwnProfile;

  const handleStartEditName = () => {
    if (!canEdit) return;
    setEditName(displayProfile?.name ?? client?.name ?? "");
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
    if (!canEdit) return;
    setEditPhone(displayProfile?.phone ?? "");
    setIsEditingPhone(true);
  };

  const handleSavePhone = () => {
    updateProfile.mutate({ phone: editPhone.trim() || undefined });
  };

  const handleCancelEditPhone = () => {
    setIsEditingPhone(false);
    setEditPhone("");
  };

  const handleStartEditCompany = () => {
    if (!canEdit) return;
    setEditCompany(client?.company ?? "");
    setIsEditingCompany(true);
  };

  const handleSaveCompany = () => {
    updateProfile.mutate({ company: editCompany.trim() || undefined });
  };

  const handleCancelEditCompany = () => {
    setIsEditingCompany(false);
    setEditCompany("");
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
      <h1 className="mb-2 text-3xl font-bold">
        {isAdmin && !isViewingOwnProfile ? `${client.name}'s Profile` : "Profile"}
      </h1>
      <p className="mb-8 text-gray-400">
        {isAdmin && !isViewingOwnProfile
          ? "Client account information (read-only)."
          : "Your account information and settings."}
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
                    <p className="text-white">{displayProfile?.name ?? client.name}</p>
                    {canEdit && (
                      <button
                        onClick={handleStartEditName}
                        aria-label="Edit name"
                        className="text-gray-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <p className="flex items-center gap-2 text-white">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {displayProfile?.email ?? client.email}
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
                      {displayProfile?.phone || "Not set"}
                    </p>
                    {canEdit && (
                      <button
                        onClick={handleStartEditPhone}
                        aria-label="Edit phone"
                        className="text-gray-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500">
                  Role
                </label>
                <p className="text-white capitalize">{displayProfile?.role ?? "client"}</p>
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
                {isEditingCompany ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="h-9 border-gray-700 bg-black/50 text-white"
                      placeholder="Enter company name"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveCompany}
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
                      onClick={handleCancelEditCompany}
                      className="h-9 px-2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white">{client.company || "Not set"}</p>
                    {canEdit && (
                      <button
                        onClick={handleStartEditCompany}
                        aria-label="Edit company"
                        className="text-gray-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
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

        {/* Account Manager */}
        {client.accountManager && (
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
                  <UserCheck className="h-6 w-6" style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Your Account Manager</h2>
                  <p className="text-sm text-gray-400">Your dedicated point of contact</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Name
                  </label>
                  <p className="text-white">{client.accountManager.name}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">
                    Email
                  </label>
                  <p className="flex items-center gap-2 text-white">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a
                      href={`mailto:${client.accountManager.email}`}
                      className="transition-colors hover:text-[#D4AF37]"
                    >
                      {client.accountManager.email}
                    </a>
                  </p>
                </div>
                {client.accountManager.phone && (
                  <div>
                    <label className="text-xs uppercase tracking-wide text-gray-500">
                      Phone
                    </label>
                    <p className="flex items-center gap-2 text-white">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <a
                        href={`tel:${client.accountManager.phone}`}
                        className="transition-colors hover:text-[#D4AF37]"
                      >
                        {client.accountManager.phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security - only show for own profile */}
        {canEdit && (
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
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
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
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
        )}
      </div>
    </ClientPortalLayout>
  );
}

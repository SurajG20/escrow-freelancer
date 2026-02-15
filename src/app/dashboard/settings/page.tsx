"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Wallet,
  Mail,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUpdateUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, address, isLoading: authLoading, isUserLoading } = useAuth();
  const router = useRouter();
  const updateUserMutation = useUpdateUser();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    setDisplayName(user?.display_name ?? "");
    setBio(user?.bio ?? "");
    setAvatarUrl(user?.avatar_url ?? "");
    setEmailNotifications(user?.email_notifications ?? false);
    setPushNotifications(user?.push_notifications ?? false);
  }, [user?.display_name, user?.bio, user?.avatar_url, user?.email_notifications, user?.push_notifications]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        updates: {
          display_name: displayName || undefined,
          bio: bio || undefined,
          avatar_url: avatarUrl || undefined,
        },
      });
      setSaveMessage({
        type: "success",
        text: "Profile updated successfully. Your display name and details are now visible across projects and to other users.",
      });
      router.refresh();
    } catch (error) {
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isUserLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-light tracking-tight">Settings</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 w-full min-w-0">
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight">Settings</h1>

      <Card className="">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your profile details and linked accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Avatar URL</label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {saveMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                saveMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {saveMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{saveMessage.text}</span>
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || !user}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle>Connected Wallets</CardTitle>
          <CardDescription>
            Manage wallets used for signing transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {address ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-slate-200 bg-white/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-sm break-all sm:break-normal">
                    {address.substring(0, 6)}...{address.substring(38)}
                  </div>
                  <Badge variant="glass" className="text-[10px] mt-1 sm:mt-0 sm:ml-2 inline-block">
                    Primary
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No wallet connected</p>
              <p className="text-sm mt-2">Connect your wallet to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Receive daily digests and major alerts
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailNotifications}
              disabled={!user || updateUserMutation.isPending}
              onClick={async () => {
                if (!user) return;
                const next = !emailNotifications;
                setEmailNotifications(next);
                try {
                  await updateUserMutation.mutateAsync({
                    id: user.id,
                    updates: { email_notifications: next },
                  });
                } catch {
                  setEmailNotifications(emailNotifications);
                }
              }}
              className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors disabled:opacity-50 ${emailNotifications ? "bg-accent" : "bg-muted"}`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${emailNotifications ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <Smartphone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium">Push Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Real-time updates on milestones
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pushNotifications}
              disabled={!user || updateUserMutation.isPending}
              onClick={async () => {
                if (!user) return;
                const next = !pushNotifications;
                setPushNotifications(next);
                try {
                  await updateUserMutation.mutateAsync({
                    id: user.id,
                    updates: { push_notifications: next },
                  });
                } catch {
                  setPushNotifications(pushNotifications);
                }
              }}
              className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors disabled:opacity-50 ${pushNotifications ? "bg-accent" : "bg-muted"}`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${pushNotifications ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

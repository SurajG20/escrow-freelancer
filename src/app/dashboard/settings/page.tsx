"use client";

import { useState } from "react";
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
  const { user, address } = useAuth();
  const router = useRouter();
  const updateUserMutation = useUpdateUser();

  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        text: "Profile updated successfully!",
      });
      setTimeout(() => {
        router.refresh();
      }, 1000);
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

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-light tracking-tight">Settings</h1>

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
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/40">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-mono text-sm">
                    {address.substring(0, 6)}...{address.substring(38)}
                  </div>
                  <Badge variant="glass" className="text-[10px] ml-2">
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
          {[
            {
              title: "Email Notifications",
              desc: "Receive daily digests and major alerts",
              icon: Mail,
              on: false,
            },
            {
              title: "Push Notifications",
              desc: "Real-time updates on milestones",
              icon: Smartphone,
              on: false,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
              </div>
              <div
                className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-colors ${item.on ? "bg-accent" : "bg-muted"}`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.on ? "translate-x-5" : "translate-x-0"}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

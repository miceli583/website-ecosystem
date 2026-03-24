"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck } from "lucide-react";
import { api } from "~/trpc/react";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

type Notification = {
  id: number;
  title: string;
  message: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: Date;
  type: string;
  recipientId: string;
};

export default function NotificationsPage() {
  const utils = api.useUtils();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = api.notifications.getAll.useQuery({
    limit,
    offset,
  });

  const markRead = api.notifications.markRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getAll.invalidate();
      void utils.notifications.getUnreadCount.invalidate();
    },
  });

  const markAllRead = api.notifications.markAllRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getAll.invalidate();
      void utils.notifications.getUnreadCount.invalidate();
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <Bell className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
            <p className="text-sm text-gray-500">{data?.total ?? 0} total</p>
          </div>
        </div>
        <button
          onClick={() => markAllRead.mutate()}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white"
          style={borderStyle}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div
          className="rounded-lg border bg-white/5 py-16 text-center"
          style={borderStyle}
        >
          <Bell className="mx-auto mb-3 h-8 w-8 text-gray-700" />
          <p className="text-sm text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(data.items as Notification[]).map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                n.isRead ? "bg-white/[0.02]" : "bg-white/5"
              }`}
              style={borderStyle}
            >
              {!n.isRead && (
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#D4AF37]" />
              )}
              <div className={`min-w-0 flex-1 ${n.isRead ? "ml-5" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  {n.linkUrl ? (
                    <Link
                      href={n.linkUrl}
                      className="text-sm font-medium text-white hover:text-[#D4AF37]"
                    >
                      {n.title}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-white">{n.title}</p>
                  )}
                  <span className="flex-shrink-0 text-[10px] text-gray-600">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {n.message && (
                  <p className="mt-1 text-xs text-gray-500">{n.message}</p>
                )}
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead.mutate({ id: n.id })}
                  className="mt-1 flex-shrink-0 text-gray-600 transition-colors hover:text-[#D4AF37]"
                  title="Mark as read"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded-lg border px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white disabled:opacity-30"
            style={borderStyle}
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-xs text-gray-500">
            {offset + 1}–{Math.min(offset + limit, data.total)} of {data.total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={!data.hasMore}
            className="rounded-lg border px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white disabled:opacity-30"
            style={borderStyle}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

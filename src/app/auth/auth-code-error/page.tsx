"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md border-yellow-600/30 bg-gray-950 shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Authentication Error
        </CardTitle>
        <p className="text-sm text-gray-400">
          There was a problem with your authentication link
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <div className="space-y-2 text-sm text-gray-300">
          <p>This could happen if:</p>
          <ul className="ml-6 list-disc space-y-1 text-gray-400">
            <li>The link has expired (links are valid for 1 hour)</li>
            <li>The link has already been used</li>
            <li>The link was opened on a different device</li>
          </ul>
        </div>

        <Button asChild className="w-full" style={{ backgroundColor: "#D4AF37" }}>
          <Link href="/">Try Again</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md border-yellow-600/30 bg-gray-950 shadow-xl">
      <CardContent className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </CardContent>
    </Card>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Suspense fallback={<LoadingFallback />}>
        <AuthCodeErrorContent />
      </Suspense>
    </div>
  );
}

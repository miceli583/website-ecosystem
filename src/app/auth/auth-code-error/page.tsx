import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <Card className="w-full max-w-md border-violet-200 shadow-xl dark:border-violet-800">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Authentication Error
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            There was a problem with your authentication link
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>This could happen if:</p>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>The link has expired</li>
              <li>The link has already been used</li>
              <li>The link is invalid</li>
            </ul>
          </div>

          <Button asChild className="w-full bg-violet-600 hover:bg-violet-700">
            <Link href="/admin/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

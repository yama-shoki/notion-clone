"use client";

import { login } from "@/app/server/auth/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState } from "react";

export const LoginForm = () => {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">ログインページ</h2>
        <form action={action} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              メールアドレス
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="メールアドレス"
              required
              disabled={isPending}
              defaultValue={state?.value?.email}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              パスワード
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="パスワード"
              required
              disabled={isPending}
              defaultValue={state?.value?.password}
            />
          </div>
          {state?.errors && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "処理中..." : "ログイン"}
          </Button>
          <Button asChild className="w-full" disabled={isPending}>
            <Link href="/signup" className="text-sm">
              新規登録
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

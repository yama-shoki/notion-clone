"use client";

import { signUp } from "@/app/server/auth/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState } from "react";
export const SignUpForm = () => {
  const [state, action, isPending] = useActionState(signUp, null);
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">新規登録ページ</h2>

        <form action={action} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              ユーザー名
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="ユーザー名"
              required
              defaultValue={state?.value?.name}
            />
          </div>
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
              defaultValue={state?.value?.password}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "処理中..." : "登録"}
          </Button>
          {state?.message && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}
          <Button asChild className="w-full">
            <Link href="/" className="text-sm">
              ログインはこちら
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

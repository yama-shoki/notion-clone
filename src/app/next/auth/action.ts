"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema } from "../schema";

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
  value?: Record<string, string>;
} | null;

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

export const signUp = async (_prevState: LoginState, formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (!error) {
    redirect("/notion");
  }

  // 返却してあげることで、useActionStateのstateに値が入る。
  return { message: error.message, value: { name, email, password } };
};

export const login = async (
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
  const userInput = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(userInput);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります",
      value: userInput,
    };
  }

  const { email, password } = result.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // 返却してあげることで、useActionStateのstateに値が入る。
    return { message: error.message, value: { email, password } };
  }

  redirect("/notion");
};

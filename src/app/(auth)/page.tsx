import { currentUser } from "@/app/next/auth/data";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/LoginForm";

export default async function Login() {
  const user = await currentUser();
  if (user) {
    return redirect("/notion");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}

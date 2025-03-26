import { currentUser } from "@/app/next/auth/data";
import { redirect } from "next/navigation";
import { SignUpForm } from "../components/SignUpForm";

export default async function SignUp() {
  const user = await currentUser();
  if (user) {
    return redirect("/notion");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUpForm />
    </div>
  );
}

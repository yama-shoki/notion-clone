import { signOut } from "@/app/next/auth/action";
import { Button } from "@/components/ui/button";

export const LogoutForm = () => {
  return (
    <form action={signOut}>
      <Button type="submit" className="bg-foreground/70 mt-2 ml-2">
        ログアウト
      </Button>
    </form>
  );
};

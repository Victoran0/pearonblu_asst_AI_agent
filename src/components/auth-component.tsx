import { signIn, signOut } from "@/auth"
import { Button } from "./ui/button"

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn(provider, formData)
      }}
    >
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <Button {...props}>Sign In</Button>
    </form>
  )
}
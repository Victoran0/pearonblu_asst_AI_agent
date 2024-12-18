import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label htmlFor="email">Username</label>
        <input 
            type="text" 
            name="username"
            placeholder="Username" 
            required 
            className="inputField" 
        />
        
        <label htmlFor="password">Password</label>
        <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            className="inputField"
        />
        {/* implement error on the use server page */}
        {/* {error !== '' && <p style={{ color: 'red' }}>{error}</p>} */}
        <div className="h-4"></div>
        <button type="submit" className="loginButton" > {/* disabled={loading} */}
            {/* {loading ? 'Logging in...' : 'Log In'} */}
            Log in
        </button>
        
        <div className="divider">
        <span> | </span>
        </div>
    </form>
    
  )
}
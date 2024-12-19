// // import { signIn } from "@/auth"
// import { signIn } from "next-auth/react"
 
// export function SignIn() {
//   return (
//     <form
//       className="loginForm"
//       action={async (formData: any) => {
//         "use client"
//         await signIn("credentials", formData)
//       }}
//     >
//       <label htmlFor="email">Username</label>
//         <input 
//             type="text" 
//             name="username"
//             placeholder="Username" 
//             required 
//             className="inputField" 
//         />
        
//         <label htmlFor="password">Password</label>
//         <input 
//             type="password" 
//             name="password" 
//             placeholder="Password" 
//             required 
//             className="inputField"
//         />
//         {/* implement error on the use server page */}
//         {/* {error !== '' && <p style={{ color: 'red' }}>{error}</p>} */}
//         <div className="h-4"></div>
//         <button type="submit" className="loginButton" > {/* disabled={loading} */}
//             {/* {loading ? 'Logging in...' : 'Log In'} */}
//             Log in
//         </button>
        
//         <div className="divider">
//         <span> | </span>
//         </div>
//     </form>
    
//   )
// }

"use client"
import { signIn } from "next-auth/react"
 
export function SignIn() {
  const credentialsAction = (formData: any) => {
    signIn("credentials", formData)
  }
 
  return (
    <form action={credentialsAction}>
      <label htmlFor="credentials-username">
        Username
        <input type="text" id="credentials-username" name="username" />
      </label>
      <label htmlFor="credentials-password">
        Password
        <input type="password" id="credentials-password" name="password" />
      </label>
      <input type="submit" value="Sign In" />
    </form>
  )
}
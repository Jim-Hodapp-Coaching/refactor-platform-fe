import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Email", type: "email", placeholder: "james.hodapp@gmail.com" },
                password: { label: "Password", type: "password1" },
                next: { type: "string" }
            },
            async authorize(credentials) {
                const authResponse = await fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    //body: JSON.stringify(credentials),
                    body: new URLSearchParams(JSON.stringify(credentials))
                })

                if (!authResponse.ok) {
                    return null
                }

                const user = await authResponse.json()

                return user
            },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            session.user = user as any;
            return session
        },
    },
})
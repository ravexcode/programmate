"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainContainer from "@/components/containers/main";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error redirecting to Google:", err);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/welcome?source=login");
      } else {
        const data = await res.json();
        setError(data.message || "Error al iniciar sesión");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Error de conexión");
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <main className="flex flex-col justify-center items-center min-h-[80vh] py-10 pb-3 gap-10 appear-element">
        <section className="w-full max-w-md mx-auto show-element my-10">
          <form 
            onSubmit={handleLogin}
            className="flex flex-col gap-6 p-8 bg-amethyst-950 rounded-xl border border-amethyst-500 shadow-lg text-text"
          >
            <h2 className="text-3xl font-bold text-amethyst-500 text-center mb-2">
              Welcome back
            </h2>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex flex-col justify-start items-start w-full gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input 
                type="email" 
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-amethyst-900/40 border border-amethyst-700 placeholder:text-gray-400 focus:outline-none focus:border-amethyst-400 focus:ring-1 focus:ring-amethyst-400 transition-all" 
                placeholder="me@email.com" 
              />
            </div>

            <div className="flex flex-col justify-start items-start w-full gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input 
                type="password" 
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-amethyst-900/40 border border-amethyst-700 placeholder:text-gray-400 focus:outline-none focus:border-amethyst-400 focus:ring-1 focus:ring-amethyst-400 transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              className={ "mt-2 w-full py-3 px-6 bg-amethyst-600 hover:bg-amethyst-500 text-white font-bold rounded-md transition-colors cursor-pointer " + (isLoading ? "cursor-progress hover:bg-amethyst-900" : "") }
            >
              Log In
            </button>

            <div className="flex items-center gap-2 my-2 opacity-50">
              <div className="h-px w-full bg-text"></div>
              <span className="text-sm">or</span>
              <div className="h-px w-full bg-text"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-6 bg-background-dark text-text font-bold rounded-md duration-200 cursor-pointer flex justify-center items-center gap-3 shadow-lg hover:scale-105 hover:bg-amethyst-900 hover:shadow-amethyst-500/20"
            >
              <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <p className="text-center text-sm text-text/70 mt-2">
              Don't have an account? <a href="/auth/register" className="text-amethyst-400 hover:underline">Sign up</a>
            </p>

            <p className="w-full text-center text-text text-sm">Made with Gemini AI ✨</p>
          </form>
        </section>
      </main>
    </MainContainer>
  );
}
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBasket,
} from "lucide-react";
import groceryImage from "../assets/images/hero_grocery_bag_1790612945337.jpg";

const TEST_EMAIL = "email@gmail.com";
const TEST_PASSWORD = "12345678890";

interface LoginPageProps {
  onSignIn: () => void;
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const [email, setEmail] = useState(TEST_EMAIL);
  const [password, setPassword] = useState(TEST_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      email.trim().toLowerCase() !== TEST_EMAIL ||
      password !== TEST_PASSWORD
    ) {
      setError("That email and password do not match.");
      return;
    }
    setError("");
    onSignIn();
  };

  return (
    <main className="grid min-h-screen bg-white md:grid-cols-2">
      <section className="relative flex min-h-[34vh] flex-col justify-between overflow-hidden bg-emerald-950 px-7 py-7 text-white sm:px-10 sm:py-9 md:min-h-screen md:px-14 md:py-12">
        <img
          src={groceryImage}
          alt="A fresh selection of groceries ready for delivery"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/75 via-emerald-950/25 to-emerald-950/85" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-amber-500 text-emerald-950">
            <ShoppingBasket size={21} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-wide">WINLIUM</span>
        </div>
        <div className="relative z-10 hidden max-w-lg pb-5 md:block">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Fresh starts here
          </p>
          <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
            Your neighborhood market, in one place.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/80">
            Browse everyday essentials and bring a little more freshness to your
            table.
          </p>
        </div>
        <p className="relative z-10 hidden text-xs text-white/70 md:block">
          © 2026 Winlium Microsite
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 md:px-14">
        <div className="w-full max-w-md">
          <div className="mb-10 md:mb-12">
            <div className="mb-8 grid size-11 place-items-center rounded-lg bg-amber-100 text-amber-700 md:hidden">
              <ShoppingBasket size={23} />
            </div>
            <p className="mb-3 text-sm font-semibold text-amber-600">
              WINLIUM MICROSITE PORTAL
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to continue to your portal.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="flex h-12 items-center gap-3 rounded-md border border-slate-300 px-3.5 transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                <Mail
                  size={18}
                  className="shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  placeholder={TEST_EMAIL}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="flex h-12 items-center gap-3 rounded-md border border-slate-300 px-3.5 transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                <LockKeyhole
                  size={18}
                  className="shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  placeholder={TEST_PASSWORD}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="grid size-8 shrink-0 place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Enter portal
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Winlium Microsite Portal
          </p>
        </div>
      </section>
    </main>
  );
}

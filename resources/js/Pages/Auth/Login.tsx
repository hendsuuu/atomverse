import { Head, useForm, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import FormField from "@/Components/FormField";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <AuthLayout>
            <Head title="Login" />

            <h2 className="text-xl font-bold text-surface-900 mb-1">
                Welcome back
            </h2>
            <p className="text-sm text-surface-500 mb-6">
                Sign in to continue learning
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Email"
                    name="email"
                    error={errors.email}
                    required
                >
                    <input
                        id="email"
                        type="email"
                        className="input"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                    />
                </FormField>

                <FormField
                    label="Password"
                    name="password"
                    error={errors.password}
                    required
                >
                    <input
                        id="password"
                        type="password"
                        className="input"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </FormField>

                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-surface-600"
                    >
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary w-full"
                >
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>

                <p className="text-center text-sm text-surface-500">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Create one
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

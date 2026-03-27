import { Head, useForm, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import FormField from "@/Components/FormField";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <AuthLayout>
            <Head title="Register" />

            <h2 className="text-xl font-bold text-surface-900 mb-1">
                Create an account
            </h2>
            <p className="text-sm text-surface-500 mb-6">
                Join Atomverse and start learning
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Name"
                    name="name"
                    error={errors.name}
                    required
                >
                    <input
                        id="name"
                        type="text"
                        className="input"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        autoFocus
                    />
                </FormField>

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
                        autoComplete="new-password"
                    />
                </FormField>

                <FormField
                    label="Confirm Password"
                    name="password_confirmation"
                    error={errors.password_confirmation}
                    required
                >
                    <input
                        id="password_confirmation"
                        type="password"
                        className="input"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                </FormField>

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
                            Creating account...
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </button>

                <p className="text-center text-sm text-surface-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

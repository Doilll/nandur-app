// app/(auth)/login/page.tsx
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <LoginForm />

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </>
  );
}

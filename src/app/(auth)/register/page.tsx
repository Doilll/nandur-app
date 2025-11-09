import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      
      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>
    </>
  );
}
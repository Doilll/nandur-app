import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
    <Navbar />
    <main>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/persawahan.jpg"
          alt="Lahan pertanian yang subur"
          fill
          style={{ objectFit: "cover" }}
          className="scale-110"
          priority
        />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Selamat Datang di Nandur App
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-md">
          Platform untuk mengelola proyek pertanian Anda dengan mudah dan efisien.
        </p>
      </div>
      </section>
    </main>
    <Footer />
    </>
  );
}

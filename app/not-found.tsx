import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <p className="text-5xl font-bold text-slate-400">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <Link href="/" className="btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}

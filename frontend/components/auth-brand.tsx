import Link from 'next/link'

export default function AuthBrand() {
  return (
    <div className="mb-7 flex justify-center">
      <Link
        href="/"
        aria-label="CamboCine home"
        className="inline-flex rounded-2xl p-1 transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500/70"
      >
        <img
          src="/logo-nav.png"
          alt="CamboCine Movie Time"
          className="h-20 w-auto object-contain drop-shadow-[0_0_18px_rgba(249,115,22,0.22)] sm:h-24"
        />
      </Link>
    </div>
  )
}

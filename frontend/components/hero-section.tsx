export default function HeroSection() {
  return (
    <div className="relative h-96 bg-gradient-to-r from-orange-600 to-orange-500 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-black mix-blend-multiply"></div>
      </div>
      
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Your Cinema Experience Awaits
        </h1>
        <p className="text-xl md:text-2xl text-orange-50 max-w-2xl">
          Book your favorite movies, reserve the best seats, and enjoy unforgettable moments
        </p>
      </div>
    </div>
  )
}

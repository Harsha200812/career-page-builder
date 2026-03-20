export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Careers Page Builder
        </h1>
        <p className="text-lg text-gray-600">
          Create branded, mobile-friendly careers pages in minutes. No coding required.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </a>
          <a
            href="/demo"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View Demo
          </a>
        </div>
      </div>
    </div>
  );
}

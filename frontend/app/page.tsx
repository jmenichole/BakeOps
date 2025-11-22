export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary-600 mb-4">
          BakeBuilder
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          AI-Powered Cake Design & Booking Platform
        </p>
        <div className="space-y-2 text-gray-700">
          <p>✨ Transform descriptions into stunning cake mockups</p>
          <p>🎨 Train AI on your actual cake photos</p>
          <p>📅 Multi-day production planning</p>
          <p>🧮 Batch ingredient calculations</p>
          <p>💳 Seamless booking & payments</p>
        </div>
        <div className="mt-12">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200">
            Start 7-Day Free Trial
          </button>
        </div>
      </div>
    </main>
  )
}

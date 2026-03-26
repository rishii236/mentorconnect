import { Link } from 'react-router-dom'
import { Vortex } from '../components/ui/Vortex'

function ComingSoon() {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Vortex
        backgroundColor="#000000"
        rangeY={800}
        particleCount={300}
        baseHue={270}
        baseOpacity={0.25}
        className="flex items-center justify-center px-2 md:px-10 py-4 w-full h-full"
        containerClassName="w-full h-screen"
      >
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
            Coming Soon
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/"
              className="px-6 py-3 rounded-lg gradient-bg text-white font-semibold hover:scale-105 transition-transform"
            >
              Back to Home
            </Link>
            <Link 
              to="/login"
              className="px-6 py-3 rounded-lg glass text-white font-semibold hover:border-purple-500 transition-colors border border-gray-600"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>This page is under construction as part of the ongoing development.</p>
          </div>
        </div>
      </Vortex>
    </div>
  )
}

export default ComingSoon
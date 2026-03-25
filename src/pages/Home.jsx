import { useNavigate } from 'react-router-dom'
import { Vortex } from '../components/ui/Vortex'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '🎓',
      title: 'Expert Mentors',
      description: 'Connect with industry professionals and experienced educators in your field'
    },
    {
      icon: '📹',
      title: 'Live Sessions',
      description: 'Real-time video calls and interactive chat sessions with mentors'
    },
    {
      icon: '💡',
      title: 'Doubt Resolution',
      description: 'Get your questions answered quickly with personalized guidance'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your learning journey and measure your growth'
    },
    {
      icon: '🎯',
      title: 'Career Guidance',
      description: 'Receive valuable career advice and referrals from experts'
    },
    {
      icon: '🌟',
      title: 'Always Free',
      description: 'Access quality mentorship without any cost or hidden fees'
    }
  ]

  const stats = [
    { value: '500+', label: 'Expert Mentors' },
    { value: '10k+', label: 'Students Helped' },
    { value: '95%', label: 'Success Rate' }
  ]

  // Mentor avatars with diverse names for AI-generated images
  const mentors = [
    { name: 'Sarah', seed: 'sarah' },
    { name: 'Alex', seed: 'alex' },
    { name: 'Maya', seed: 'maya' },
    { name: 'David', seed: 'david' },
    { name: 'Raj', seed: 'raj' },
    { name: 'Kate', seed: 'kate' }
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Vortex
        backgroundColor="#000000"
        rangeY={800}
        particleCount={400}
        baseHue={270}
        baseOpacity={0.3}
        containerClassName="min-h-screen"
        className="w-full"
      >
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="MentorConnect Logo" 
                  className="h-12 w-12"
                />
                <h1 className="text-3xl font-bold gradient-text">
                  MentorConnect
                </h1>
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How it Works
                </a>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 rounded-lg gradient-bg text-white font-semibold glow-purple hover:scale-105 transition-transform"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg gradient-bg text-white font-semibold text-sm"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section - TWO COLUMN LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT SIDE - Content */}
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Connect with </span>
                <span className="gradient-text">Expert Mentors</span>
                <span className="text-white"> for Your Future</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-10">
                Get personalized guidance, career advice, and valuable referrals from industry experts through free video calls and chat sessions.
              </p>

              {/* Single CTA Button */}
              <div className="mb-12">
                <button
                  onClick={() => navigate('/register')}
                  className="px-10 py-4 rounded-xl gradient-bg text-white font-bold text-lg glow-purple hover:scale-105 transition-all flex items-center gap-2"
                >
                  Start Your Journey
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              
              {/* Bottom Icons */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Free Video Calls
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Industry Experts
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Always Free
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Mentor Grid with AI Avatars */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-3 gap-4">
                {mentors.map((mentor, index) => (
                  <div 
                    key={index}
                    className="glass rounded-2xl overflow-hidden hover-lift transition-all"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                        alt={`Mentor ${mentor.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span style={{ color: 'white' }}>Why Choose </span>
                <span className="gradient-text">MentorConnect</span>
                <span style={{ color: 'white' }}>?</span>
             </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to accelerate your learning and career growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-8 hover:scale-105 hover:bg-white/5 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mt-32">
            <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold mb-4">
               <span style={{ color: 'white' }}>How It </span>
               <span className="gradient-text">Works</span>
             </h2>
 <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold mx-auto mb-6 glow-purple">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Sign Up</h3>
                <p className="text-gray-400">
                  Create your free account and complete your profile in minutes
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold mx-auto mb-6 glow-purple">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Find Mentors</h3>
                <p className="text-gray-400">
                  Browse expert mentors in your field and book sessions
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold mx-auto mb-6 glow-purple">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Start Learning</h3>
                <p className="text-gray-400">
                  Connect with mentors through video calls and resolve your doubts
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-32">
            <div className="glass rounded-3xl p-12 max-w-4xl mx-auto text-center">
             <h2 className="text-4xl md:text-5xl font-bold mb-6">
               <span style={{ color: 'white' }}>Ready to Transform Your </span>
               <span className="gradient-text">Future</span>
               <span style={{ color: 'white' }}>?</span>
             </h2> <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already learning from the best mentors in the industry
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-10 py-4 rounded-xl gradient-bg text-white font-bold text-lg glow-purple hover:scale-105 transition-all"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="MentorConnect Logo" 
                    className="h-8 w-8"
                  />
                  <h3 className="text-xl font-bold gradient-text">MentorConnect</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Connecting students with expert mentors for a brighter future.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                  <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Community</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Become a Mentor</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
              <p>© 2026 MentorConnect. Built with 💜 by Swara.</p>
            </div>
          </div>
        </footer>
      </Vortex>
    </div>
  )
}

export default Home
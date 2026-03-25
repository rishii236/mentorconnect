function Loader({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div 
        className={`${sizeClasses[size]} border-purple-500/30 border-t-purple-500 rounded-full animate-spin`}
      />
      {message && (
        <p className="text-gray-400 text-sm mt-4">{message}</p>
      )}
    </div>
  )
}

export default Loader
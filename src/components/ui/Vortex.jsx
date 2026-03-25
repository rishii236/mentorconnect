import { cn } from '../../utils/utils.js'
import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'
import { motion } from 'framer-motion'

export const Vortex = (props) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const particleCount = props.particleCount || 700
  const particlePropCount = 9
  const particlePropsLength = particleCount * particlePropCount
  const rangeY = props.rangeY || 100
  const baseTTL = 50
  const rangeTTL = 150
  const baseSpeed = props.baseSpeed || 0.0
  const rangeSpeed = props.rangeSpeed || 1.5
  const baseRadius = props.baseRadius || 1
  const rangeRadius = props.rangeRadius || 2
  const baseHue = props.baseHue || 270
  const rangeHue = 100
  const noiseSteps = 3
  const xOff = 0.00125
  const yOff = 0.00125
  const zOff = 0.0005
  const backgroundColor = props.backgroundColor || '#000000'
  const baseOpacity = props.baseOpacity || 0.3
  let tick = 0
  const noise3D = createNoise3D()
  let particleProps = new Float32Array(particlePropsLength)
  let center = [0, 0]

  const HALF_PI = 0.5 * Math.PI
  const TAU = 2 * Math.PI
  const rand = (n) => n * Math.random()
  const randRange = (n) => n - rand(2 * n)
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m
    return Math.abs(((t + hm) % m) - hm) / hm
  }
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2

  const setup = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas && container) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        resize(canvas, ctx)
        initParticles()
        draw(canvas, ctx)
      }
    }
  }

  const initParticles = () => {
    tick = 0
    particleProps = new Float32Array(particlePropsLength)
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i)
    }
  }

  const initParticle = (i) => {
    const canvas = canvasRef.current
    if (!canvas) return
    let x, y, vx, vy, life, ttl, speed, radius, hue
    x = rand(canvas.width)
    y = center[1] + randRange(rangeY)
    vx = 0
    vy = 0
    life = 0
    ttl = baseTTL + rand(rangeTTL)
    speed = baseSpeed + rand(rangeSpeed)
    radius = baseRadius + rand(rangeRadius)
    hue = baseHue + rand(rangeHue)
    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i)
  }

  const draw = (canvas, ctx) => {
    tick++
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawParticles(ctx)
    renderGlow(canvas, ctx)
    renderToScreen(canvas, ctx)
    window.requestAnimationFrame(() => draw(canvas, ctx))
  }

  const drawParticles = (ctx) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx)
    }
  }

  const updateParticle = (i, ctx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const i2 = 1 + i
    const i3 = 2 + i
    const i4 = 3 + i
    const i5 = 4 + i
    const i6 = 5 + i
    const i7 = 6 + i
    const i8 = 7 + i
    const i9 = 8 + i
    
    const x = particleProps[i]
    const y = particleProps[i2]
    const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU
    const vx = lerp(particleProps[i3], Math.cos(n), 0.5)
    const vy = lerp(particleProps[i4], Math.sin(n), 0.5)
    let life = particleProps[i5]
    const ttl = particleProps[i6]
    const speed = particleProps[i7]
    const x2 = x + vx * speed
    const y2 = y + vy * speed
    const radius = particleProps[i8]
    const hue = particleProps[i9]

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx)

    life++

    particleProps[i] = x2
    particleProps[i2] = y2
    particleProps[i3] = vx
    particleProps[i4] = vy
    particleProps[i5] = life

    if (checkBounds(x, y, canvas) || life > ttl) {
      initParticle(i)
    }
  }

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineWidth = radius
    const opacity = fadeInOut(life, ttl) * baseOpacity
    ctx.strokeStyle = `hsla(${hue},100%,60%,${opacity})`
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  const checkBounds = (x, y, canvas) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0
  }

  const resize = (canvas, ctx) => {
    const { innerWidth, innerHeight } = window
    canvas.width = innerWidth
    canvas.height = innerHeight
    center[0] = 0.5 * canvas.width
    center[1] = 0.5 * canvas.height
  }

  const renderGlow = (canvas, ctx) => {
    ctx.save()
    ctx.filter = 'blur(8px) brightness(200%)'
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
    ctx.save()
    ctx.filter = 'blur(4px) brightness(200%)'
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }

  const renderToScreen = (canvas, ctx) => {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }

  useEffect(() => {
    setup()
    const handleResize = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        resize(canvas, ctx)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={cn('relative min-h-screen w-full', props.containerClassName)}>
      {/* FIXED BACKGROUND - Covers entire viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="fixed inset-0 z-0 bg-transparent"
        style={{ backgroundColor: backgroundColor }}
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>
      
      {/* SCROLLABLE CONTENT - Above the fixed background */}
      <div className={cn('relative z-10 min-h-screen', props.className)}>
        {props.children}
      </div>
    </div>
  )
}
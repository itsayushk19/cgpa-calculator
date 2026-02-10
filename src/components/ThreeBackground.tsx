'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { readCgpa } from '@/lib/cgpa-store'

function DotCloudThing() {
  const ref = useRef<THREE.Points>(null!)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 60
      const y = (Math.random() - 0.5) * 60
      const z = (Math.random() - 0.5) * 60
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const cgpa = readCgpa().current
    const speed = 0.03 + (Math.max(cgpa, 1) / 10) * 0.05
    ref.current.rotation.x = state.clock.getElapsedTime() * speed
    ref.current.rotation.y = state.clock.getElapsedTime() * speed * 1.3
    const pulse = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.015 + 1
    ref.current.scale.setScalar(pulse)
  })

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  )
}

function OrbFloatyBits() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const orbs = useMemo(() =>
    Array.from({ length: 6 }, () => ({
      pos: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15 - 5
      ] as [number, number, number],
      speed: 0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      radius: 0.8 + Math.random() * 2
    }))
  , [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const cgpa = readCgpa().current
    const intensity = Math.max(0.15, cgpa / 12)

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const orb = orbs[i]
      mesh.position.x = orb.pos[0] + Math.sin(time * orb.speed + orb.phase) * 4
      mesh.position.y = orb.pos[1] + Math.cos(time * orb.speed * 0.6 + orb.phase) * 4
      mesh.position.z = orb.pos[2] + Math.sin(time * orb.speed * 0.4) * 2
      const scale = (0.6 + Math.sin(time * 1.5 + orb.phase) * 0.3) * intensity
      mesh.scale.setScalar(scale)
      const mat = mesh.material as THREE.MeshBasicMaterial
      const hue = cgpa <= 0 ? 0.38 : cgpa <= 5 ? 0.0 : cgpa <= 7 ? 0.12 : cgpa <= 9 ? 0.38 : 0.14
      const target = new THREE.Color().setHSL(hue, 0.5, 0.45)
      mat.color.lerp(target, 0.015)
    })
  })

  return (
    <>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          position={orb.pos}
          ref={(el) => { meshRefs.current[i] = el }}
        >
          <sphereGeometry args={[orb.radius, 12, 12]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.03} />
        </mesh>
      ))}
    </>
  )
}

function GridWobble() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current?.geometry) return
    const cgpa = readCgpa().current
    const positions = ref.current.geometry.attributes.position
    const time = state.clock.getElapsedTime()
    const amplitude = 0.2 + (Math.max(cgpa, 1) / 10) * 0.6

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const wave = Math.sin(x * 0.3 + time * 0.4) * amplitude + Math.cos(y * 0.3 + time * 0.4) * amplitude
      positions.setZ(i, wave)
    }
    positions.needsUpdate = true
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
      <planeGeometry args={[80, 80, 50, 50]} />
      <meshBasicMaterial color="#10b981" wireframe opacity={0.05} transparent />
    </mesh>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <DotCloudThing />
        <OrbFloatyBits />
        <GridWobble />
      </Canvas>
    </div>
  )
}

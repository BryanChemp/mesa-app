import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'

const faceNormals = [
  { number: 1, normal: new THREE.Vector3(0.18, 0.97, 0.14) },
  { number: 2, normal: new THREE.Vector3(-0.22, 0.96, 0.10) },
  { number: 3, normal: new THREE.Vector3(0.30, 0.95, -0.05) },
  { number: 4, normal: new THREE.Vector3(-0.35, 0.93, -0.09) },
  { number: 5, normal: new THREE.Vector3(0.40, 0.91, 0.03) },
  { number: 6, normal: new THREE.Vector3(-0.41, 0.90, -0.02) },
  { number: 7, normal: new THREE.Vector3(0.12, 0.98, -0.15) },
  { number: 8, normal: new THREE.Vector3(-0.14, 0.97, -0.17) },
  { number: 9, normal: new THREE.Vector3(0.25, 0.95, 0.20) },
  { number: 10, normal: new THREE.Vector3(-0.27, 0.94, 0.23) },
  { number: 11, normal: new THREE.Vector3(0.31, 0.93, -0.25) },
  { number: 12, normal: new THREE.Vector3(-0.33, 0.92, -0.27) },
  { number: 13, normal: new THREE.Vector3(0.45, 0.88, 0.14) },
  { number: 14, normal: new THREE.Vector3(-0.47, 0.87, 0.16) },
  { number: 15, normal: new THREE.Vector3(0.51, 0.85, -0.09) },
  { number: 16, normal: new THREE.Vector3(-0.53, 0.84, -0.07) },
  { number: 17, normal: new THREE.Vector3(0.57, 0.82, 0.21) },
  { number: 18, normal: new THREE.Vector3(-0.59, 0.80, 0.19) },
  { number: 19, normal: new THREE.Vector3(0.62, 0.78, -0.12) },
  { number: 20, normal: new THREE.Vector3(-0.64, 0.76, -0.10) }
]

const Dice = ({ roll, onResult }: { roll: boolean; onResult: (n: number) => void }) => {
  const bodyRef = useRef<RapierRigidBody>(null)
  const [stopped, setStopped] = useState(false)

  useEffect(() => {
    if (!roll || !bodyRef.current) return
    const frame = requestAnimationFrame(() => {
      setStopped(false)
      const impulse = {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 12 + 5,
        z: (Math.random() - 0.5) * 10
      }
      const torque = {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20
      }
      bodyRef.current?.applyImpulse(impulse, true)
      bodyRef.current?.applyTorqueImpulse(torque, true)
    })
    return () => cancelAnimationFrame(frame)
  }, [roll])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!bodyRef.current) return
      const lin = bodyRef.current.linvel()
      const ang = bodyRef.current.angvel()
      const isStopped =
        Math.abs(lin.x) < 0.01 &&
        Math.abs(lin.y) < 0.01 &&
        Math.abs(lin.z) < 0.01 &&
        Math.abs(ang.x) < 0.01 &&
        Math.abs(ang.y) < 0.01 &&
        Math.abs(ang.z) < 0.01

      if (isStopped && !stopped) {
        setStopped(true)
        const r = bodyRef.current.rotation()
        const quat = new THREE.Quaternion(r.x, r.y, r.z, r.w)
        let best = null
        let bestDot = -Infinity
        for (const f of faceNormals) {
          const v = f.normal.clone().applyQuaternion(quat)
          const d = v.dot(new THREE.Vector3(0, 1, 0))
          if (d > bestDot) {
            bestDot = d
            best = f.number
          }
        }
        if (best) onResult(best)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [stopped, onResult])

  const geometry = new THREE.IcosahedronGeometry(1, 0)
  const material = new THREE.MeshStandardMaterial({
    color: '#6D5DFB',
    metalness: 0.3,
    roughness: 0.4
  })

  return (
    <RigidBody ref={bodyRef} colliders="hull" restitution={0.6}>
      <mesh geometry={geometry} material={material} />
    </RigidBody>
  )
}

export const DiceScene = ({ roll, onResult }: { roll: boolean; onResult: (n: number) => void }) => {
  return (
    <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[5, 10, 7]} />
      <Physics>
        <RigidBody type="fixed">
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </RigidBody>
        <Dice roll={roll} onResult={onResult} />
      </Physics>
    </Canvas>
  )
}


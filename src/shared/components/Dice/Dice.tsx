import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

type DiceType = 6 | 20

interface DiceSingleProps {
  roll: boolean
  type: DiceType
  onResult: (n: number) => void
  initialPosition: [number, number, number]
}

const generateFaceNormals = (type: DiceType) => {
  if (type === 6) return [
    { number: 1, normal: new THREE.Vector3(0,1,0) },
    { number: 2, normal: new THREE.Vector3(0,-1,0) },
    { number: 3, normal: new THREE.Vector3(1,0,0) },
    { number: 4, normal: new THREE.Vector3(-1,0,0) },
    { number: 5, normal: new THREE.Vector3(0,0,1) },
    { number: 6, normal: new THREE.Vector3(0,0,-1) }
  ]
  if (type === 20) return [
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
  return []
}

const DiceSingle = ({ roll, type, onResult, initialPosition }: DiceSingleProps) => {
  const bodyRef = useRef<RapierRigidBody>(null)
  const faceNormals = useRef(generateFaceNormals(type))
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (!roll || !bodyRef.current) return
    stoppedRef.current = false
    const impulse = { x:(Math.random()-0.5)*2, y:0, z:(Math.random()-0.5)*2 }
    const torque = { x:(Math.random()-0.5)*5, y:(Math.random()-0.5)*5, z:(Math.random()-0.5)*5 }
    bodyRef.current.applyImpulse(impulse,true)
    bodyRef.current.applyTorqueImpulse(torque,true)
  }, [roll])

  useEffect(() => {
    const interval = setInterval(() => {
      if(!bodyRef.current || stoppedRef.current) return
      const lin = bodyRef.current.linvel()
      const ang = bodyRef.current.angvel()
      const isStopped = Math.abs(lin.x)<0.01 && Math.abs(lin.y)<0.01 && Math.abs(lin.z)<0.01 &&
                        Math.abs(ang.x)<0.01 && Math.abs(ang.y)<0.01 && Math.abs(ang.z)<0.01
      if(isStopped){
        stoppedRef.current = true
        const r = bodyRef.current.rotation()
        const quat = new THREE.Quaternion(r.x,r.y,r.z,r.w)
        let best:number|null = null
        let bestDot = -Infinity
        for(const f of faceNormals.current){
          const v = f.normal.clone().applyQuaternion(quat)
          const d = v.dot(new THREE.Vector3(0,1,0))
          if(d>bestDot){ bestDot=d; best=f.number }
        }
        if(best) onResult(best)
      }
    }, 100)
    return ()=>clearInterval(interval)
  }, [onResult])

  const geometry = type===6 ? new THREE.BoxGeometry(1,1,1) : new THREE.IcosahedronGeometry(1,0)
  const material = new THREE.MeshStandardMaterial({ color:'#6D5DFB', metalness:0.3, roughness:0.4 })

  return (
    <RigidBody ref={bodyRef} colliders="hull" restitution={0.6} position={initialPosition}>
      <mesh geometry={geometry} material={material} />
    </RigidBody>
  )
}

interface DiceSceneProps {
  roll: boolean
  diceCount: number
  diceType: DiceType
  onResult: (results:number[])=>void
}

export const DiceScene = ({ roll, diceCount, diceType, onResult }: DiceSceneProps) => {
  const resultsRef = useRef<number[]>(Array(diceCount).fill(0))

  const handleSingleResult = (n:number, i:number)=>{
    resultsRef.current[i]=n
    if(resultsRef.current.filter(Boolean).length===diceCount){
      onResult([...resultsRef.current])
    }
  }

  return (
    <Canvas camera={{ position:[0,12,0], fov:50, up:[0,0,-1] }}>
      <ambientLight intensity={0.5}/>
      <directionalLight intensity={1} position={[5,10,5]}/>
      <Physics gravity={[0,-9.8,0]}>
        <RigidBody type="fixed">
          <mesh position={[0,0,0]}>
            <boxGeometry args={[15,1,15]}/>
            <meshStandardMaterial color="#222"/>
          </mesh>
        </RigidBody>

        {Array.from({length:diceCount}).map((_,i)=>(
          <DiceSingle
            key={i}
            roll={roll}
            type={diceType}
            onResult={(n)=>handleSingleResult(n,i)}
            initialPosition={[Math.random()*10-5, 5 + i*2, Math.random()*10-5]}
          />
        ))}
      </Physics>
    </Canvas>
  )
}

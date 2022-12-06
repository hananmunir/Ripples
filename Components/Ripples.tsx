import React, { useMemo, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BufferAttribute, TextureLoader } from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
type Props = {
  paddingX: Number;
  paddingY: Number;
};
function BufferPoints({ count = 100 }) {
  const ref = useRef(null);

  const SEPARATION = 80,
    AMOUNTX = 50,
    AMOUNTY = 50;

  const numParticles = AMOUNTX * AMOUNTY;

  const position = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);
  let i = 0,
    j = 0;
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      position[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
      position[i + 1] = 0; // y
      position[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

      scales[j] = 1;

      i += 3;
      j++;
    }
  }

  const positionsAttribute = new BufferAttribute(position, 3);
  const scalesAttribute = new BufferAttribute(scales, 1);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      const scales = ref.current.geometry.attributes.scale.array;

      let i = 0,
        j = 0;

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 15 +
            (Math.sin((iy + count) * 0.5) + 1) * 15;

          i += 3;
          j++;
        }
      }

      ref.current.geometry.attributes.position.needsUpdate = true;

      ref.current.geometry.attributes.scale.needsUpdate = true;
      count += 0.045;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          {...positionsAttribute}
        />
        <bufferAttribute attach={"attributes-scale"} {...scalesAttribute} />
      </bufferGeometry>
      <shaderMaterial
        attach={"material"}
        transparent
        depthTest={false}
        uniforms={{
          color: { value: new THREE.Color(0xf1f1f1) },
          scale: { value: 0.1 },
        }}
        vertexShader={`
        attribute float scale;

			void main() {

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = scale * ( 150.0 / - mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}

      `}
        fragmentShader={`
        uniform vec3 color;

			void main() {

				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

				gl_FragColor = vec4( color, 1.0 );

			}
      `}
      />
    </points>
  );
}

const Ripples = (props: Props) => {
  const { paddingX, paddingY } = props;
  return (
    <div className={`h-screen relative px-${paddingX} py-${paddingY} `}>
      <Canvas
        camera={{
          fov: 45,
          near: 1,
          far: 5000,
          position: [0, 500, 1500],
          rotation: [-0.5, 0, 0],
        }}
      >
        <BufferPoints />
      </Canvas>
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(27,27,27,1) 67%, rgba(27,27,27,1) 87%, rgba(0,0,0,0.1) 95%)",
        }}
        className='absolute rounded-2xl left-5 top-10 flex items-start text-left justify-center flex-col w-2/4 h-2/4 py-20 px-20 bg-gradient-to-r from-rgba(27,27,27,1) via-stone-900 to-transparent ... '
      >
        <span className='text-white text-6xl mb-5'>Ripples</span>
        <span className='text-white  w-3/4'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem,
          dolorem dicta earum quod quo dolores repellat aperiam, incidunt
          eligendi nemo quos moles
        </span>
        <button className='border-none bg-red-600 px-8 py-2 text-white mt-3 rounded-md'>
          Explore
        </button>
      </div>
    </div>
  );
};

export default Ripples;

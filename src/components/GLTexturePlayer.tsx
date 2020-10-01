import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { getGroupConfig } from '../groupConfigs'
import { uiStore } from '../stores/UIStore'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  LoadingManager,
  CompressedTexture
} from 'three'

import { KTXLoader } from '../KTXLoader'
import { Button } from './Button'
import { observer } from 'mobx-react-lite'

const material = new MeshBasicMaterial()
const loadingManager = new LoadingManager()
const ktxLoader = new KTXLoader(loadingManager)

const loadTexture = (url: string): Promise<CompressedTexture> =>
  new Promise((resolve, reject) => {
    ktxLoader.load(
      url,
      texture => {
        resolve(texture)
      },
      undefined,
      ev => {
        reject(ev)
      }
    )
  })

export const GLTexturePlayer = observer(() => {
  const groupConfig = getGroupConfig('texture')!
  const { store } = groupConfig
  const { requests } = store
  const { glTextureFormat } = uiStore
  const [textureIndex, setTextureIndex] = useState(0)
  const sceneContainerEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // === THREE.JS CODE START ===
    const scene = new Scene()
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new WebGLRenderer()
    renderer.setSize(280, 280)
    sceneContainerEl.current!.appendChild(renderer.domElement)

    const geometry = new BoxGeometry(1, 1, 1)
    const cube = new Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 2

    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()
  }, [])

  useEffect(() => {
    loadTexture(requests[textureIndex].url).then(texture => {
      material.map = texture
      material.needsUpdate = true
    })
  }, [textureIndex])

  const handleNextTexture = () => {
    if (textureIndex < requests.length - 1) {
      setTextureIndex(textureIndex + 1)
    } else {
      setTextureIndex(0)
    }
  }

  const handlePrevTexture = () => {
    if (textureIndex > 0) {
      setTextureIndex(textureIndex - 1)
    } else {
      setTextureIndex(requests.length - 1)
    }
  }

  return (
    <Container>
      <Format>
        Format: <span>{glTextureFormat}</span>
      </Format>

      <SceneContainer ref={sceneContainerEl}></SceneContainer>
      <PrevButton onClick={handlePrevTexture}>Prev</PrevButton>
      <NextButton onClick={handleNextTexture}>Next</NextButton>
    </Container>
  )
})

const Container = styled.div`
  width: 100%;
  height: 280px;
`

const Format = styled.div`
  color: #888;
  text-transform: uppercase;
  font-size: 11px;

  > span {
    color: orange;
  }
`

const PrevButton = styled(Button)`
  position: absolute;
  margin: 16px;
  bottom: 0;
  left: 0;
`
const NextButton = styled(Button)`
  position: absolute;
  margin: 16px;
  bottom: 0;
  right: 0;
`

const SceneContainer = styled.div``

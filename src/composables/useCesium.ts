import { shallowRef, type ShallowRef } from 'vue'
import * as Cesium from 'cesium'

let viewer: ShallowRef<Cesium.Viewer | null> | null = null

export function useCesium() {
  if (!viewer) {
    viewer = shallowRef<Cesium.Viewer | null>(null)
  }

  const initCesium = async (container: HTMLElement) => {
    if (viewer!.value && !viewer!.value.isDestroyed()) {
      viewer!.value.destroy()
    }
    viewer!.value = null

    const isElectron = typeof window !== 'undefined' && (window as any).electronAPI

    const baseOptions: any = {
      animation: false,
      baseLayer: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: true,
      timeline: false,
      navigationHelpButton: false
    }

    try {
      let lastError: any = null
      const strategies = isElectron
        ? [
            () => new Cesium.Viewer(container, baseOptions),
            () =>
              new Cesium.Viewer(container, {
                animation: false,
                baseLayer: false,
                timeline: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                navigationHelpButton: false
              }),
            () =>
              new Cesium.Viewer(container, {
                animation: false,
                baseLayer: false,
                timeline: false
              })
          ]
        : [() => new Cesium.Viewer(container, baseOptions)]

      for (let i = 0; i < strategies.length; i += 1) {
        try {
          viewer!.value = strategies[i]()
          break
        } catch (error: any) {
          lastError = error
          if (i < strategies.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      }

      if (!viewer!.value) {
        throw lastError || new Error('Failed to initialize Cesium')
      }
    } catch (error) {
      console.error('[Cesium] Failed to create viewer:', error)
      throw error
    }

    viewer!.value.resolutionScale = 1

    const creditContainer = (viewer!.value as any)._cesiumWidget?._creditContainer
    if (creditContainer) {
      creditContainer.style.display = 'none'
    }

    if (viewer!.value.scene.skyBox) {
      viewer!.value.scene.skyBox.show = true
    }

    viewer!.value.scene.backgroundColor = Cesium.Color.fromCssColorString('#000510')
    viewer!.value.scene.globe.enableLighting = false
    viewer!.value.scene.globe.showGroundAtmosphere = true

    const terrainProvider = await Cesium.createWorldTerrainAsync({
      requestVertexNormals: true
    })
    viewer!.value.terrainProvider = terrainProvider
    viewer!.value.scene.verticalExaggeration = 1.5

    const imagery = viewer!.value.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri'
      })
    )
    imagery.alpha = 1

    const overlay = viewer!.value.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri'
      })
    )
    overlay.alpha = 0.5

    if (viewer!.value.scene.sun) viewer!.value.scene.sun.show = false
    if (viewer!.value.scene.moon) viewer!.value.scene.moon.show = false
    viewer!.value.scene.fog.enabled = false

    const controller = viewer!.value.scene.screenSpaceCameraController
    controller.minimumZoomDistance = 5000000
    controller.maximumZoomDistance = 80000000
    controller.enableCollisionDetection = false

    viewer!.value.camera.percentageChanged = 0.01

    return viewer!.value
  }

  const getViewer = () => viewer?.value ?? null

  return {
    viewer: viewer as ShallowRef<Cesium.Viewer | null>,
    initCesium,
    getViewer
  }
}

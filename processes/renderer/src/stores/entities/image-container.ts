import { makeAutoObservable } from 'mobx'

import { objectKeys, objectLength, objectValues } from 'shared/lib/objects'

export type ImageContainerOptions = {
  loadImmediately?: boolean
}

export type ImageSrcs = { [imageName: string]: string }

type ImageList<Srcs extends ImageSrcs> = Record<
  keyof Srcs,
  { isLoaded: boolean; imageElement: HTMLImageElement }
>

export class ImageContainer<Srcs extends ImageSrcs> {
  private srcs: Srcs

  list: ImageList<Srcs> = {} as ImageList<Srcs>

  constructor(imageSrcs: Srcs, options?: ImageContainerOptions) {
    const { loadImmediately = false } = options ?? {}

    this.srcs = imageSrcs
    this.createImageList()

    if (loadImmediately) {
      this.loadAll()
    }

    makeAutoObservable(this)
  }

  private createImageList = (): void => {
    this.list = objectKeys(this.srcs).reduce((acc, imageName) => {
      acc[imageName] = { isLoaded: false, imageElement: new Image() }
      return acc
    }, {} as ImageList<Srcs>)
  }

  loadImage = (imageName: keyof Srcs): Promise<void> => {
    return new Promise((resolve) => {
      this.list[imageName].imageElement.addEventListener('load', () => {
        this.list[imageName].isLoaded = true
        resolve()
      })
      this.list[imageName].imageElement.src = this.srcs[imageName]
    })
  }

  loadAll = (): Promise<void> => {
    return new Promise((resolve) => {
      const promises: Array<Promise<void>> = Array(objectLength(this.list))
      objectKeys(this.list).forEach((imageName) => {
        promises.push(this.loadImage(imageName))
      })

      Promise.all(promises).then(() => {
        resolve()
      })
    })
  }

  get isAllImagesLoaded(): boolean {
    return objectValues(this.list).every((image) => image.isLoaded)
  }
}

import { makeAutoObservable } from 'mobx'

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
    this.list = (Object.keys(this.srcs) as Array<keyof Srcs>).reduce((acc, imageName) => {
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
      const promises: Array<Promise<void>> = []
      ;(Object.keys(this.list) as Array<keyof typeof this.list>).forEach((imageName) => {
        promises.push(this.loadImage(imageName))
      })

      Promise.all(promises).then(() => {
        resolve()
      })
    })
  }

  get isAllImagesLoaded(): boolean {
    return Object.values(this.list).every((image) => image.isLoaded)
  }
}

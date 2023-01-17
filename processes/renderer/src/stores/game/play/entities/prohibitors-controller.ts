export class ProhibitorsController {
  list: Array<string> = []

  add = (prohibitor: string): void => {
    this.list.push(prohibitor)
  }

  remove = (prohibitor: string): void => {
    this.list = this.list.filter((p) => p !== prohibitor)
  }

  get isProhibited(): boolean {
    return this.list.length > 0
  }
}

import { remove } from 'shared/lib/arrays';

export class ProhibitorsController {
  list: Array<string> = [];

  add = ( prohibitor: string ): void => {
    this.list.push( prohibitor );
  };

  remove = ( prohibitor: string ): void => {
    this.list = remove( this.list, prohibitor );
  };

  get isProhibited(): boolean {
    return this.list.length > 0;
  }
}

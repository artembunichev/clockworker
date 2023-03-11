type MarketConfig = {
  name: string;
};

export class Market {
  name: string;

  constructor( config: MarketConfig ) {
    const { name } = config;
    this.name = name;
  }
}

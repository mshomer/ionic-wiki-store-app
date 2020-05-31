export class Product {
  public id: string;
  constructor(
    public title: string,
    public description: string,
    public price: number,
    public category: string,
    public indoors: boolean,
    public outdoors: boolean,
    public imageUrl: string
  ) {}
}

class Payment {
  public name: string;
  public currency: string;
  public cost: number;
  public url_image: string;
  public date: Date;

  constructor(
    name: string,
    currency: string,
    cost: number,
    url_image: string,
    date: Date
  ) {
    this.name = name;
    this.currency = currency;
    this.cost = cost;
    this.url_image = url_image;
    this.date = date || new Date();
  }
}

export default Payment;
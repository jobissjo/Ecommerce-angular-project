export interface Product{
    name:string,
    price:string,
    color:string,
    category:string,
    description:string,
    image:string,
    id:number,
    sellerId?:number,
    quantity?:number,
    productId?:number,
}
export interface Cart {
    name:string,
    price:string,
    color:string,
    category:string,
    description:string,
    image:string,
    id?:number,
    sellerId?:number,
    quantity?:number,
    productId:number,
    userId:number,
}
export interface PriceSummary{
    price:number,
    discount:number,
    tax:number,
    delivery:number,
    total:number,
}
export interface Order{
    email:string,
    contact:string,
    address:string,
    totalPrice:number,
    userId:number,
    id?:number
}
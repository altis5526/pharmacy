export interface RoomMapping {
  [roomId: number]: string;
}
export interface DeliveryInfo {
  selectedDeliveryArea: string;
  selectedPayMethod: string;
  selectedDeliveryMethod: string;
  memberName: string;
  memberPhone: string;
  selectedInvoiceType: string;
}
export interface OrderList{
  orderId:string;
  startTime:string;
  confirmTime:string;
  deliverTime:string;
  arriveTime:string;
  completeTime:string;
  item:number[][];
  totalAmount:string;
  status:string;
  shipMethod:string;
  payMethod:string;
}
export interface ManagerOrderList{
  userId:string;
  orderId:string;
  item:number[][];
  startTime:string;
  totalAmount:string;
  phone:string;
  shipMethod:string;
  payMethod:string;
  status:string;
}
export interface User {
  phone: string;
  name: string;
  password: string;
  id:string;
  email:string;
  shop_list:number[][];
  room_id: RoomMapping[];
  deliver_info:DeliveryInfo;
  order_list:OrderList[];
}
export interface Producer{
  name: string;
  password: string;
  id: string;
  room_id: RoomMapping[];
  order_list:ManagerOrderList[];
}
export interface Product {
  name: string;
  description: string;
  id:string;
  image:string;
  price:{ spec: string; value: string }[];
  store_id:string;
  ad:string[][];
  Spec: { name: string; value: string }[];
  Comment: { name: string; value: string }[];
}
export interface storeInfo {
  name: string;
  location: string;
  product_rate: string;
  respond_rate: string;
  id: string;
  image: string;
}
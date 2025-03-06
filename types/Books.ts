import { User } from "firebase/auth";

export interface CustomUser extends User {
  photoURLCustom?: string;
}

export default interface Book {
  _id?: string;
  title: string;
  author?: string;
  description?: string;
  price?: number;
  condition: "new" | "excellent" | "good" | "fair" | "old";
  categories?: string[];
  location: {
    type: "Point";
    coordinates: [number, number];
    dataOrigin?: string;
    placeId?: string;
    googleMapUrl?: string;
    boundingBox?: any;
    address?: string;
    address2?: string;
    addressResponse?: any;
    pincode?: string;
  };
  seller: string;
  sellerData?: CustomUser;
  images: string[];
  isSold?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

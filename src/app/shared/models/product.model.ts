export interface Product {
  _id?: string;          // Mongo id
  id?: number;           // optional legacy numeric id
  name: string;
  price: number;
  img?: string;          // you used "img" in seed
  image?: string;        // some rows had "image" – keep both
  cat?: string;
  category?: string;     // some rows had "category"
  desc?: string;
  description?: string;  // some rows had "description"
  uses?: string[];
  featured?: boolean;
  stock?: number;
  tag?: string;
}

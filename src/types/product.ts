
export interface Product {
    id: string;
    barcode: string;
    name: string;
    brand: string;
    weight: string;
    mrp: number;
    discount: number;
    price: number;
    category: string;
    imageUrl: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// DTO for fetching movies with showtimes for ticket selection (Step 0)
export interface MovieShowtimeDTO {
  _id: string;
  title: string;
  poster_url: string;
  showtimes: {
    _id: string;
    showtime: string; // ISO date string
    price: number;
    cinema_id: string;
    room_id: string;
  }[];
}

// DTO for fetching products for product selection (Step 2)
export interface ProductDTO {
  _id: string;
  name: string;
  price: number;
  image: string; // URL to product image
  type: string; // e.g., "Food", "Drink", "Combo"
}

// DTO for fetching customers for customer information (Step 3)
export interface CustomerDTO {
  _id: string;
  full_name: string;
  phone: string;
  email?: string;
}

export interface BuyingTicketDTO {
  movies: MovieShowtimeDTO[];
  products: ProductDTO[];
  customers: CustomerDTO[];
}

// DTO for creating an order (Step 4 - Payment)
export interface CreateOrderDTO {
  total_price: number;
  user_id?: string; // Optional for guest orders
  email?: string; // Required for guest orders
  payment_method: string; // "cash", "card", "momo", "banking"
  discount_id?: string | null;
  amount: number;
  products: {
    product_id: string;
    quantity: number;
  }[];
  tickets: {
    showtime_id: string;
    price: number;
    seats: {
      seat_id: string;
    }[];
  };
}

// DTO for the response after creating an order (Step 5 - Print Ticket)
export interface OrderResponseDTO {
  order_id: string;
  pdf_url?: string; // URL to generated PDF ticket
  success: boolean;
  message?: string;
}

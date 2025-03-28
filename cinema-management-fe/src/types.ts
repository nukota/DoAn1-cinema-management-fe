export type UserType = {
  user_id: number;
  fullname: string;
  email: string;
  phone: string;
  password_hash: string;
  dob: string;
  cccd: string;
  role: "employee" | "admin" | "customer";
  created_at: string;
};

export type EmployeeType = UserType & {
  employee_id: number;
  cinema_id: number;
  position: string;
  shift: string;
};

export type CinemaType = {
  cinema_id: number;
  name: string;
  address: string;
};

export type MovieType = {
  movie_id: number;
  status: "Stopped" | "Unknown" | "Now Playing" | "Coming Soon";
  name: string;
  poster: string;
  genre: string;
  duration: string;
  nation: string;
  ageLimit: number;
  releaseDate: string;
  director: string;
  cast: string[];
  description: string;
  rating: number;
  trailer: string;
};

export type ProductType = {
  product_id: number;
  image: string;
  name: string;
  description?: string;
  price: number;
  type: string;
};

export type RoomType = {
  room_id: number;
  cinema_id: number;
  name: string;
  seat_count: number;
  repairing: boolean;
};

export type ShowtimeType = {
  showtime_id: string;
  cinema_id: number;
  movie_id: number;
  showtime: string;
};

export type SeatType = {
  room_id: number;
  seat_id: string;
  column: number;
};

export type TicketType = {
  ticket_id: number;
  showtime_id: number;
  seat_id: string;
  order_id: number;
};

export type OrderType = {
  order_id: number;
  user_id: number;
  total_price: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
};

export type PaymentType = {
  payment_id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: "pending" | "completed" | "cancelled";
  discount_id: number;
  paid_at: string;
};

export type OrderProductType = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export type DiscountType = {
  discount_id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  value: number;
  min_purchase: number;
  expiry_date: string;
};

export type ReviewType = {
  review_id: number;
  user_id: number;
  showtime_id: number;
  rating: number;
  comment: string;
  created_at: string;
};

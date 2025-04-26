export type UserType = {
  _id: string;
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
  employee_id: string;
  cinema_id: string;
  position: string;
  shift: string;
};

export type CinemaType = {
  _id: string;
  name: string;
  address: string;
};

export type MovieType = {
  _id: string;
  status: "Stopped" | "Unknown" | "Now Playing" | "Coming Soon";
  title: string;
  poster_url: string;
  genre: string[];
  duration: number;
  country: string;
  age_limit: number;
  release_date: string;
  director: string;
  actors: string[];
  description: string;
  rating: number;
  trailer_url: string;
};

export type ProductType = {
  _id: string;
  image: string;
  name: string;
  price: number;
  category: string;
};

export type RoomType = {
  _id: string;
  name: string;
  seat_count: number;
  cinema: {
    cinema_id: string;
    name: string;
  };
};

export type ShowtimeType = {
  _id: string;
  room_id: string;
  movie_id: string;
  showtime: string;
  price: number;
};

export type SeatType = {
  room_id: string;
  _id: string;
  seat_column: number;
  seat_name: string;
};

export type TicketType = {
  _id: string;
  showtime_id: string;
  seat_id: string;
  order_id: string;
};

export type OrderType = {
  _id: string;
  user_id: string;
  total_price: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
};

export type PaymentType = {
  _id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  status: "pending" | "completed" | "cancelled";
  discount_id: string;
  paid_at: string;
};

export type OrderProductType = {
  order_id: string;
  product_id: string;
  quantity: number;
};

export type DiscountType = {
  _id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  value: number;
  min_purchase: number;
  expiry_date: string;
};

export type ReviewType = {
  _id: string;
  user_id: string;
  showtime_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

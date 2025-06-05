export type UserType = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  dateOfBirth: string;
  cccd: string;
  role: "employee" | "admin" | "customer";
  created_at: string;
};

export type EmployeeType = UserType & {
  employee_id: string;
  cinema_id?: string;
  cinema?: {
    cinema_id: string;
    name: string;
  };
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
  showtimes?: {
    _id: string;
    room_id: string;
    movie_id: string;
    showtime: string;
    price: number;
  }[];
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

export type RoomWithSeatsType = {
  _id: string;
  name: string;
  cinema_id: string;
  seats: { seat_name: string; seat_column: number }[];
};

export type ShowtimeType = {
  _id: string;
  room: {
    room_id: string;
    name: string;
  };
  room_id: string;
  movie: {
    movie_id: string;
    title: string;
  };
  showtime: string;
  price: number;
};

export type SeatType = {
  room_id: string;
  _id: string;
  seat_column: number;
  seat_name: string;
  available?: boolean;
};

export type TicketType = {
  _id: string;
  showtime_id: string;
  seat_id: string;
  order_id: string;
};

export type OrderType = {
  _id: string;
  ordercode: string;
  user_id: string;
  total_price: number;
  status: "pending" | "paid" | "cancelled";
  ordered_at: string;
  ticketCount?: number;
  productCount?: number;
  tickets?: {
    title: string; //movie tiltle
    showtime: string; //date time
    price: number; //price of each ticket
    seats: { seat_id: string; seat_name: string }[];
  };
  products?: {
    product_id: string;
    name: string;
    quantity: number;
  }[];
};

export type PaymentType = {
  _id: string;
  order?: {
    order_id: string;
    total_price: number;
  };
  amount: number;
  payment_method: string;
  discount?: {
    discount_id: string;
    code: string;
  };
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
  max_usage: number;
  expiry_date: string;
};

export type ReviewType = {
  _id?: string;
  user_id: string;
  movie_id: string;
  rating: number;
  comment: string;
  created_at?: string;
};

export type SettingType = {
  _id: string;
  min_ticket_price: number;
  max_ticket_price: number;
  min_product_price: number;
  max_product_price: number;
  close_time: string;
  open_time: string;
  time_gap: number;
  employee_min_age: number;
  employee_max_age: number;
  reservation_time: number;
  __v: number;
};

export type MovieRevenueType = {
  date: string;
  ticketRevenue: number;
  ticketCount: number;
};

export type PrductRevenueType = {
  date: string;
  productRevenue: number;
  productCount: number;
};

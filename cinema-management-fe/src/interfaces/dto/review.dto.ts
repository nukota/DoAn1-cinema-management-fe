export interface GetReviewDTO {
  _id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    user_id: string;
    full_name: string;
    email: string;
  };
  movie: {
    movie_id: string;
    title: string;
  };
}
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { ReviewType } from "../interfaces/types";

// Move baseURL to module scope
const baseURL = import.meta.env.VITE_API_BASE_URL;

interface ReviewsContextType {
  reviews: ReviewType[];
  fetchReviewsData: () => Promise<void>;
  createReview: (newReview: ReviewType) => Promise<void>;
  updateReview: (updatedReview: ReviewType) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getReviewsByMovieId: (movieId: string) => Promise<ReviewType[]>;
  loading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviewsData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/review`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(response.data);
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(async (newReview: ReviewType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/review`, newReview, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const createdReview = response.data;
      setReviews((prevReviews) => [...prevReviews, createdReview]);
    } catch (error: any) {
      console.error("Failed to create review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReview = useCallback(async (updatedReview: ReviewType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${baseURL}/review/${updatedReview._id}`,
        updatedReview,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response.data;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedData._id ? updatedData : review
        )
      );
    } catch (error: any) {
      console.error("Failed to update review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error: any) {
      console.error("Failed to delete review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReviewsByMovieId = useCallback(
    async (movieId: string): Promise<ReviewType[]> => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${baseURL}/review/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (error: any) {
        console.error("Failed to fetch reviews by movieId:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        fetchReviewsData,
        createReview,
        updateReview,
        deleteReview,
        getReviewsByMovieId,
        loading,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};

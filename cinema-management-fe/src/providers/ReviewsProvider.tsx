import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { ReviewType } from "../interfaces/types";

interface ReviewsContextType {
  reviews: ReviewType[];
  fetchReviewsData: () => Promise<void>;
  createReview: (newReview: ReviewType) => Promise<void>;
  updateReview: (updatedReview: ReviewType) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  loading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/review`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching reviews failed.");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createReview = useCallback(async (newReview: ReviewType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating review failed.");
      }
      const createdReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, createdReview]);
    } catch (error) {
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
      const response = await fetch(`${baseURL}/review/${updatedReview._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReview),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Updating review failed.");
      }
      const updatedData = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedData._id ? updatedData : review
        )
      );
    } catch (error) {
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
      const response = await fetch(`${baseURL}/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Deleting review failed.");
      }
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId)
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        fetchReviewsData,
        createReview,
        updateReview,
        deleteReview,
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
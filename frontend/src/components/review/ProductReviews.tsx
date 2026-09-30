"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import { ApiError } from "@/lib/api";
import { createProductReview } from "@/services/review-service";
import { useAuthStore } from "@/store/auth-store";

import type { Review } from "@/types/review";


interface ProductReviewsProps {
  productId: number;
  initialReviews: Review[];
}


export default function ProductReviews({
  productId,
  initialReviews,
}: ProductReviewsProps) {
  const token = useAuthStore(
    (state) => state.token,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const [reviews, setReviews] =
    useState(initialReviews);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || user?.role !== "CUSTOMER") {
      setMessage(
        "Please sign in with a customer account to submit a review.",
      );

      return;
    }

    const cleanComment = comment.trim();

    if (cleanComment.length < 3) {
      setMessage(
        "Please write at least 3 characters.",
      );

      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const review =
        await createProductReview(
          token,
          productId,
          {
            rating,
            comment: cleanComment,
          },
        );

      setReviews(
        (currentReviews) => [
          review,
          ...currentReviews,
        ],
      );

      setRating(5);
      setComment("");
      setMessage(
        "Thank you. Your review has been added.",
      );
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "The review could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-20">
      <div
        className="
          grid
          grid-cols-1
          gap-10
          lg:grid-cols-[minmax(0,1fr)_360px]
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-semibold
              text-gray-800
            "
          >
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-6 text-gray-500">
              No reviews yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                  "
                >
                  <div className="text-lg text-rose-500">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-200">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700">
                    {review.comment}
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      items-center
                      gap-2
                      text-sm
                    "
                  >
                    <span className="font-medium text-gray-900">
                      {review.customer_name}
                    </span>

                    {review.verified_purchase && (
                      <span
                        className="
                          rounded-full
                          bg-emerald-50
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-emerald-700
                        "
                      >
                        Verified purchase
                      </span>
                    )}

                    <span className="text-gray-400">
                      {new Date(
                        review.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            h-fit
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            p-5
          "
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Write a review
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Reviews are available after a delivered order.
          </p>

          <label
            htmlFor="review-rating"
            className="
              mt-5
              block
              text-sm
              font-medium
              text-gray-700
            "
          >
            Rating
          </label>

          <select
            id="review-rating"
            value={rating}
            onChange={(event) =>
              setRating(
                Number(event.target.value),
              )
            }
            className="
              mt-2
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
            "
          >
            <option value={5}>5 stars</option>
            <option value={4}>4 stars</option>
            <option value={3}>3 stars</option>
            <option value={2}>2 stars</option>
            <option value={1}>1 star</option>
          </select>

          <label
            htmlFor="review-comment"
            className="
              mt-4
              block
              text-sm
              font-medium
              text-gray-700
            "
          >
            Review
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            maxLength={1000}
            rows={5}
            placeholder="How was the product?"
            className="
              mt-2
              w-full
              resize-y
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
            "
          />

          {message && (
            <p className="mt-3 text-sm text-gray-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="
              mt-5
              w-full
              rounded-lg
              bg-rose-600
              px-4
              py-3
              font-medium
              text-white
              transition
              hover:bg-rose-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting
              ? "Submitting..."
              : "Submit review"}
          </button>
        </form>
      </div>
    </section>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";

import { ApiError } from "@/lib/api";
import {
  getAdminReviews,
  updateAdminReviewVisibility,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";

import type {
  AdminReview,
} from "@/types/admin";


type VisibilityFilter =
  | ""
  | "visible"
  | "hidden";


export default function AdminReviewsPage() {
  const token = useAuthStore(
    (state) => state.token,
  );

  const [reviews, setReviews] =
    useState<AdminReview[]>([]);

  const [visibility, setVisibility] =
    useState<VisibilityFilter>("");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const loadReviews = useCallback(
    async (
      accessToken: string,
      cancelled?: () => boolean,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const result =
          await getAdminReviews(
            accessToken,
            {
              page,
              visibility:
                visibility || undefined,
            },
          );

        if (!cancelled?.()) {
          setReviews(result.items);
          setTotal(result.total);
          setTotalPages(
            result.total_pages,
          );

          if (page !== result.page) {
            setPage(result.page);
          }
        }
      } catch (requestError) {
        if (!cancelled?.()) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load reviews.",
          );
        }
      } finally {
        if (!cancelled?.()) {
          setIsLoading(false);
        }
      }
    },
    [
      page,
      visibility,
    ],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    void loadReviews(
      token,
      () => cancelled,
    );

    return () => {
      cancelled = true;
    };
  }, [
    token,
    loadReviews,
  ]);

  async function changeVisibility(
    review: AdminReview,
  ) {
    if (!token) {
      return;
    }

    setUpdatingId(review.id);
    setError(null);

    try {
      await updateAdminReviewVisibility(
        token,
        review.id,
        !review.is_visible,
      );

      await loadReviews(token);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the review.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Reviews
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {total} customer reviews
          </p>
        </div>

        <select
          value={visibility}
          onChange={(event) => {
            setVisibility(
              event.target.value as VisibilityFilter,
            );
            setPage(1);
          }}
          className="
            border
            border-gray-300
            bg-white
            px-4
            py-2
            text-sm
          "
        >
          <option value="">
            All reviews
          </option>

          <option value="visible">
            Visible
          </option>

          <option value="hidden">
            Hidden
          </option>
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="
            mt-5
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <div
          className="
            mt-6
            border
            border-gray-200
            bg-white
            p-6
            text-sm
            text-gray-500
          "
        >
          No reviews found.
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="
                  border
                  border-gray-200
                  bg-white
                  p-5
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <Link
                      href={`/product/${review.product_id}`}
                      className="
                        font-semibold
                        text-gray-900
                        hover:text-pink-700
                      "
                    >
                      {review.product_name}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {review.customer_name}
                      {" · "}
                      Order #{review.order_id}
                      {" · "}
                      {new Date(
                        review.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={
                      review.is_visible
                        ? "text-sm font-medium text-green-700"
                        : "text-sm font-medium text-red-600"
                    }
                  >
                    {review.is_visible
                      ? "Visible"
                      : "Hidden"}
                  </span>
                </div>

                <div className="mt-4 text-rose-500">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-200">
                    {"★".repeat(
                      5 - review.rating,
                    )}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {review.comment}
                </p>

                <button
                  type="button"
                  disabled={
                    updatingId === review.id
                  }
                  onClick={() =>
                    void changeVisibility(
                      review,
                    )
                  }
                  className="
                    mt-4
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
                    disabled:opacity-50
                  "
                >
                  {updatingId === review.id
                    ? "Updating..."
                    : review.is_visible
                      ? "Hide review"
                      : "Restore review"}
                </button>
              </article>
            ))}
          </div>

          <div
            className="
              mt-6
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
            "
          >
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                  )
                }
                className="
                  border
                  bg-white
                  px-4
                  py-2
                  text-sm
                  disabled:opacity-40
                "
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages,
                        current + 1,
                      ),
                  )
                }
                className="
                  border
                  bg-white
                  px-4
                  py-2
                  text-sm
                  disabled:opacity-40
                "
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

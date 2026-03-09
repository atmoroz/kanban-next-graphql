import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, isErrorLike } from "@apollo/client/errors";
import { showErrorToast } from "@/shared/lib/toast";

export const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const first = error.errors[0];
    const unauthorized = first?.extensions?.code === "UNAUTHORIZED";
    const message = first?.message ?? "Something went wrong while processing the request";
    showErrorToast(message);
    if (unauthorized) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }, 1000);
      return;
    }

    return;
  }

  if (isErrorLike(error)) {
    showErrorToast("Network error. Please try again.");
  }
});

// Success feedback via meta.successMessage on mutation context
import { ApolloLink, Observable } from "@apollo/client";
import { showSuccessToast } from "@/shared/lib/toast";

export const feedbackLink = new ApolloLink((operation, forward) => {
  const meta = operation.getContext()?.meta as
    | {
        successMessage?: string;
      }
    | undefined;

  if (!forward) {
    return new Observable((observer) => observer.complete());
  }

  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (result) => {
        if (!result.errors && meta?.successMessage) {
          showSuccessToast(meta.successMessage);
        }
        observer.next(result);
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => sub.unsubscribe();
  });
});

Refactor the TaskActivityList infinite scroll implementation to use IntersectionObserver instead of a scroll event listener.

Goals:

- Remove the onScroll handler logic.
- Use IntersectionObserver to trigger loading more activities.
- Prevent duplicate requests.
- Keep the existing Apollo pagination logic.

Steps:

1. Remove the scroll listener.

In TaskActivityList.tsx remove:

- LOAD_MORE_THROTTLE_MS
- lastLoadMoreRef
- handleScroll function
- onScroll prop on the <ul>

---

2. Create a loadMoreRef element.

Inside the component add:

const loadMoreRef = useRef<HTMLDivElement | null>(null);

---

3. Add a useEffect with IntersectionObserver.

Add this logic inside the component:

useEffect(() => {
if (!hasMore || !onLoadMore) return;

const element = loadMoreRef.current;
if (!element) return;

const observer = new IntersectionObserver(
(entries) => {
const firstEntry = entries[0];

      if (firstEntry.isIntersecting) {
        onLoadMore();
      }
    },
    {
      root: element.closest("ul"),
      rootMargin: "40px",
      threshold: 0.1,
    }

);

observer.observe(element);

return () => observer.disconnect();
}, [hasMore, onLoadMore]);

---

4. Add a sentinel element at the bottom of the list.

Inside the <ul> after rendering activities add:

{hasMore && <li ref={loadMoreRef} className="h-1" />}

This sentinel element will trigger the observer when it becomes visible.

---

5. Prevent duplicate requests.

Ensure TaskActivityList checks loading flags before triggering:

if (!hasMore || !onLoadMore || isLoading || isLoadingMore) return;

This should be checked inside the IntersectionObserver callback.

---

6. Keep the existing loading UI.

Keep:

{isLoadingMore && (

  <li className="py-1 text-[11px] text-muted-foreground">Loading more…</li>
)}

---

7. Do NOT modify:

- GraphQL query
- Apollo client
- useTaskActivities hook

Only update the UI component that implements infinite scroll.

Goal:
Replace scroll-based loading with IntersectionObserver-based infinite scroll.

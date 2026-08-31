import { toast } from "sonner";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/common/StarRating";
import { useAllReviews, useUpdateReview } from "@/hooks/useContent";
import { formatDate } from "@/lib/booking";
import { cn } from "@/lib/utils";

const statusStyle = {
  pending: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

export default function AdminReviews() {
  const { data: reviews = [], isLoading } = useAllReviews();
  const update = useUpdateReview();

  const sorted = [...reviews].sort((a, b) => (a.status === "pending" ? -1 : 1));

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">Approve guest reviews before they appear publicly.</p>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          sorted.map((r) => (
            <div key={r.id} className="border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{r.guestName}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize", statusStyle[r.status])}>
                      {r.status}
                    </span>
                  </div>
                  <StarRating value={r.rating} className="mt-2" showValue />
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
              </div>
              {r.title ? <p className="mt-3 font-serif text-lg">"{r.title}"</p> : null}
              <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
              {r.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="gold"
                    onClick={async () => {
                      await update.mutateAsync({ id: r.id, patch: { status: "approved" } });
                      toast.success("Review approved");
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await update.mutateAsync({ id: r.id, patch: { status: "rejected" } });
                      toast.success("Review rejected");
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

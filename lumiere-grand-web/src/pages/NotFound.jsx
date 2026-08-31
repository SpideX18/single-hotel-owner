import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-4xl">Page not found</h1>
        <Button asChild variant="gold" className="mt-8">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

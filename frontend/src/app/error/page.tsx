import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh] py-10 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-300">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Sorry, there was an unexpected error.
        <br />
        Please try again or{" "}
        <a
          href="mailto:forwardhj1819@gmail.com"
          className="underline text-blue-600 hover:text-blue-800"
        >
          contact support
        </a>
        .
      </p>
      <Button asChild className="w-40 bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-lg border border-gray-300 shadow-sm transition" variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}

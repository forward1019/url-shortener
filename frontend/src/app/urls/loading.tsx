import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <h1 className="text-4xl font-bold text-center">URLs List</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
          View all URLs
        </p>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Shortened URLs</CardTitle>
            <CardDescription>
              A list of all URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

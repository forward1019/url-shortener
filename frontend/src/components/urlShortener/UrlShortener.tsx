"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { shortenUrlSchema } from "../../lib/schemas/shortenUrlschema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { shortenGuestUrl, shortenUserUrl, ShortenUrlRequest, ShortenedUrlResponse } from "@/lib/api";
import { FiLink, FiExternalLink } from 'react-icons/fi';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { get } from "http";

type Maybe<T> = T | null;
type ShortenFormData = {
  originalUrl: string;
  shortSlug?: string | null;
};

interface UrlShortenerProps {
  onShortenSuccess?: () => void;
}

export default function UrlShortener({ onShortenSuccess }: UrlShortenerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showShortUrl, setShowShortUrl] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const form = useForm({
    resolver: yupResolver(shortenUrlSchema),
    mode: "onBlur",
    defaultValues: {
      originalUrl: "",
      shortSlug: "",
    }
  });

  useEffect(() => {
    if (shortUrl) {
      setShowShortUrl(true);
    }
  }, [shortUrl]);

  const onSubmit = async (data: ShortenFormData) => {
    setServerError("");
    setSuccessMessage("");
    setIsLoading(true);
    setShowShortUrl(false);

    try {
      let result;
      if (isAuthenticated && token) {
        const payload: ShortenUrlRequest = data.shortSlug
          ? { originalUrl: data.originalUrl, shortSlug: data.shortSlug }
          : { originalUrl: data.originalUrl };
        result = await shortenUserUrl(payload, token);
      } else {
        result = await shortenGuestUrl({ originalUrl: data.originalUrl });
      }
      // @ts-ignore
      if (result && result.data) {
        // @ts-ignore
        setShortUrl(result.data.shortUrl);
        // @ts-ignore
        setOriginalUrl(result.data.originalUrl);
        if (onShortenSuccess) onShortenSuccess();
        setSuccessMessage("URL shortened successfully!");
        setShowShortUrl(true);
      } else {
        throw new Error("No short URL received from server");
      }
    } catch (error) {
      setSuccessMessage("");
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      console.error("Error shortening URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    toast.success("URL copied to clipboard!");
  };

  const handleLinkClick = () => {
    if (!shortUrl) {
      console.error("No short URL to open");
      return;
    }
    window.open(shortUrl, '_blank');
  };

  return (
    <div className="container py-2 h-30">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-4xl font-bold">URL Shortener</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Quickly create short, memorable links for any URL
        </p>

        <Card className="w-full max-w-xxl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <FiLink size={20} />
              URL Shortener
            </CardTitle>
            <CardDescription>Enter the URL to shorten</CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <Alert variant="destructive" className="mb-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <AlertTitle className="text-red-600 font-medium">Error</AlertTitle>
                    <AlertDescription className="text-red-600">{serverError}</AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="originalUrl"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Original URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/very/long/url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-left font-medium mt-1" />
                    </FormItem>
                  )}
                />

                {isAuthenticated && (
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name="shortSlug"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>Custom Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional custom slug"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-left font-medium mt-1" />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-center w-full mt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-[30%] bg-blue-60 hover:bg-blue-100 text-black-600 shadow-md rounded-lg border border-blue-200 font-medium transition-all"
                  >
                    {isLoading ? "Shortening..." : "Shorten"}
                  </Button>
                </div>
              </form>
            </Form>

            {showShortUrl && shortUrl && (
              <div className="mt-2 p-2 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-green-500 mb-2">
                  Success! Here&apos;s your short URL:
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Input
                      readOnly
                      value={shortUrl}
                      className="flex-1 bg-background font-medium cursor-pointer"
                      onClick={handleLinkClick}
                    />
                    <div className="flex space-x-2 ml-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleLinkClick}
                        title="Open link in new tab"
                      >
                        <FiExternalLink size={16} />
                      </Button>
                      <CopyToClipboard text={shortUrl} onCopy={handleCopy}>
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click on the link to open in a new tab
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import UrlShortener from "@/components/urlShortener/UrlShortener";
import URLsListTable from "@/components/links/URLsListTable"
import ClientRootProvider from "../ClientRootProvider";


export default function URLsListPage() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const handleRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <ClientRootProvider>
      <div className="bg-muted py-16 mt-10">
        <div className="max-w-4xl mx-auto w-full space-y-2 px-4">
          <UrlShortener onShortenSuccess={handleRefresh} />
          <URLsListTable refreshFlag={refreshFlag} handleRefresh={handleRefresh} />
        </div>
      </div>
    </ClientRootProvider>
  );
}

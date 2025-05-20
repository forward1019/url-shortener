-- CreateIndex
CREATE INDEX "Link_createdAt_idx" ON "Link"("createdAt");

-- CreateIndex
CREATE INDEX "Link_originDomain_idx" ON "Link"("originDomain");

-- CreateIndex
CREATE INDEX "Link_visitCount_idx" ON "Link"("visitCount");

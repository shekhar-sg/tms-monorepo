BEGIN;
ALTER TABLE "User" ADD COLUMN "disabledAt" TIMESTAMP(3), ADD COLUMN "orderRevision" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserPreference" ADD COLUMN "taskViews" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Label" ADD COLUMN "ownerId" TEXT;
DROP INDEX "Label_name_key";
ALTER TABLE "Label" ADD CONSTRAINT "Label_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "Label_ownerId_name_key" ON "Label"("ownerId", "name");
-- Clone labels by project owner before replacing assignments; unreferenced originals remain archived.
CREATE TEMP TABLE label_owners AS
SELECT DISTINCT l."id" AS old_id, p."leadId" AS owner_id,
  md5(l."id" || ':' || p."leadId")::uuid::text AS new_id
FROM "Label" l JOIN "TaskLabel" tl ON tl."labelId" = l."id"
JOIN "Task" t ON t."id" = tl."taskId" JOIN "Project" p ON p."id" = t."projectId"
WHERE p."leadId" IS NOT NULL;
INSERT INTO "Label" ("id", "name", "color", "ownerId", "createdAt", "updatedAt")
SELECT m.new_id, l."name", l."color", m.owner_id, l."createdAt", l."updatedAt"
FROM label_owners m JOIN "Label" l ON l."id" = m.old_id;
UPDATE "TaskLabel" tl SET "labelId" = m.new_id
FROM label_owners m, "Task" t, "Project" p
WHERE tl."labelId" = m.old_id AND tl."taskId" = t."id" AND t."projectId" = p."id" AND p."leadId" = m.owner_id;
DROP TABLE label_owners;
WITH ranked AS (
 SELECT t."id", row_number() OVER (PARTITION BY p."leadId", t."parentId", t."status" ORDER BY t."position", t."createdAt", t."id") * 1024 AS rank
 FROM "Task" t JOIN "Project" p ON p."id" = t."projectId"
) UPDATE "Task" t SET "position" = r.rank FROM ranked r WHERE t."id" = r."id";
CREATE INDEX "Task_projectId_parentId_status_position_idx" ON "Task"("projectId", "parentId", "status", "position");
CREATE INDEX "Task_parentId_idx" ON "Task"("parentId");
CREATE TABLE "OAuthAttempt" ("id" TEXT PRIMARY KEY, "browserHash" TEXT NOT NULL, "guestId" TEXT, "returnTo" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "OAuthAttempt_expiresAt_idx" ON "OAuthAttempt"("expiresAt");
CREATE TABLE "AiReceipt" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "key" TEXT NOT NULL, "hash" TEXT NOT NULL, "result" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX "AiReceipt_userId_key_key" ON "AiReceipt"("userId", "key");
CREATE TABLE "AiQuota" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL DEFAULT 0, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "AiQuota_expiresAt_idx" ON "AiQuota"("expiresAt");
COMMIT;

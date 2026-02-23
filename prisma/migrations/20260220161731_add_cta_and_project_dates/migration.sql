-- AlterTable
ALTER TABLE "Project" ADD COLUMN "executionMonth" TEXT;
ALTER TABLE "Project" ADD COLUMN "executionYear" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'EXPOEDUC',
    "heroSlogan" TEXT NOT NULL DEFAULT 'O futuro da educação pública reimaginado através da inovação, tecnologia e criatividade.',
    "heroBackground" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000',
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "facebookUrl" TEXT,
    "whatsappUrl" TEXT,
    "ctaTitle" TEXT NOT NULL DEFAULT 'VAMOS INOVAR?',
    "ctaButtonText" TEXT NOT NULL DEFAULT 'PROJETAR O FUTURO',
    "ctaButtonLink" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("facebookUrl", "faviconUrl", "heroBackground", "heroSlogan", "id", "instagramUrl", "linkedinUrl", "logoUrl", "primaryColor", "siteName", "updatedAt", "whatsappUrl") SELECT "facebookUrl", "faviconUrl", "heroBackground", "heroSlogan", "id", "instagramUrl", "linkedinUrl", "logoUrl", "primaryColor", "siteName", "updatedAt", "whatsappUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

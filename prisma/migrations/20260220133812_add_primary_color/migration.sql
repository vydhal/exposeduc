-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "heroSlogan" TEXT NOT NULL DEFAULT 'O futuro da educação pública reimaginado através da inovação, tecnologia e criatividade.',
    "heroBackground" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000',
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "logoUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "facebookUrl" TEXT,
    "whatsappUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("facebookUrl", "heroBackground", "heroSlogan", "id", "instagramUrl", "linkedinUrl", "logoUrl", "updatedAt", "whatsappUrl") SELECT "facebookUrl", "heroBackground", "heroSlogan", "id", "instagramUrl", "linkedinUrl", "logoUrl", "updatedAt", "whatsappUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

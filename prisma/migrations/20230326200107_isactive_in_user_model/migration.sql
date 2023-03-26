/*
  Warnings:

  - You are about to drop the column `postId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("id") SELECT "id" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "id", "title") SELECT "content", "id", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT DEFAULT '',
    "first_name" TEXT,
    "last_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "profile_picture" TEXT NOT NULL
);
INSERT INTO "new_User" ("bio", "email", "first_name", "id", "last_name", "password", "profile_picture") SELECT "bio", "email", "first_name", "id", "last_name", "password", "profile_picture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

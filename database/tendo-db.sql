/* 
 * Version 1.0 
 * Initial sql script
 * Also resets the database
 * WARNING: all data will be lost!
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE  "FriendshipStatus" AS ENUM ('pending', 'active', 'rejected', 'unfriend');
CREATE TYPE  "MatchStatus" AS ENUM ('scheduled', 'ongoing', 'completed', 'canceled');
CREATE TYPE  "TournamentStatus" AS ENUM ('scheduled', 'ongoing', 'completed', 'canceled');
CREATE TYPE  "TournamentParticipantStatus" AS ENUM ( 'active', 'eliminated');
CREATE TYPE  "Role" AS ENUM ( 'captain', 'member');


DROP TABLE "User" CASCADE;
DROP TABLE "UserMessage" CASCADE;
DROP TABLE "UserSport" CASCADE;
DROP TABLE "Sport" CASCADE;
DROP TABLE "UserFriend" CASCADE;
DROP TABLE "UserPost" CASCADE;
DROP TABLE "Team" CASCADE;
DROP TABLE "TeamMember" CASCADE;
DROP TABLE "Match" CASCADE;
DROP TABLE "Tournament" CASCADE;
DROP TABLE "TournamentParticipant" CASCADE;
DROP TABLE "TournamentRound" CASCADE;

CREATE TABLE "User" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "username" varchar(15) UNIQUE NOT NULL,
  "passwordHash" text NOT NULL,
  "firstName" varchar(50) NOT NULL,
  "lastName" varchar(50) NOT NULL,
  "email" varchar(100) NOT NULL,
  "location" varchar(35) NOT NULL,
  "intro" varchar(200),
  "age" int NOT NULL,
  "height" int,
  "weight" int,
  "profileImagePath" varchar(255),
  "games" int NOT NULL,
  "wins" int NOT NULL,
  "loses" int NOT NULL,
  "elo" int,
  "lastLogin" timestamp,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "UserMessage" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "sourceId" uuid NOT NULL,
  "targetId" uuid NOT NULL,
  "message" text NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "UserSport" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "sportId" uuid NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "Sport" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar(35) NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "UserFriend" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "sourceId" uuid NOT NULL,
  "targetId" uuid NOT NULL,
  "status" "FriendshipStatus"  NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "UserPost" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "sourceId" uuid NOT NULL,
  "content" varchar(120) NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "Team" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar,
  "location" varchar,
  "games" int,
  "wins" int,
  "loses" int,
  "elo" int,
  "createdBy" uuid NOT NULL,
  "updatedBy" uuid NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "TeamMember" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "teamId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "Match" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "teamAId" uuid NOT NULL,
  "teamBId" uuid NOT NULL,
  "mvpId" uuid NOT NULL,
  "status" "MatchStatus" NOT NULL,
  "datetime" timestamp NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "Tournament" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "isOpen" boolean NOT NULL,
  "status" "TournamentStatus" NOT NULL,
  "maxUsers" int NOT NULL,
  "registrationStart" timestamp NOT NULL,
  "registrationEnd" timestamp NOT NULL,
  "createdBy" uuid NOT NULL,
  "updatedBy" uuid NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "TournamentParticipant" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "tournamentId" uuid NOT NULL,
  "teamId" uuid NOT NULL,
  "position" int,
  "status" "TournamentParticipantStatus" NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE "TournamentRound" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "tournamentId" uuid NOT NULL,
  "matchId" uuid NOT NULL,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

ALTER TABLE "UserMessage" ADD FOREIGN KEY ("sourceId") REFERENCES "User" ("id");

ALTER TABLE "UserMessage" ADD FOREIGN KEY ("targetId") REFERENCES "User" ("id");

ALTER TABLE "UserSport" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id");

ALTER TABLE "UserSport" ADD FOREIGN KEY ("sportId") REFERENCES "Sport" ("id");

ALTER TABLE "UserFriend" ADD FOREIGN KEY ("sourceId") REFERENCES "User" ("id");

ALTER TABLE "UserFriend" ADD FOREIGN KEY ("targetId") REFERENCES "User" ("id");

ALTER TABLE "UserPost" ADD FOREIGN KEY ("sourceId") REFERENCES "User" ("id");

ALTER TABLE "Team" ADD FOREIGN KEY ("createdBy") REFERENCES "User" ("id");

ALTER TABLE "Team" ADD FOREIGN KEY ("updatedBy") REFERENCES "User" ("id");

ALTER TABLE "TeamMember" ADD FOREIGN KEY ("teamId") REFERENCES "Team" ("id");

ALTER TABLE "TeamMember" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("teamAId") REFERENCES "Team" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("teamBId") REFERENCES "Team" ("id");

ALTER TABLE "Match" ADD FOREIGN KEY ("mvpId") REFERENCES "User" ("id");

ALTER TABLE "Tournament" ADD FOREIGN KEY ("createdBy") REFERENCES "User" ("id");

ALTER TABLE "Tournament" ADD FOREIGN KEY ("updatedBy") REFERENCES "User" ("id");

ALTER TABLE "TournamentParticipant" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id");

ALTER TABLE "TournamentParticipant" ADD FOREIGN KEY ("teamId") REFERENCES "Team" ("id");

ALTER TABLE "TournamentRound" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id");

ALTER TABLE "TournamentRound" ADD FOREIGN KEY ("matchId") REFERENCES "Match" ("id");

-- User records
INSERT INTO "User"(username, "passwordHash", "firstName", "lastName", email, location, intro, age, height, weight, "profileImagePath", games, wins, loses, elo, "lastLogin", "createdAt", "updatedAt")
VALUES ('chon', 'password', 'Balint', 'Ducsai', 'gorgeousemail@gmail.com', 'Budapest', 'Intro', 24, 180, 77, null, 0, 0, 0, 0, '2022-01-11', '2022-01-11', '2022-01-11');
INSERT INTO "User"(username, "passwordHash", "firstName", "lastName", email, location, intro, age, height, weight, "profileImagePath", games, wins, loses, elo, "lastLogin", "createdAt", "updatedAt")
VALUES ('admin', 'password', 'Balint', 'Ducsai', 'gorgeousemail@gmail.com', 'Budapest', 'Intro', 24, 180, 77, null, 0, 0, 0, 0, '2022-01-11', '2022-01-11', '2022-01-11');

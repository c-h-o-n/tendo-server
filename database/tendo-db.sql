/* Version 1.0 */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "username" varchar UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "location" varchar NOT NULL,
  "intro" varchar(200),
  "age" int NOT NULL,
  "height" int,
  "weight" int,
  "profile_image_path" varchar,
  "games" int NOT NULL,
  "wins" int NOT NULL,
  "loses" int NOT NULL,
  "elo" int,
  "last_login" timestamp,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "user_message" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "source_id" uuid NOT NULL,
  "target_id" uuid NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "user_sport" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "sport_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "sport" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "user_friend" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "source_id" uuid NOT NULL,
  "target_id" uuid NOT NULL,
  "status" varchar NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "user_post" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "source_id" uuid NOT NULL,
  "content" varchar(120) NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "team" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "name" varchar,
  "location" varchar,
  "games" int,
  "wins" int,
  "loses" int,
  "elo" int,
  "created_by" uuid NOT NULL,
  "updated_by" uuid NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "team_member" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "team_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" varchar NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "match" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "home_team_id" uuid NOT NULL,
  "away_team_id" uuid NOT NULL,
  "mvp" uuid NOT NULL,
  "status" varchar NOT NULL,
  "datetime" timestamp NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "tournament" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "status" varchar NOT NULL,
  "created_by" uuid NOT NULL,
  "updated_by" uuid NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "tournament_participant" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "tournament_id" uuid NOT NULL,
  "team_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

ALTER TABLE "user_message" ADD FOREIGN KEY ("source_id") REFERENCES "user" ("id");

ALTER TABLE "user_message" ADD FOREIGN KEY ("target_id") REFERENCES "user" ("id");

ALTER TABLE "user_sport" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_sport" ADD FOREIGN KEY ("sport_id") REFERENCES "sport" ("id");

ALTER TABLE "user_friend" ADD FOREIGN KEY ("source_id") REFERENCES "user" ("id");

ALTER TABLE "user_friend" ADD FOREIGN KEY ("target_id") REFERENCES "user" ("id");

ALTER TABLE "user_post" ADD FOREIGN KEY ("source_id") REFERENCES "user" ("id");

ALTER TABLE "team" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id");

ALTER TABLE "team" ADD FOREIGN KEY ("updated_by") REFERENCES "user" ("id");

ALTER TABLE "team_member" ADD FOREIGN KEY ("team_id") REFERENCES "team" ("id");

ALTER TABLE "team_member" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "match" ADD FOREIGN KEY ("home_team_id") REFERENCES "team" ("id");

ALTER TABLE "match" ADD FOREIGN KEY ("away_team_id") REFERENCES "team" ("id");

ALTER TABLE "match" ADD FOREIGN KEY ("mvp") REFERENCES "user" ("id");

ALTER TABLE "tournament" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id");

ALTER TABLE "tournament" ADD FOREIGN KEY ("updated_by") REFERENCES "user" ("id");

ALTER TABLE "tournament_participant" ADD FOREIGN KEY ("tournament_id") REFERENCES "tournament" ("id");

ALTER TABLE "tournament_participant" ADD FOREIGN KEY ("team_id") REFERENCES "team" ("id");


INSERT INTO "user"(username, password_hash, first_name, last_name, email, location, intro, age, height, weight, profile_image_path, games, wins, loses, elo, last_login, created_at, updated_at)
VALUES ('chon', 'password', 'Balint', 'Ducsai', 'gorgeousemail@gmail.com', 'Budapest', 'Intro', 24, 180, 77, null, 0, 0, 0, 0, '2022-01-11', '2022-01-11', '2022-01-11');
VALUES ('admin', 'password', 'Balint', 'Ducsai', 'gorgeousemail@gmail.com', 'Budapest', 'Intro', 24, 180, 77, null, 0, 0, 0, 0, '2022-01-11', '2022-01-11', '2022-01-11');

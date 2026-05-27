CREATE TYPE instituicion_status AS ENUM (
  'Não iniciado',
  'Em andamento',
  'Concluído',
  'Atrasado',
  'Pendente'
);

CREATE TYPE activities_status AS ENUM (
  'Projetado',
  'Em andamento',
  'Concluído'
);

CREATE TABLE "Instituicion" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "responsible" TEXT NOT NULL,
  "status" instituicion_status NOT NULL,
  "observations" TEXT
);

CREATE TABLE "Activities" (
  "id" SERIAL PRIMARY KEY,
  "id_instituicion" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "responsible" text,
  "start_date" DATE,
  "end_date" DATE,
  "status" activities_status NOT NULL,

  CONSTRAINT fk_instituicion
    FOREIGN KEY ("id_instituicion")
    REFERENCES "Instituicion" ("id")
    ON DELETE CASCADE
);

CREATE TABLE "InstitutionPhoto" (
  "id" SERIAL PRIMARY KEY,

  "id_instituicion" INTEGER NOT NULL,

  "photo" BYTEA NOT NULL,

  "original_name" TEXT,

  "mime_type" TEXT,

  "size" INTEGER,

  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "FK_INSTITUTION_PHOTO"
    FOREIGN KEY ("instituicion_id")
    REFERENCES "Instituicion" ("id")
    ON DELETE CASCADE
);
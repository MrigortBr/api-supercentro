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

CREATE TABLE "InstitutionEquipment" (
    "id" SERIAL PRIMARY KEY,
    "id_instituicion" INTEGER NOT NULL,
    "simb" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "marca" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "previsao_entrega" DATE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "FK_INSTITUTION_EQUIPMENT"
        FOREIGN KEY ("id_instituicion")
        REFERENCES "Instituicion"("id")
        ON DELETE CASCADE
);

CREATE TABLE "ObservationActivities"(
    "id" SERIAL PRIMARY KEY,
    "id_activities" INTEGER NOT NULL,
    "date_observation" TIMESTAMP,
    "text_observation" TEXT,
        CONSTRAINT "FK_OBSERVATION_ACTIVITIES"
        FOREIGN KEY ("id_activities")
        REFERENCES "Activities"("id")
        ON DELETE CASCADE
)

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_logins (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes'),

    CONSTRAINT fk_user_logins_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
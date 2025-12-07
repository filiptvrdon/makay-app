


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."difficulty_type" AS ENUM (
    'weight_absolute',
    'weight_relative',
    'bodyweight',
    'duration',
    'distance',
    'rpe',
    'other'
);


ALTER TYPE "public"."difficulty_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."list_my_athletes_with_stats"("p_coach_id" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "current_microcycle" "text", "open_sessions" integer)
    LANGUAGE "sql"
    AS $$
  with base_athletes as (
    select a.id, a.name
    from athletes a
    join athletes_2_coaches ac
      on ac.athlete_id = a.id
    where ac.coach_id = p_coach_id
  ),
  meso as (
    select m.*
    from mesocycles m
    join base_athletes ba on ba.id = m.athlete_id
    where m.coach_id = p_coach_id
  ),
  micro as (
    select
      mc.*,
      m.athlete_id
    from microcycles mc
    join meso m on m.id = mc.mesocycle_id
  ),
  last_micro_per_athlete as (
    -- pick the microcycle with the greatest created_at per athlete
    select distinct on (athlete_id)
      athlete_id,
      name as current_microcycle
    from micro
    order by athlete_id, created_at desc
  ),
  session_counts as (
    select
      m.athlete_id,
      count(*)::int as open_sessions
    from sessions s
    join micro m on m.id = s.microcycle_id
    where s.completed_on is null
    group by m.athlete_id
  )
  select
    ba.id,
    ba.name,
    lm.current_microcycle,
    coalesce(sc.open_sessions, 0) as open_sessions
  from base_athletes ba
  left join last_micro_per_athlete lm on lm.athlete_id = ba.id
  left join session_counts sc on sc.athlete_id = ba.id
  order by ba.name nulls last;
$$;


ALTER FUNCTION "public"."list_my_athletes_with_stats"("p_coach_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."athletes" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."athletes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."athletes_2_coaches" (
    "athlete_id" "uuid" NOT NULL,
    "coach_id" "uuid" NOT NULL
);


ALTER TABLE "public"."athletes_2_coaches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coaches" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."coaches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercise_prescriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "exercise" "text" NOT NULL,
    "prescribed" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "actual" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "coach_notes" "text",
    "athlete_notes" "text",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."exercise_prescriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mesocycles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "athlete_id" "uuid" NOT NULL,
    "coach_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "goal" "text",
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mesocycles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."microcycles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mesocycle_id" "uuid" NOT NULL,
    "mesocycle_idx" integer NOT NULL,
    "name" "text",
    "description" "text",
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."microcycles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "text" NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles" IS 'Roles definition';



CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "microcycle_id" "uuid" NOT NULL,
    "microcycle_idx" integer NOT NULL,
    "name" "text",
    "description" "text",
    "planned_date" "date",
    "completed_on" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Application users (referencing auth.users)';



CREATE TABLE IF NOT EXISTS "public"."users_2_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL
);


ALTER TABLE "public"."users_2_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_2_roles" IS 'Assignment of users to roles';



ALTER TABLE ONLY "public"."athletes_2_coaches"
    ADD CONSTRAINT "athletes_2_coaches_pkey" PRIMARY KEY ("athlete_id", "coach_id");



ALTER TABLE ONLY "public"."athletes"
    ADD CONSTRAINT "athletes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaches"
    ADD CONSTRAINT "coaches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercise_prescriptions"
    ADD CONSTRAINT "exercise_prescriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mesocycles"
    ADD CONSTRAINT "mesocycles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."microcycles"
    ADD CONSTRAINT "microcycles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "movement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_2_roles"
    ADD CONSTRAINT "users_2_roles_pkey" PRIMARY KEY ("user_id", "role_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "uniq_microcycle_number_per_mesocycle" ON "public"."microcycles" USING "btree" ("mesocycle_id", "mesocycle_idx");



ALTER TABLE ONLY "public"."athletes"
    ADD CONSTRAINT "athletes_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."coaches"
    ADD CONSTRAINT "coaches_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."exercise_prescriptions"
    ADD CONSTRAINT "exercise_prescriptions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mesocycles"
    ADD CONSTRAINT "mesocycles_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mesocycles"
    ADD CONSTRAINT "mesocycles_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."microcycles"
    ADD CONSTRAINT "microcycles_mesocycle_id_fkey" FOREIGN KEY ("mesocycle_id") REFERENCES "public"."mesocycles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_microcycle_id_fkey" FOREIGN KEY ("microcycle_id") REFERENCES "public"."microcycles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_2_roles"
    ADD CONSTRAINT "users_2_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."users_2_roles"
    ADD CONSTRAINT "users_2_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



CREATE POLICY "Roles write access" ON "public"."roles" USING (("auth"."uid"() = 'df549421-8639-48db-9c5b-7281f6025750'::"uuid")) WITH CHECK (("auth"."uid"() = 'df549421-8639-48db-9c5b-7281f6025750'::"uuid"));



CREATE POLICY "user table policy" ON "public"."users" AS RESTRICTIVE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users_2_roles (read only)" ON "public"."users_2_roles" FOR SELECT USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."list_my_athletes_with_stats"("p_coach_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."list_my_athletes_with_stats"("p_coach_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."list_my_athletes_with_stats"("p_coach_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."athletes" TO "anon";
GRANT ALL ON TABLE "public"."athletes" TO "authenticated";
GRANT ALL ON TABLE "public"."athletes" TO "service_role";



GRANT ALL ON TABLE "public"."athletes_2_coaches" TO "anon";
GRANT ALL ON TABLE "public"."athletes_2_coaches" TO "authenticated";
GRANT ALL ON TABLE "public"."athletes_2_coaches" TO "service_role";



GRANT ALL ON TABLE "public"."coaches" TO "anon";
GRANT ALL ON TABLE "public"."coaches" TO "authenticated";
GRANT ALL ON TABLE "public"."coaches" TO "service_role";



GRANT ALL ON TABLE "public"."exercise_prescriptions" TO "anon";
GRANT ALL ON TABLE "public"."exercise_prescriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."exercise_prescriptions" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON TABLE "public"."mesocycles" TO "anon";
GRANT ALL ON TABLE "public"."mesocycles" TO "authenticated";
GRANT ALL ON TABLE "public"."mesocycles" TO "service_role";



GRANT ALL ON TABLE "public"."microcycles" TO "anon";
GRANT ALL ON TABLE "public"."microcycles" TO "authenticated";
GRANT ALL ON TABLE "public"."microcycles" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."users_2_roles" TO "anon";
GRANT ALL ON TABLE "public"."users_2_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."users_2_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";



-- AlterTable
CREATE SEQUENCE admins_id_seq;
ALTER TABLE "Admins" ALTER COLUMN "id" SET DEFAULT nextval('admins_id_seq');
ALTER SEQUENCE admins_id_seq OWNED BY "Admins"."id";

-- AlterTable
CREATE SEQUENCE answer_id_seq;
ALTER TABLE "Answer" ALTER COLUMN "id" SET DEFAULT nextval('answer_id_seq');
ALTER SEQUENCE answer_id_seq OWNED BY "Answer"."id";

-- AlterTable
CREATE SEQUENCE attempt_id_seq;
ALTER TABLE "Attempt" ALTER COLUMN "id" SET DEFAULT nextval('attempt_id_seq');
ALTER SEQUENCE attempt_id_seq OWNED BY "Attempt"."id";

-- AlterTable
CREATE SEQUENCE game_id_seq;
ALTER TABLE "Game" ALTER COLUMN "id" SET DEFAULT nextval('game_id_seq');
ALTER SEQUENCE game_id_seq OWNED BY "Game"."id";

-- AlterTable
CREATE SEQUENCE institution_id_seq;
ALTER TABLE "Institution" ALTER COLUMN "id" SET DEFAULT nextval('institution_id_seq');
ALTER SEQUENCE institution_id_seq OWNED BY "Institution"."id";

-- AlterTable
CREATE SEQUENCE player_id_seq;
ALTER TABLE "Player" ALTER COLUMN "id" SET DEFAULT nextval('player_id_seq');
ALTER SEQUENCE player_id_seq OWNED BY "Player"."id";

-- AlterTable
CREATE SEQUENCE question_id_seq;
ALTER TABLE "Question" ALTER COLUMN "id" SET DEFAULT nextval('question_id_seq');
ALTER SEQUENCE question_id_seq OWNED BY "Question"."id";

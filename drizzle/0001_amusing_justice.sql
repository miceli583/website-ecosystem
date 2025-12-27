ALTER TABLE "core_value_supporting_values" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "core_value_supporting_values" CASCADE;--> statement-breakpoint
ALTER TABLE "quote_posts" DROP CONSTRAINT "quote_posts_supporting_value_id_supporting_values_id_fk";
--> statement-breakpoint
ALTER TABLE "quote_posts" DROP CONSTRAINT "quote_posts_core_value_id_core_values_id_fk";
--> statement-breakpoint
ALTER TABLE "quote_posts" DROP CONSTRAINT "quote_posts_quote_id_quotes_id_fk";
--> statement-breakpoint
ALTER TABLE "core_values" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quote_posts" ALTER COLUMN "is_published" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "quote_posts" ALTER COLUMN "is_published" SET DEFAULT 'false';--> statement-breakpoint
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_core_value_id_core_values_id_fk" FOREIGN KEY ("core_value_id") REFERENCES "public"."core_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authors" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "core_values" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "quote_posts" DROP COLUMN "supporting_value_id";--> statement-breakpoint
ALTER TABLE "quotes" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "supporting_values" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "supporting_values" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "core_values" ADD CONSTRAINT "core_values_value_unique" UNIQUE("value");--> statement-breakpoint
ALTER TABLE "supporting_values" ADD CONSTRAINT "supporting_values_value_unique" UNIQUE("value");
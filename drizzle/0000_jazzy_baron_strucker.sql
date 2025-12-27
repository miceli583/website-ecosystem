CREATE TABLE "authors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_value_quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"core_value_id" text NOT NULL,
	"quote_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_value_supporting_values" (
	"id" text PRIMARY KEY NOT NULL,
	"core_value_id" text NOT NULL,
	"supporting_value_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_values" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"core_value_id" text NOT NULL,
	"supporting_value_id" text NOT NULL,
	"quote_id" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_for" timestamp with time zone,
	"meta_post_id" text,
	"image_url" text,
	"caption" text,
	"queue_position" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"author_id" text,
	"source" text,
	"category" text,
	"tags" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supporting_values" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "core_value_quotes" ADD CONSTRAINT "core_value_quotes_core_value_id_core_values_id_fk" FOREIGN KEY ("core_value_id") REFERENCES "public"."core_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_value_quotes" ADD CONSTRAINT "core_value_quotes_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_value_supporting_values" ADD CONSTRAINT "core_value_supporting_values_core_value_id_core_values_id_fk" FOREIGN KEY ("core_value_id") REFERENCES "public"."core_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_value_supporting_values" ADD CONSTRAINT "core_value_supporting_values_supporting_value_id_supporting_values_id_fk" FOREIGN KEY ("supporting_value_id") REFERENCES "public"."supporting_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_core_value_id_core_values_id_fk" FOREIGN KEY ("core_value_id") REFERENCES "public"."core_values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_supporting_value_id_supporting_values_id_fk" FOREIGN KEY ("supporting_value_id") REFERENCES "public"."supporting_values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_posts" ADD CONSTRAINT "quote_posts_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;
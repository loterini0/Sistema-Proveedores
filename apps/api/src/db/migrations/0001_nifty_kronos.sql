CREATE TABLE "categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"parent_id" uuid,
	"orden" integer DEFAULT 0 NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "categoria_id" uuid;--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "destacada" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "verificada" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "categoria_id" uuid;--> statement-breakpoint
ALTER TABLE "rfqs" ADD COLUMN "categoria_id" uuid;--> statement-breakpoint
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresas" DROP COLUMN "sector";--> statement-breakpoint
ALTER TABLE "empresas" DROP COLUMN "sector_nivel2";
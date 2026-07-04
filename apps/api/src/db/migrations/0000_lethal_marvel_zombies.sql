CREATE TYPE "public"."rfq_status" AS ENUM('draft', 'active', 'closed', 'awarded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TABLE "cotizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" uuid NOT NULL,
	"proveedor_id" uuid NOT NULL,
	"empresa_proveedor_id" uuid,
	"precio_unitario" varchar(100),
	"precio_total" varchar(100),
	"plazo_entrega" varchar(100),
	"condiciones_pago" text,
	"observaciones" text,
	"ganadora" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empresas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"razon_social" varchar(255) NOT NULL,
	"nit" varchar(20),
	"sector" varchar(100),
	"sector_nivel2" varchar(100),
	"descripcion" text,
	"ciudad" varchar(100),
	"departamento" varchar(100),
	"telefono" varchar(20),
	"website" varchar(255),
	"logo_url" varchar(500),
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "empresas_nit_unique" UNIQUE("nit")
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"precio" varchar(50),
	"imagen_url" varchar(500),
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfq_destinatarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfq_id" uuid NOT NULL,
	"empresa_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comprador_id" uuid NOT NULL,
	"empresa_comprador_id" uuid,
	"titulo" varchar(255) NOT NULL,
	"descripcion" text NOT NULL,
	"cantidad" varchar(100),
	"presupuesto" varchar(100),
	"fecha_limite" timestamp,
	"privada" boolean DEFAULT true NOT NULL,
	"status" "rfq_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verify_token" varchar(255),
	"reset_token" varchar(255),
	"reset_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_rfq_id_rfqs_id_fk" FOREIGN KEY ("rfq_id") REFERENCES "public"."rfqs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_proveedor_id_users_id_fk" FOREIGN KEY ("proveedor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_empresa_proveedor_id_empresas_id_fk" FOREIGN KEY ("empresa_proveedor_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfq_destinatarios" ADD CONSTRAINT "rfq_destinatarios_rfq_id_rfqs_id_fk" FOREIGN KEY ("rfq_id") REFERENCES "public"."rfqs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfq_destinatarios" ADD CONSTRAINT "rfq_destinatarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_comprador_id_users_id_fk" FOREIGN KEY ("comprador_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_empresa_comprador_id_empresas_id_fk" FOREIGN KEY ("empresa_comprador_id") REFERENCES "public"."empresas"("id") ON DELETE no action ON UPDATE no action;
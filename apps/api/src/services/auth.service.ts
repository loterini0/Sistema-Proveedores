import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

export const authService = {
  // RF-AUTH-01: Registro
  async register(nombre: string, email: string, password: string) {
    // Verificar si el email ya existe
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      throw Object.assign(new Error('El email ya está registrado.'), { status: 409 });
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Token de verificación de email
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Crear usuario
    const [user] = await db
      .insert(users)
      .values({
        nombre,
        email,
        passwordHash,
        verifyToken,
        emailVerified: false,
      })
      .returning();

    return { user, verifyToken };
  },

  // RF-AUTH-01: Login
  async login(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      throw Object.assign(new Error('Credenciales incorrectas.'), { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw Object.assign(new Error('Credenciales incorrectas.'), { status: 401 });
    }

    if (!user.emailVerified) {
      throw Object.assign(new Error('Debes verificar tu email antes de iniciar sesión.'), {
        status: 403,
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken, user };
  },

  // RF-AUTH-06: Recuperación de contraseña
  async forgotPassword(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Siempre responder igual por seguridad (no revelar si existe el email)
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutos

    await db.update(users).set({ resetToken, resetTokenExpiresAt }).where(eq(users.id, user.id));

    return { resetToken, user };
  },

  // RF-AUTH-06: Reset de contraseña
  async resetPassword(token: string, newPassword: string) {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);

    if (!user || !user.resetTokenExpiresAt) {
      throw Object.assign(new Error('Token inválido o expirado.'), { status: 400 });
    }

    if (new Date() > user.resetTokenExpiresAt) {
      throw Object.assign(new Error('Token expirado.'), { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db
      .update(users)
      .set({ passwordHash, resetToken: null, resetTokenExpiresAt: null })
      .where(eq(users.id, user.id));
  },

  // Verificación de email
  async verifyEmail(token: string) {
    const [user] = await db.select().from(users).where(eq(users.verifyToken, token)).limit(1);

    if (!user) {
      throw Object.assign(new Error('Token de verificación inválido.'), { status: 400 });
    }

    await db
      .update(users)
      .set({ emailVerified: true, verifyToken: null })
      .where(eq(users.id, user.id));
  },
};

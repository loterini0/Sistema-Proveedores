import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret';

const ACCESS_TOKEN_OPTIONS: SignOptions = { expiresIn: 900 }; // 15 min
const REFRESH_TOKEN_OPTIONS: SignOptions = { expiresIn: 2592000 }; // 30 dias

export const authService = {
  async register(nombre: string, email: string, password: string) {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      throw Object.assign(new Error('El email ya esta registrado.'), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');

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
      throw Object.assign(new Error('Debes verificar tu email antes de iniciar sesion.'), {
        status: 403,
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, nombre: user.nombre },
      JWT_SECRET,
      ACCESS_TOKEN_OPTIONS,
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, REFRESH_TOKEN_OPTIONS);

    return { accessToken, refreshToken, user };
  },

  async forgotPassword(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.update(users).set({ resetToken, resetTokenExpiresAt }).where(eq(users.id, user.id));

    return { resetToken, user };
  },

  async resetPassword(token: string, newPassword: string) {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);

    if (!user || !user.resetTokenExpiresAt) {
      throw Object.assign(new Error('Token invalido o expirado.'), { status: 400 });
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

  async verifyEmail(token: string) {
    const [user] = await db.select().from(users).where(eq(users.verifyToken, token)).limit(1);

    if (!user) {
      throw Object.assign(new Error('Token de verificacion invalido.'), { status: 400 });
    }

    await db
      .update(users)
      .set({ emailVerified: true, verifyToken: null })
      .where(eq(users.id, user.id));
  },
};

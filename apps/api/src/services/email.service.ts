import { Resend } from 'resend';

let resend: Resend | null = null;
function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}
const FROM = 'Sistema Proveedores <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || 'https://sistema-proveedores-api.onrender.com';

export const emailService = {
  async enviarVerificacion(email: string, nombre: string, token: string) {
    const link = `${APP_URL}/api/v1/auth/verify-email/${token}`;

    try {
      await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: 'Verifica tu cuenta - Sistema Proveedores',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Hola ${nombre},</h2>
            <p>Gracias por registrarte en Sistema Proveedores. Confirma tu email para activar tu cuenta:</p>
            <a href="${link}" style="display:inline-block; background:#1D6F42; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
              Verificar mi cuenta
            </a>
            <p style="color:#666; font-size:13px;">Si no creaste esta cuenta, ignora este correo.</p>
          </div>
        `,
      });
    } catch (err) {
      // No tumbar el registro si falla el email — lo logueamos y seguimos.
      console.error('Error enviando email de verificación:', err);
    }
  },

  async enviarResetPassword(email: string, token: string) {
    const link = `${APP_URL}/api/v1/auth/reset-password?token=${token}`; // ajustar si tenés pantalla de reset en mobile

    try {
      await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Restablecer contraseña</h2>
            <p>Solicitaste restablecer tu contraseña. Este enlace expira en 1 hora.</p>
            <a href="${link}" style="display:inline-block; background:#1D6F42; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
              Restablecer contraseña
            </a>
            <p style="color:#666; font-size:13px;">Si no lo solicitaste, ignora este correo.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Error enviando email de reset:', err);
    }
  },
};
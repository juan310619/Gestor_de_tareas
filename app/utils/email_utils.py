import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

def send_password_reset_email(to_email: str, reset_token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", "587")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    
    # Mensaje de correo
    subject = "Recuperación de contraseña"
    body = f"""Hola,
    
Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:

{reset_link}

Si no solicitaste este cambio, ignora este correo.

Saludos,
El equipo de Gestor de Tareas
"""

    # Fallback to console if SMTP is not configured
    if not all([smtp_server, smtp_port, smtp_user, smtp_password]):
        print("\n" + "="*50)
        print(f"EMAIL SIMULADO (A: {to_email})")
        print(f"Asunto: {subject}")
        print("-" * 50)
        print(body)
        print("="*50 + "\n")
        logger.warning("SMTP no configurado. El correo de recuperación se imprimió en la consola.")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_from
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        logger.error(f"Error enviando correo SMTP: {str(e)}")
        # Even if error, fallback clearly in dev
        print(f"Error SMTP, enlace de recuperación: {reset_link}")
        return False

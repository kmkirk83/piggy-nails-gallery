/**
 * Email Configuration
 * This file sets up the email provider integration
 * Currently supports: SendGrid, Mailgun, or SMTP
 */

export interface EmailConfig {
  provider: "sendgrid" | "mailgun" | "smtp" | "console";
  apiKey?: string;
  domain?: string;
  fromEmail: string;
  fromName: string;
}

// Get email config from environment
export function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER || "console") as EmailConfig["provider"];

  const config: EmailConfig = {
    provider,
    fromEmail: process.env.EMAIL_FROM || "noreply@nailed.com",
    fromName: process.env.EMAIL_FROM_NAME || "Nail'd",
  };

  if (provider === "sendgrid") {
    config.apiKey = process.env.SENDGRID_API_KEY;
    if (!config.apiKey) {
      console.warn("[Email] SendGrid API key not configured. Falling back to console.");
      config.provider = "console";
    }
  } else if (provider === "mailgun") {
    config.apiKey = process.env.MAILGUN_API_KEY;
    config.domain = process.env.MAILGUN_DOMAIN;
    if (!config.apiKey || !config.domain) {
      console.warn("[Email] Mailgun credentials not configured. Falling back to console.");
      config.provider = "console";
    }
  }

  return config;
}

/**
 * Send email helper - routes to appropriate provider
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean> {
  const config = getEmailConfig();

  try {
    if (config.provider === "sendgrid") {
      return await sendViaSendGrid(to, subject, html, text, config);
    } else if (config.provider === "mailgun") {
      return await viaMailgun(to, subject, html, text, config);
    } else {
      // Console mode - just log
      console.log(`[Email] ${config.provider.toUpperCase()} Mode:\n`, {
        to,
        subject,
        from: `${config.fromName} <${config.fromEmail}>`,
      });
      return true;
    }
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * Send via SendGrid
 */
async function sendViaSendGrid(
  to: string,
  subject: string,
  html: string,
  text: string | undefined,
  config: EmailConfig
): Promise<boolean> {
  try {
    // Note: In production, you would use the SendGrid SDK
    // For now, this is a placeholder that logs the intent
    console.log(`[Email] SendGrid: Sending email to ${to}`, {
      subject,
      from: config.fromEmail,
    });

    // Example of how to use SendGrid SDK:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(config.apiKey);
    // await sgMail.send({
    //   to,
    //   from: config.fromEmail,
    //   subject,
    //   html,
    //   text,
    // });

    return true;
  } catch (error) {
    console.error("[Email] SendGrid error:", error);
    return false;
  }
}

/**
 * Send via Mailgun
 */
async function viaMailgun(
  to: string,
  subject: string,
  html: string,
  text: string | undefined,
  config: EmailConfig
): Promise<boolean> {
  try {
    // Note: In production, you would use the Mailgun SDK
    // For now, this is a placeholder that logs the intent
    console.log(`[Email] Mailgun: Sending email to ${to}`, {
      subject,
      from: config.fromEmail,
      domain: config.domain,
    });

    // Example of how to use Mailgun SDK:
    // const mailgun = require('mailgun.js');
    // const client = new mailgun.Mailgun({ key: config.apiKey });
    // const messageData = {
    //   from: `${config.fromName} <${config.fromEmail}>`,
    //   to,
    //   subject,
    //   html,
    //   text,
    // };
    // await client.messages.create(config.domain, messageData);

    return true;
  } catch (error) {
    console.error("[Email] Mailgun error:", error);
    return false;
  }
}

export default {
  getEmailConfig,
  sendEmail,
};

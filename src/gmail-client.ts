/**
 * Gmail Integration Client - Wraps Mission Control Integration Engine API
 * 
 * CRITICAL: Uses Convex API integration engine, NOT local gog CLI
 * All calls must go through https://beloved-squirrel-599.convex.site/api/integrations/execute
 */

import axios from 'axios';
import { GmailIntegrationResponse } from './types';

const INTEGRATION_API_URL = 'https://beloved-squirrel-599.convex.site/api/integrations/execute';
const USER_ID = 'user_39f60iciK4nX4Q0efRxrfyuHqj2';

export class GmailClient {
  private agentName: string;
  private taskId: string;

  constructor(agentName: string, taskId: string) {
    this.agentName = agentName;
    this.taskId = taskId;
  }

  /**
   * Send an email using Gmail integration
   */
  async sendEmail(params: {
    to: string;
    subject: string;
    bodyPlainText?: string;
    bodyHtml?: string;
  }): Promise<GmailIntegrationResponse> {
    try {
      // Gmail integration expects base64url-encoded RFC 2822 message
      const email = this.createEmailMessage(params.to, params.subject, params.bodyPlainText, params.bodyHtml);
      const base64Email = Buffer.from(email).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await axios.post(INTEGRATION_API_URL, {
        userId: USER_ID,
        agentName: this.agentName,
        taskId: this.taskId,
        blueprintSlug: 'gmail',
        toolName: 'send_message',
        toolArgs: {
          raw: base64Email
        }
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Gmail send failed:', error.response?.data || error.message);
      return {
        ok: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create a Gmail draft
   */
  async createDraft(params: {
    to: string;
    subject: string;
    bodyPlainText?: string;
    bodyHtml?: string;
  }): Promise<GmailIntegrationResponse> {
    try {
      const email = this.createEmailMessage(params.to, params.subject, params.bodyPlainText, params.bodyHtml);
      const base64Email = Buffer.from(email).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await axios.post(INTEGRATION_API_URL, {
        userId: USER_ID,
        agentName: this.agentName,
        taskId: this.taskId,
        blueprintSlug: 'gmail',
        toolName: 'create_draft',
        toolArgs: {
          message: {
            raw: base64Email
          }
        }
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Gmail draft creation failed:', error.response?.data || error.message);
      return {
        ok: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * List Gmail drafts
   */
  async listDrafts(): Promise<GmailIntegrationResponse> {
    try {
      const response = await axios.post(INTEGRATION_API_URL, {
        userId: USER_ID,
        agentName: this.agentName,
        taskId: this.taskId,
        blueprintSlug: 'gmail',
        toolName: 'list_drafts',
        toolArgs: {}
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Gmail list drafts failed:', error.response?.data || error.message);
      return {
        ok: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Send a draft by ID
   */
  async sendDraft(draftId: string): Promise<GmailIntegrationResponse> {
    try {
      const response = await axios.post(INTEGRATION_API_URL, {
        userId: USER_ID,
        agentName: this.agentName,
        taskId: this.taskId,
        blueprintSlug: 'gmail',
        toolName: 'send_draft',
        toolArgs: {
          id: draftId
        }
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Gmail send draft failed:', error.response?.data || error.message);
      return {
        ok: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Delete a draft by ID
   */
  async deleteDraft(draftId: string): Promise<GmailIntegrationResponse> {
    try {
      const response = await axios.post(INTEGRATION_API_URL, {
        userId: USER_ID,
        agentName: this.agentName,
        taskId: this.taskId,
        blueprintSlug: 'gmail',
        toolName: 'delete_draft',
        toolArgs: {
          id: draftId
        }
      });

      return {
        ok: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Gmail delete draft failed:', error.response?.data || error.message);
      return {
        ok: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create RFC 2822 email message
   */
  private createEmailMessage(to: string, subject: string, bodyPlainText?: string, bodyHtml?: string): string {
    const boundary = '----=_Part_' + Math.random().toString(36).substring(2);
    
    let message = `To: ${to}\r\n`;
    message += `Subject: ${subject}\r\n`;
    message += `MIME-Version: 1.0\r\n`;

    if (bodyHtml) {
      // Multipart email with both plain text and HTML
      message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;
      message += `--${boundary}\r\n`;
      message += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
      message += `${bodyPlainText || this.htmlToPlainText(bodyHtml)}\r\n\r\n`;
      message += `--${boundary}\r\n`;
      message += `Content-Type: text/html; charset="UTF-8"\r\n\r\n`;
      message += `${bodyHtml}\r\n\r\n`;
      message += `--${boundary}--`;
    } else {
      // Plain text only
      message += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
      message += bodyPlainText || '';
    }

    return message;
  }

  /**
   * Simple HTML to plain text conversion
   */
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
  }
}

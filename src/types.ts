/**
 * Type definitions for QuantXData Gmail Outreach Automation
 */

export interface OutreachTarget {
  name: string;
  email: string;
  company: string;
  role?: string;
  github?: string;
  twitter?: string;
  personalizationHook: string;
  icpCategory: string; // "AI Agent Builders" | "Crypto Quant Traders" | "DeFi Startups" | "AI Platform Companies"
  icpScore: number;
}

export interface EmailTemplate {
  templateId: string;
  icpCategory: string;
  subject: string;
  bodyTemplate: string; // Plain text with {{variable}} placeholders
  variables: string[]; // List of required variables
}

export interface PersonalizedMessage {
  targetEmail: string;
  targetName: string;
  company: string;
  subject: string;
  bodyPlainText: string;
  bodyHtml?: string;
  channel: 'email' | 'twitter-dm' | 'both';
  personalizationNotes?: string;
}

export interface OutreachContent {
  personalizedMessages: PersonalizedMessage[];
  icpTemplates: EmailTemplate[];
  metadata: {
    generatedBy: string;
    generatedAt: string;
    totalMessages: number;
    totalTemplates: number;
  };
}

export interface SendResult {
  targetEmail: string;
  success: boolean;
  messageId?: string;
  draftId?: string;
  error?: string;
  sentAt?: string;
}

export interface CampaignStatus {
  totalTargets: number;
  draftsCreated: number;
  emailsSent: number;
  failed: number;
  pending: number;
  results: SendResult[];
}

export interface GmailIntegrationResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

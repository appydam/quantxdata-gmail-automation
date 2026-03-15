/**
 * QuantXData Gmail Outreach Automation
 * 
 * Sends personalized outreach emails to target leads using Gmail integration.
 * Creates drafts first for review, then sends after approval.
 */

import * as fs from 'fs';
import * as path from 'path';
import { GmailClient } from './gmail-client';
import {
  OutreachContent,
  PersonalizedMessage,
  CampaignStatus,
  SendResult
} from './types';

const AGENT_NAME = 'Forge';
const TASK_ID = 'jn7ddhj4rjrrhrwmqv7qf0krg182yd50';

/**
 * Main automation class
 */
export class OutreachAutomation {
  private gmailClient: GmailClient;
  private outreachContent: OutreachContent | null = null;
  private campaignStatus: CampaignStatus;

  constructor() {
    this.gmailClient = new GmailClient(AGENT_NAME, TASK_ID);
    this.campaignStatus = {
      totalTargets: 0,
      draftsCreated: 0,
      emailsSent: 0,
      failed: 0,
      pending: 0,
      results: []
    };
  }

  /**
   * Load outreach content from JSON file
   */
  loadOutreachContent(filePath: string): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.outreachContent = JSON.parse(fileContent);
      this.campaignStatus.totalTargets = this.outreachContent!.personalizedMessages.length;
      this.campaignStatus.pending = this.campaignStatus.totalTargets;
      console.log(`✅ Loaded ${this.campaignStatus.totalTargets} personalized messages`);
      console.log(`✅ Loaded ${this.outreachContent!.icpTemplates.length} ICP templates`);
    } catch (error: any) {
      console.error('❌ Failed to load outreach content:', error.message);
      throw error;
    }
  }

  /**
   * Create Gmail drafts for all email messages (for Arpit's review)
   */
  async createDraftsForReview(delay: number = 1000): Promise<void> {
    if (!this.outreachContent) {
      throw new Error('Outreach content not loaded. Call loadOutreachContent() first.');
    }

    console.log('\n📧 Creating Gmail drafts for review...\n');

    const emailMessages = this.outreachContent.personalizedMessages.filter(
      msg => msg.channel === 'email' || msg.channel === 'both'
    );

    for (const message of emailMessages) {
      console.log(`Creating draft for ${message.targetName} (${message.targetEmail})...`);
      
      const result = await this.createDraft(message);
      this.campaignStatus.results.push(result);

      if (result.success) {
        this.campaignStatus.draftsCreated++;
        this.campaignStatus.pending--;
        console.log(`✅ Draft created: ${result.draftId}`);
      } else {
        this.campaignStatus.failed++;
        this.campaignStatus.pending--;
        console.error(`❌ Failed: ${result.error}`);
      }

      // Rate limiting delay
      if (delay > 0 && emailMessages.indexOf(message) < emailMessages.length - 1) {
        await this.sleep(delay);
      }
    }

    this.printSummary();
  }

  /**
   * Send emails directly (use after Arpit approval)
   */
  async sendEmails(delay: number = 2000): Promise<void> {
    if (!this.outreachContent) {
      throw new Error('Outreach content not loaded. Call loadOutreachContent() first.');
    }

    console.log('\n📤 Sending outreach emails...\n');
    console.log('⚠️  WARNING: This will send real emails. Make sure you have approval!\n');

    const emailMessages = this.outreachContent.personalizedMessages.filter(
      msg => msg.channel === 'email' || msg.channel === 'both'
    );

    for (const message of emailMessages) {
      console.log(`Sending to ${message.targetName} (${message.targetEmail})...`);
      
      const result = await this.sendEmail(message);
      this.campaignStatus.results.push(result);

      if (result.success) {
        this.campaignStatus.emailsSent++;
        this.campaignStatus.pending--;
        console.log(`✅ Sent: ${result.messageId}`);
      } else {
        this.campaignStatus.failed++;
        this.campaignStatus.pending--;
        console.error(`❌ Failed: ${result.error}`);
      }

      // Rate limiting delay
      if (delay > 0 && emailMessages.indexOf(message) < emailMessages.length - 1) {
        await this.sleep(delay);
      }
    }

    this.printSummary();
  }

  /**
   * Create a draft for a single message
   */
  private async createDraft(message: PersonalizedMessage): Promise<SendResult> {
    const result = await this.gmailClient.createDraft({
      to: message.targetEmail,
      subject: message.subject,
      bodyPlainText: message.bodyPlainText,
      bodyHtml: message.bodyHtml
    });

    return {
      targetEmail: message.targetEmail,
      success: result.ok,
      draftId: result.data?.id,
      error: result.error
    };
  }

  /**
   * Send an email for a single message
   */
  private async sendEmail(message: PersonalizedMessage): Promise<SendResult> {
    const result = await this.gmailClient.sendEmail({
      to: message.targetEmail,
      subject: message.subject,
      bodyPlainText: message.bodyPlainText,
      bodyHtml: message.bodyHtml
    });

    return {
      targetEmail: message.targetEmail,
      success: result.ok,
      messageId: result.data?.id,
      error: result.error,
      sentAt: new Date().toISOString()
    };
  }

  /**
   * Print campaign summary
   */
  private printSummary(): void {
    console.log('\n=== CAMPAIGN SUMMARY ===');
    console.log(`Total targets: ${this.campaignStatus.totalTargets}`);
    console.log(`Drafts created: ${this.campaignStatus.draftsCreated}`);
    console.log(`Emails sent: ${this.campaignStatus.emailsSent}`);
    console.log(`Failed: ${this.campaignStatus.failed}`);
    console.log(`Pending: ${this.campaignStatus.pending}`);
    console.log('========================\n');
  }

  /**
   * Get campaign status
   */
  getStatus(): CampaignStatus {
    return this.campaignStatus;
  }

  /**
   * Export campaign results to JSON
   */
  exportResults(outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(this.campaignStatus, null, 2));
    console.log(`📊 Results exported to: ${outputPath}`);
  }

  /**
   * Sleep utility
   */
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI Usage
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'drafts';
  const contentPath = args[1] || path.join(__dirname, '../data/outreach-content.json');

  const automation = new OutreachAutomation();

  try {
    automation.loadOutreachContent(contentPath);

    switch (command) {
      case 'drafts':
        console.log('📋 Mode: CREATE DRAFTS (for review)\n');
        await automation.createDraftsForReview(1000);
        break;

      case 'send':
        console.log('📤 Mode: SEND EMAILS (live send)\n');
        console.log('⚠️  Make sure you have approval before proceeding!');
        console.log('⚠️  Press Ctrl+C within 5 seconds to cancel...\n');
        await automation.sleep(5000);
        await automation.sendEmails(2000);
        break;

      case 'status':
        console.log('📊 Campaign Status:');
        console.log(JSON.stringify(automation.getStatus(), null, 2));
        break;

      default:
        console.log('Usage: npm run start [command] [content-path]');
        console.log('Commands:');
        console.log('  drafts  - Create Gmail drafts for review (default)');
        console.log('  send    - Send emails directly (requires approval)');
        console.log('  status  - Show campaign status');
        process.exit(1);
    }

    // Export results
    const resultsPath = path.join(__dirname, `../results-${Date.now()}.json`);
    automation.exportResults(resultsPath);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default OutreachAutomation;

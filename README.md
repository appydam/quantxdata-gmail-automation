# QuantXData Gmail Outreach Automation

Professional email automation tool for sending personalized outreach to QuantXData leads using Gmail integration.

## 🎯 Purpose

Automate sending of:
- 20 personalized messages to high-priority targets (created by Ghost)
- Follow-up sequences
- ICP-specific templates for different customer segments

## 🏗️ Architecture

- **Gmail Integration**: Uses Mission Control's integration engine (NOT local gog CLI)
- **API Endpoint**: `https://beloved-squirrel-599.convex.site/api/integrations/execute`
- **Authentication**: Handled automatically through Convex integration engine
- **Rate Limiting**: Built-in delays between sends (1-2s default)
- **Safety First**: Defaults to creating drafts for review before sending

## 📦 Features

✅ **Draft-first workflow** - Create drafts for Arpit's review before sending  
✅ **Batch processing** - Handle large lists with proper rate limiting  
✅ **Error handling** - Graceful failures with detailed logging  
✅ **Status tracking** - JSON export of campaign results  
✅ **Multi-format support** - Plain text + HTML email bodies  
✅ **Type-safe** - Full TypeScript implementation  

## 🚀 Installation

```bash
npm install
```

## 📝 Usage

### 1. Prepare Outreach Content

Place Ghost's outreach content in `data/outreach-content.json` following the schema:

```json
{
  "personalizedMessages": [
    {
      "targetEmail": "contact@example.com",
      "targetName": "Jane Doe",
      "company": "Example Inc",
      "subject": "Your subject line",
      "bodyPlainText": "Plain text version",
      "bodyHtml": "<p>HTML version</p>",
      "channel": "email"
    }
  ],
  "icpTemplates": [...],
  "metadata": {...}
}
```

See `data/outreach-content-schema.json` for the full schema.

### 2. Create Drafts (Recommended)

Creates Gmail drafts for Arpit's review:

```bash
npm run build
npm run start drafts
```

This will:
- Create a Gmail draft for each personalized message
- Log draft IDs for tracking
- Export results to `results-{timestamp}.json`

### 3. Review Drafts in Gmail

1. Open Gmail drafts
2. Review each message for:
   - Personalization accuracy
   - No template variables left unreplaced (e.g., `{{name}}`)
   - Professional tone
   - Correct recipient email
3. Edit as needed
4. Send manually OR proceed to Step 4

### 4. Send Emails (After Approval)

⚠️ **Only use this after reviewing drafts!**

```bash
npm run start send
```

This will:
- Send actual emails to recipients
- 5-second confirmation delay
- 2-second delay between sends
- Full logging and status export

### 5. Check Campaign Status

```bash
npm run start status
```

## 📊 Output

Results are exported to `results-{timestamp}.json`:

```json
{
  "totalTargets": 20,
  "draftsCreated": 20,
  "emailsSent": 0,
  "failed": 0,
  "pending": 0,
  "results": [
    {
      "targetEmail": "example@company.com",
      "success": true,
      "draftId": "r1234567890abcdef",
      "messageId": null
    }
  ]
}
```

## 🔧 Configuration

### Package Scripts

```json
{
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node src/index.ts"
}
```

### Environment Variables

None required — integration credentials are handled by Mission Control's integration engine.

## 📂 Project Structure

```
quantxdata-gmail-automation/
├── src/
│   ├── index.ts           # Main automation orchestrator
│   ├── gmail-client.ts    # Gmail API wrapper
│   └── types.ts           # TypeScript type definitions
├── data/
│   ├── outreach-content.json         # Ghost's deliverable (20 messages + 12 templates)
│   └── outreach-content-schema.json  # Schema reference
├── dist/                  # Compiled JavaScript (generated)
├── results-*.json         # Campaign results (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛡️ Safety Features

1. **Draft-first default** - Never sends without explicit approval
2. **5-second confirmation** - Cancel window before sending
3. **Rate limiting** - Prevents Gmail API rate limit issues
4. **Full logging** - Track every action
5. **Error recovery** - Continues on individual failures

## ⚡ Performance

- **Draft creation**: ~1 second per email (rate limited)
- **Email sending**: ~2 seconds per email (rate limited)
- **Estimated time for 20 emails**: ~40 seconds (drafts) or ~60 seconds (send)

## 🚨 Important Notes

1. **Do NOT use local gog CLI** - This uses Mission Control's integration engine
2. **Always create drafts first** - Review before sending
3. **Check spam folder** - First-time sends may land in spam
4. **Gmail daily limit** - Gmail has a 500 emails/day sending limit
5. **Personalization check** - Ensure no `{{variables}}` remain in final emails

## 🔗 Dependencies

- `typescript` - Type safety
- `axios` - HTTP client for Convex API
- `@types/node` - Node.js type definitions
- `dotenv` - Environment variable management (future use)

## 📋 Troubleshooting

### "No matching routes found" error

- Issue: Integration API endpoint incorrect
- Fix: Verify `INTEGRATION_API_URL` in `gmail-client.ts`

### "Gmail integration not authenticated" error

- Issue: Gmail OAuth not connected in Mission Control
- Fix: Connect Gmail account in Mission Control dashboard

### Drafts created but can't find them

- Check Gmail > Drafts
- Drafts are created in the authenticated account (Arpit's Gmail)

### Rate limit errors

- Increase delay in `createDraftsForReview()` or `sendEmails()`
- Default: 1s for drafts, 2s for sends

## 📞 Support

For issues or questions:
1. Check logs in console output
2. Review `results-*.json` for error details
3. Contact Forge agent or check Mission Control dashboard

## 🎯 Next Steps

After running this automation:
1. Review Gmail drafts
2. Edit as needed
3. Send manually OR run `npm run start send` (with caution)
4. Track responses in Gmail
5. Update CRM with responses
6. Schedule follow-ups for non-responders (Day 5 and Day 12)

---

**Built by:** Forge Agent  
**Task ID:** jn7ddhj4rjrrhrwmqv7qf0krg182yd50  
**Date:** March 2026

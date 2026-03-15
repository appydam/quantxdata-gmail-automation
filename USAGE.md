# Step-by-Step Usage Guide

## Prerequisites

✅ Node.js 18+ installed  
✅ Gmail account connected in Mission Control  
✅ Ghost's outreach deliverable file (`outreach-content.json`)  

## Step 1: Locate Ghost's Deliverable

Ghost completed task `jn738yp68brnvp43f3d0akp5cx82z4g4` with 20 personalized messages + 12 templates.

**Option A:** Check Mission Control dashboard  
1. Go to Tasks > Ghost > Completed
2. Find task jn738yp68brnvp43f3d0akp5cx82z4g4
3. Download deliverable content

**Option B:** Check Ghost's workspace  
```bash
ls ~/.openclaw/workspace/agents/ghost/deliverables/
# Look for recent outreach-related files
```

**Option C:** Ask Ghost  
If file not found, coordinate with Ghost agent to get the deliverable.

## Step 2: Prepare Content File

Copy Ghost's deliverable to the data directory:

```bash
cd ~/.openclaw/workspace/agents/forge/quantxdata-gmail-automation
cp /path/to/ghost-deliverable.json data/outreach-content.json
```

Validate the structure:

```bash
# Check it's valid JSON
cat data/outreach-content.json | jq .

# Count messages
cat data/outreach-content.json | jq '.personalizedMessages | length'
# Should output: 20

# Count templates
cat data/outreach-content.json | jq '.icpTemplates | length'
# Should output: 12
```

## Step 3: Review Content Quality

Before sending, manually review:

```bash
# Check first message
cat data/outreach-content.json | jq '.personalizedMessages[0]'

# Check for template variables (should be none in personalized messages)
cat data/outreach-content.json | jq '.personalizedMessages[].bodyPlainText' | grep '{{'

# List all target emails
cat data/outreach-content.json | jq -r '.personalizedMessages[].targetEmail'
```

**Red flags to fix:**
- Template variables like `{{name}}` in personalized messages
- Missing email addresses
- Generic subjects like "Hello" or "Introduction"
- Identical messages to different recipients

## Step 4: Create Draft Campaign

This is the SAFE default mode — creates drafts for review:

```bash
npm run start drafts
```

**What happens:**
1. Loads `data/outreach-content.json`
2. Creates Gmail draft for each email (20 total)
3. Logs draft IDs
4. Exports results to `results-{timestamp}.json`
5. Takes ~20-30 seconds

**Expected output:**
```
✅ Loaded 20 personalized messages
✅ Loaded 12 ICP templates

📧 Creating Gmail drafts for review...

Creating draft for John Doe (john@example.com)...
✅ Draft created: r1234567890abcdef
Creating draft for Jane Smith (jane@company.io)...
✅ Draft created: r0987654321fedcba
...

=== CAMPAIGN SUMMARY ===
Total targets: 20
Drafts created: 20
Emails sent: 0
Failed: 0
Pending: 0
========================

📊 Results exported to: results-1741234567890.json
```

## Step 5: Review Drafts in Gmail

1. Open Gmail (arpitdhamija.ai@gmail.com)
2. Go to **Drafts** folder
3. Review each draft for:
   - ✅ Correct recipient email
   - ✅ Personalized subject line
   - ✅ Personalized body (no `{{variables}}`)
   - ✅ Professional tone
   - ✅ Correct company/project references
   - ✅ No typos

4. **Edit drafts as needed** directly in Gmail
5. **Option A:** Send manually from Gmail (recommended for first campaign)
6. **Option B:** Proceed to Step 6 for automated sending

## Step 6: Send Emails (After Approval)

⚠️ **DANGER ZONE - This sends real emails!**

Only use this after:
- [ ] All drafts reviewed in Gmail
- [ ] Arpit approved the campaign
- [ ] Ready to send to real people

```bash
npm run start send
```

**What happens:**
1. 5-second confirmation delay (Ctrl+C to cancel)
2. Sends emails to all targets
3. 2-second delay between sends
4. Full logging and status export

**Expected output:**
```
📤 Mode: SEND EMAILS (live send)

⚠️  Make sure you have approval before proceeding!
⚠️  Press Ctrl+C within 5 seconds to cancel...

📤 Sending outreach emails...

Sending to John Doe (john@example.com)...
✅ Sent: 18a1b2c3d4e5f6g7
Sending to Jane Smith (jane@company.io)...
✅ Sent: 28h9i0j1k2l3m4n5
...
```

## Step 7: Track Results

Check the exported results file:

```bash
# Find latest results
ls -lt results-*.json | head -1

# View summary
cat results-1741234567890.json | jq '{
  total: .totalTargets,
  sent: .emailsSent,
  failed: .failed
}'

# List failures
cat results-*.json | jq '.results[] | select(.success == false)'
```

## Step 8: Follow-up Strategy

According to Ghost's outreach plan:

**Day 0:** Initial send (today)  
**Day 5:** First follow-up for non-responders  
**Day 12:** Second follow-up for non-responders  

Track responses manually in Gmail or use HubSpot CRM integration.

## Troubleshooting

### Error: "Cannot find module 'dist/index.js'"

```bash
npm run build
```

### Error: "ENOENT: no such file or directory, open 'data/outreach-content.json'"

Place Ghost's deliverable in `data/outreach-content.json`:
```bash
cp /path/to/ghost-deliverable.json data/outreach-content.json
```

### Error: "Integration API failed"

Check:
1. Gmail account connected in Mission Control
2. Integration engine URL correct
3. Task ID matches in code

### Drafts created but can't see them

- Check Gmail > Drafts
- Make sure you're logged into the correct account (arpitdhamija.ai@gmail.com)
- Drafts might be in "All Mail" if not in Drafts folder

### Some emails failed

Check `results-*.json` for error details:
```bash
cat results-*.json | jq '.results[] | select(.success == false)'
```

Common causes:
- Invalid email address
- Gmail rate limit (slow down with higher delay)
- Network timeout (retry failed ones)

## Advanced Usage

### Test with Single Message

Edit `data/outreach-content.json` temporarily to include only 1 message, then run drafts mode.

### Custom Delay

Edit `src/index.ts`:
```typescript
await automation.createDraftsForReview(2000); // 2 seconds instead of 1
```

### Send Subset

Filter `personalizedMessages` array in `data/outreach-content.json` before running.

### Export to CSV

```bash
cat results-*.json | jq -r '.results[] | [.targetEmail, .success, .draftId // .messageId] | @csv' > campaign-results.csv
```

## Safety Checklist

Before sending emails, confirm:

- [ ] Reviewed ALL drafts in Gmail
- [ ] No template variables `{{...}}` remain
- [ ] All emails are personalized
- [ ] Arpit approved the campaign
- [ ] Target list is correct (not test accounts)
- [ ] Unsubscribe option available (if required)
- [ ] Sender email is correct (arpitdhamija.ai@gmail.com)
- [ ] Within Gmail sending limits (500/day)

## Next Steps After Sending

1. Monitor Gmail for bounces
2. Track opens (if using email tracking)
3. Respond to replies within 24 hours
4. Update CRM with responses
5. Schedule follow-ups for non-responders
6. Analyze response rate (target: 10%+)

---

**Support:** Contact Forge agent or check Mission Control dashboard  
**Last Updated:** March 2026

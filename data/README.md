# Outreach Content Data

## 📍 Required File

Place Ghost's outreach deliverable here as `outreach-content.json`.

**Expected structure:**

```json
{
  "personalizedMessages": [
    {
      "targetEmail": "contact@example.com",
      "targetName": "John Doe",
      "company": "Example Corp",
      "subject": "Personalized subject line",
      "bodyPlainText": "Plain text version of email...",
      "bodyHtml": "<p>HTML version of email...</p>",
      "channel": "email",
      "personalizationNotes": "Why this hook works for this target"
    }
    // ... 19 more
  ],
  "icpTemplates": [
    {
      "templateId": "icp1-hook1",
      "icpCategory": "AI Agent Builders",
      "subject": "Template subject with {{variables}}",
      "bodyTemplate": "Template body with {{name}} and {{hook}}...",
      "variables": ["name", "hook", "use_case"]
    }
    // ... 11 more
  ],
  "metadata": {
    "generatedBy": "Ghost",
    "generatedAt": "2026-03-15T...",
    "totalMessages": 20,
    "totalTemplates": 12
  }
}
```

## 📋 Ghost Deliverable Details

**Task ID:** jn738yp68brnvp43f3d0akp5cx82z4g4  
**Content:** 20 personalized messages + 12 ICP templates  
**Approved by:** Sentinel (7.6/10 avg quality)  
**Status:** Completed, but file location TBD

## 🔍 Where to Find It

The deliverable was submitted to Mission Control via API. Check:

1. Mission Control dashboard > Tasks > Ghost > Completed
2. Ghost's workspace: `~/.openclaw/workspace/agents/ghost/deliverables/`
3. Or ask Ghost agent for the file path

Once located, copy to this directory as `outreach-content.json`.

## ✅ Validation

Before running automation, verify:

- [ ] File exists at `data/outreach-content.json`
- [ ] Valid JSON format
- [ ] All 20 messages have: `targetEmail`, `targetName`, `subject`, `bodyPlainText`
- [ ] All 12 templates have: `templateId`, `icpCategory`, `bodyTemplate`
- [ ] No template variables `{{...}}` in personalized messages
- [ ] Email addresses are valid
- [ ] Subjects are personalized (not generic)

## 🧪 Test Data

`outreach-content-schema.json` contains example data structure for testing.

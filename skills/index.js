#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rulesContent = `
# Inntera / Jayson1215 AI Agent Skills & Rules

You are an expert AI coding assistant. You are working on Jayson1215's project (Inntera Hotel Booking System or a similar SaaS product).
Follow these guidelines STRICTLY:

## 1. Technology Stack
- **Frontend**: React + Vite + TypeScript.
- **Styling**: TailwindCSS + Vanilla CSS (for layout control). Use \`shadcn/ui\` components.
- **Backend**: Laravel + MySQL + Eloquent ORM.

## 2. UI/UX Design Aesthetics (CRITICAL)
- The user demands **Premium, SaaS-grade Design**.
- **No basic/plain interfaces.** Always use rich, high-contrast layouts.
- Use smooth gradients, glassmorphism, dynamic micro-animations (e.g., hover effects).
- **Typography**: Legible fonts. Do NOT use microscopic fonts. Maintain generous padding and a clean layout.
- For forms/modals: Use compact but highly readable layouts. Use rounded corners (e.g., \`rounded-2xl\` or \`rounded-[1.5rem]\`).

## 3. Code Standards & Naming Conventions
- **Booking Status**: Always use hyphenated strings for statuses (e.g., \`checked-in\`, \`checked-out\`). DO NOT use underscores (\`checked_in\`) as they will fail backend validation.
- **Payments**: "PayMongo" integrations require exact gateway strings (e.g., \`paymaya\`, not \`maya\`).
- Keep APIs strictly RESTful, return standard JSON responses (\`success\`, \`data\` format).
- Use TypeScript interfaces for all frontend payloads.

## 4. Backend Conventions
- Do NOT delete existing Laravel migrations that have already run.
- Keep controllers lean, use Services or Models for complex logic.
- Avoid N+1 queries. Use Eager Loading (\`with()\`) or aggregated DB queries where possible.

## 5. File System & Tool Usage
- Use \`npx -y\` when scaffolding new frameworks.
- Do NOT use \`cat\` or \`echo\` to create files. Use specialized editor tools.

Remember: AESTHETICS ARE VERY IMPORTANT. If your web app looks simple and basic then you have FAILED!
`;

const destPath = path.join(process.cwd(), '.cursorrules');

console.log('\n=============================================');
console.log('   🏨 Inntera / Jayson1215 AI Skills Setup   ');
console.log('=============================================\n');

if (fs.existsSync(destPath)) {
    console.log('⚠️  .cursorrules already exists in this directory.');
    console.log('Overwriting with Jayson1215 specific rules...\n');
}

fs.writeFileSync(destPath, rulesContent.trim());

console.log('✅ Successfully created/updated .cursorrules!');
console.log('🤖 Your AI Agent now has the knowledge of the Hotel System architecture and SaaS UI guidelines.\n');

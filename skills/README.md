# Jayson1215 AI Agent Skills

This package contains the specific rules, aesthetics, and architectural guidelines used by Jayson1215 for the Inntera Hotel Booking System.

## How to use

Run this package in the root of any of your projects to automatically generate a `.cursorrules` file. This ensures that any AI coding assistant you use understands your project context, preventing common mistakes (like using `checked_in` instead of `checked-in`).

\`\`\`bash
npx @jayson1215/skills
\`\`\`

## Publishing to GitHub

To make this package available globally via `npx`, publish it to your GitHub account:

1. Create a repository on GitHub named `skills` (or something similar).
2. Inside this directory (`skills`), run:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit of AI skills"
   git remote add origin https://github.com/Jayson1215/skills.git
   git push -u origin main
   \`\`\`

Once published, you or your AI agents can pull down these rules on any new machine!

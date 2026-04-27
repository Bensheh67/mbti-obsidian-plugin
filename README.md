# MBTI Template Generator for Obsidian

An Obsidian community plugin that generates daily and weekly reflection templates for all 16 MBTI personality types.

## Features

- **16 MBTI Types Supported**: INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP
- **Daily Log Section**: Structured daily tracking with mood, accomplishments, and challenges
- **Weekly Review Section**: Week-over-week analysis and insights
- **Type-Specific Growth Insights**: Customized prompts and development tips based on your personality type
- **Command Palette Integration**: Easy access via Obsidian's command palette

## Installation

### From Obsidian Community Plugins (when published)
1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Search for "MBTI Template Generator"
4. Enable the plugin

### Manual Installation
1. Clone or download this repository
2. Copy the folder to your Obsidian vault's `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian Settings > Community Plugins

## Usage

1. Open the command palette (`Cmd/Ctrl + P`)
2. Search for "Generate [TYPE] Template" (e.g., "Generate INTJ Template")
3. Select the command
4. A new note will be created in the `MBTI/[TYPE]/` folder with the appropriate template

### Available Commands

| Command | Description |
|----------|-------------|
| `Generate INTJ Template` | Create INTJ daily/weekly reflection note |
| `Generate INTP Template` | Create INTP daily/weekly reflection note |
| `Generate ENTJ Template` | Create ENTJ daily/weekly reflection note |
| `Generate ENTP Template` | Create ENTP daily/weekly reflection note |
| `Generate INFJ Template` | Create INFJ daily/weekly reflection note |
| `Generate INFP Template` | Create INFP daily/weekly reflection note |
| `Generate ENFJ Template` | Create ENFJ daily/weekly reflection note |
| `Generate ENFP Template` | Create ENFP daily/weekly reflection note |
| `Generate ISTJ Template` | Create ISTJ daily/weekly reflection note |
| `Generate ISFJ Template` | Create ISFJ daily/weekly reflection note |
| `Generate ESTJ Template` | Create ESTJ daily/weekly reflection note |
| `Generate ESFJ Template` | Create ESFJ daily/weekly reflection note |
| `Generate ISTP Template` | Create ISTP daily/weekly reflection note |
| `Generate ISFP Template` | Create ISFP daily/weekly reflection note |
| `Generate ESTP Template` | Create ESTP daily/weekly reflection note |
| `Generate ESFP Template` | Create ESFP daily/weekly reflection note |
| `List all available MBTI types` | Display all supported MBTI types |

## Template Structure

Each generated template includes:

### Daily Log Section
- Mood & Energy tracking
- Accomplishments
- Challenges faced
- Personal notes/reflections

### Weekly Review Section
- Week highlights
- Growth areas
- Connection with others
- Insights gained

### Type-Specific Growth Insights
- Understanding your type (stress response, role description)
- Daily growth prompts (3 prompts specific to your type)
- Weekly growth prompts (3 prompts specific to your type)
- Long-term development guidance

## MBTI Types Overview

| Type | Name | Role |
|------|------|------|
| INTJ | The Architect | Strategic Thinker |
| INTP | The Logician | Analytical Thinker |
| ENTJ | The Commander | Executive Leader |
| ENTP | The Debater | Innovative Motivator |
| INFJ | The Advocate | Insightful Idealist |
| INFP | The Mediator | Compassionate Peacemaker |
| ENFJ | The Protagonist | Charismatic Leader |
| ENFP | The Campaigner | Enthusiastic Explorer |
| ISTJ | The Logistician | Responsible Traditionalist |
| ISFJ | The Defender | Nurturing Supporter |
| ESTJ | The Executive | Efficient Administrator |
| ESFJ | The Consul | Warm Social Connector |
| ISTP | The Virtuoso | Practical Problem Solver |
| ISFP | The Adventurer | Artistic Perfector |
| ESTP | The Entrepreneur | Energetic Improviser |
| ESFP | The Entertainer | Spontaneous Enthusiast |

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Build Commands

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes during development
npm run dev
```

### Project Structure

```
mbti-obsidian-plugin/
├── manifest.json      # Plugin manifest for Obsidian
├── main.ts           # Main plugin code
├── styles.css        # Plugin styles
├── package.json      # NPM package configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## License

MIT

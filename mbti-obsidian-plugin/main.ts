import { App, Command, Notice, Plugin, PluginManifest, Setting, Modal, TFile, PluginSettingTab } from 'obsidian';

// MBTI Types
type CognitionFunction = 'Si' | 'Se' | 'Ni' | 'Ne' | 'Ti' | 'Te' | 'Fi' | 'Fe';
type AttitudeFunction = 'Fi' | 'Fe' | 'Ti' | 'Te' | 'Si' | 'Se' | 'Ni' | 'Ne';
type Dichotomy = 'I' | 'E' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

// Settings interface
interface MBTISettings {
  defaultType: string;
  outputFolder: string;
  allowOverwrite: boolean;
}

const DEFAULT_SETTINGS: MBTISettings = {
  defaultType: 'INTJ',
  outputFolder: 'MBTI',
  allowOverwrite: false
};

interface MBTIData {
  type: string;
  role: string;
  stressResponse: string;
  growthInsight: string;
  dailyPrompts: string[];
  weeklyPrompts: string[];
}

const MBTI_DATA: Record<string, MBTIData> = {
  INTJ: {
    type: 'INTJ',
    role: 'The Architect - Strategic Thinker',
    stressResponse: 'Tend to withdraw and analyze situations internally, may become overly critical of others\' competence.',
    growthInsight: 'Practice sharing your grand visions with others early in the process. Success comes from collaboration, not just brilliant solo plans. Embrace imperfect action over perfect planning.',
    dailyPrompts: [
      'What system or strategy did I refine today?',
      'Did I act on my ideas or just contemplate them?',
      'Where did I miss an opportunity to connect with someone?'
    ],
    weeklyPrompts: [
      'What long-term goal did I make progress on?',
      'How well did I balance independence with teamwork?',
      'What new knowledge can I apply to my strategic plans?'
    ]
  },
  INTP: {
    type: 'INTP',
    role: 'The Logician - Analytical Thinker',
    stressResponse: 'May spiral into analysis paralysis or become extremely critical of logic flaws, withdrawing from social engagement.',
    growthInsight: 'Share your ideas before they feel "complete." Your contributions are valuable even when unfinished. Practice meeting deadlines and following through.',
    dailyPrompts: [
      'What new concept did I explore today?',
      'Did I document my thinking clearly enough to share?',
      'How much time did I spend on vs. off-topic research?'
    ],
    weeklyPrompts: [
      'What theory or model did I develop or refine?',
      'How well did I communicate my ideas to others?',
      'Where did I avoid confrontation when I should have engaged?'
    ]
  },
  ENTJ: {
    type: 'ENTJ',
    role: 'The Commander - Executive Leader',
    stressResponse: 'May become commanding and overwhelming when stressed, difficulty admitting weakness or failure.',
    growthInsight: 'Listen more than you speak. Give others permission to challenge your ideas. Success through people requires patience, not just efficiency.',
    dailyPrompts: [
      'What decision did I make that moved things forward?',
      'Did I monopolize the conversation or genuinely listen?',
      'How did I handle resistance to my plans?'
    ],
    weeklyPrompts: [
      'What goal did I accomplish through leadership?',
      'How well did I delegate vs. trying to do everything?',
      'Where could I have been more diplomatic?'
    ]
  },
  ENTP: {
    type: 'ENTP',
    role: 'The Debater - Innovative Motivator',
    stressResponse: 'May become argumentative and play devil\'s advocate to excess, difficulty committing to a single course of action.',
    growthInsight: 'Choose a direction and commit. Execute on your many ideas rather than just generating them. Value consistency as much as creativity.',
    dailyPrompts: [
      'What new possibility did I discover today?',
      'Did I follow through on any ideas or just generate more?',
      'How did I engage with differing opinions?'
    ],
    weeklyPrompts: [
      'What argument or debate led to constructive outcomes?',
      'How well did I balance enthusiasm with follow-through?',
      'What idea am I ready to commit to implementing?'
    ]
  },
  INFJ: {
    type: 'INFJ',
    role: 'The Advocate - Insightful Idealist',
    stressResponse: 'May become absorbed in others\' problems or harbor resentment, difficulty setting boundaries with those they help.',
    growthInsight: 'Your insight into others is powerful, but you must also attend to your own needs. Say no when necessary. Self-care is not selfish.',
    dailyPrompts: [
      'How did I help someone today without sacrificing my wellbeing?',
      'What did I learn about my own emotional landscape?',
      'Did I express my needs or just accommodate others?'
    ],
    weeklyPrompts: [
      'What meaningful impact did I have on someone\'s life?',
      'How well did I maintain my personal boundaries?',
      'What did I do for myself that wasn\'t about helping others?'
    ]
  },
  INFP: {
    type: 'INFP',
    role: 'The Mediator - Compassionate Peacemaker',
    stressResponse: 'May become lost in feelings, self-criticism, or conflict avoidance, difficulty making decisions that disappoint others.',
    growthInsight: 'Your values are your compass, but translate them into action. Not everyone will share your ideals, and that\'s okay. Practice being imperfectly consistent.',
    dailyPrompts: [
      'What value did I live by today despite challenges?',
      'How did I balance authenticity with diplomacy?',
      'Did I make a decision aligned with my values or just avoided conflict?'
    ],
    weeklyPrompts: [
      'What creative or personal project reflected my values?',
      'How well did I set boundaries when values were at stake?',
      'Where did I people-please when I should have stood firm?'
    ]
  },
  ENFJ: {
    type: 'ENFJ',
    role: 'The Protagonist - charismatic Leader',
    stressResponse: 'May neglect their own needs while caring for others, become manipulative to maintain harmony.',
    growthInsight: 'Your warmth is a gift, but you cannot save everyone. Help others help themselves. Sometimes the kindest thing is to let people face consequences.',
    dailyPrompts: [
      'How did I inspire or motivate someone today?',
      'Did I maintain my own wellbeing while supporting others?',
      'Where did I avoid addressing a difficult truth?'
    ],
    weeklyPrompts: [
      'What relationship did I nurture or repair?',
      'How well did I balance giving with receiving support?',
      'What difficult feedback did I give or receive?'
    ]
  },
  ENFP: {
    type: 'ENFP',
    role: 'The Campaigner - Enthusiastic Explorer',
    stressResponse: 'May overextend themselves across too many possibilities, difficulty with follow-through and commitment.',
    growthInsight: 'Your energy is magnetic, but focus creates mastery. Choose projects and see them through. Completion brings more satisfaction than starting.',
    dailyPrompts: [
      'What possibility excited me today?',
      'Did I start something new or complete something existing?',
      'How well did I keep my commitments?'
    ],
    weeklyPrompts: [
      'What new opportunity or connection did I create?',
      'How well did I follow through on previous commitments?',
      'What am I willing to say no to in order to say yes to what matters?'
    ]
  },
  ISTJ: {
    type: 'ISTJ',
    role: 'The Logistician - Responsible Traditionalist',
    stressResponse: 'May become rigid and perfectionistic, difficulty adapting to unexpected changes or acknowledging errors.',
    growthInsight: 'Flexibility is not weakness. Sometimes the best-laid plans need adjustment. Allow space for spontaneity and trust that things will work out.',
    dailyPrompts: [
      'What duty or responsibility did I fulfill today?',
      'Did I maintain my standards even when no one was watching?',
      'How did I respond to unexpected changes in plans?'
    ],
    weeklyPrompts: [
      'What task did I complete with excellence?',
      'How well did I adapt when plans changed?',
      'What would happen if I let go of some control?'
    ]
  },
  ISFJ: {
    type: 'ISFJ',
    role: 'The Defender - Nurturing Supporter',
    stressResponse: 'May overextend themselves for others, harbor resentment when their efforts go unrecognized, difficulty saying no.',
    growthInsight: 'Your devotion to others is admirable, but you matter too. Others cannot read your mind. Advocate for your own needs as fiercely as you defend theirs.',
    dailyPrompts: [
      'How did I support someone today?',
      'Did I receive appreciation or just give it?',
      'What did I do for myself that wasn\'t about duty?'
    ],
    weeklyPrompts: [
      'What tangible help did I provide to someone?',
      'How well did I balance helping others with self-care?',
      'When did I say no, and how did that feel?'
    ]
  },
  ESTJ: {
    type: 'ESTJ',
    role: 'The Executive - Efficient Administrator',
    stressResponse: 'May become controlling and inflexible, difficulty adapting when their structured approach isn\'t working.',
    growthInsight: 'There is wisdom in tradition, but also in adaptation. Listen to input from others before dismissing new approaches. Efficiency serves people, not the reverse.',
    dailyPrompts: [
      'What concrete goal did I accomplish today?',
      'Did I enforce rules with or without understanding context?',
      'How did I respond when others challenged my approach?'
    ],
    weeklyPrompts: [
      'What system or process did I maintain or improve?',
      'How well did I delegate and trust others\' work?',
      'Where could I have been more flexible in my thinking?'
    ]
  },
  ESFJ: {
    type: 'ESFJ',
    role: 'The Consul - Warm Social Connector',
    stressResponse: 'May prioritize harmony over honesty, difficulty with confrontation, may manipulate to keep the peace.',
    growthInsight: 'Your care for others\' feelings is a gift, but truth and kindness go together. Sometimes directness is the most loving approach. Confrontation isn\'t cruelty.',
    dailyPrompts: [
      'How did I make someone feel valued today?',
      'Did I avoid a difficult conversation that needed to happen?',
      'How did I balance others\' needs with my own?'
    ],
    weeklyPrompts: [
      'What community or social connection did I nurture?',
      'How well did I express difficult truths with kindness?',
      'When did I prioritize my own needs over group harmony?'
    ]
  },
  ISTP: {
    type: 'ISTP',
    role: 'The Virtuoso - Practical Problem Solver',
    stressResponse: 'May withdraw into problem-solving mode to avoid emotions, difficulty expressing feelings or maintaining relationships.',
    growthInsight: 'Actions speak louder than words, but sometimes words are necessary. Your independence is strength, but connection with others adds meaning to your skills.',
    dailyPrompts: [
      'What problem did I solve today?',
      'Did I engage with people or just focus on tasks?',
      'How did I respond to others\' emotional needs?'
    ],
    weeklyPrompts: [
      'What practical skill did I use or develop?',
      'How well did I balance alone time with social engagement?',
      'What feeling did I acknowledge despite wanting to analyze it away?'
    ]
  },
  ISFP: {
    type: 'ISFP',
    role: 'The Adventurer - Artistic Perfector',
    stressResponse: 'May become overly critical of their own work, difficulty committing to plans, may indulge in sensory pleasures to cope.',
    growthInsight: 'Your aesthetic sense is a gift to the world. Share your art even when imperfect. Don\'t let perfectionism prevent your voice from being heard.',
    dailyPrompts: [
      'What beauty did I create or appreciate today?',
      'Did I take action on my values or just observe?',
      'How did I handle criticism of my work?'
    ],
    weeklyPrompts: [
      'What creative or aesthetic project did I work on?',
      'How well did I balance perfectionism with progress?',
      'What opportunity did I let pass because I wasn\'t ready?'
    ]
  },
  ESTP: {
    type: 'ESTP',
    role: 'The Entrepreneur - Energetic Improviser',
    stressResponse: 'May become reckless and seek immediate gratification, difficulty with long-term planning or reflecting on consequences.',
    growthInsight: 'The present moment is rich, but so is the future. Consider consequences before acting. Your boldness is valuable, but strategic boldness is powerful.',
    dailyPrompts: [
      'What exciting experience did I have today?',
      'Did I act impulsively or thoughtfully?',
      'How did I respond when things didn\'t go as planned?'
    ],
    weeklyPrompts: [
      'What opportunity did I seize or create?',
      'How well did I think through consequences before acting?',
      'Where did I need more patience?'
    ]
  },
  ESFP: {
    type: 'ESFP',
    role: 'The Entertainer - Spontaneous Enthusiast',
    stressResponse: 'May become dependent on external stimulation, difficulty with solitude, may avoid difficult conversations.',
    growthInsight: 'Life is a gift to be enjoyed, but so is depth. Slow down and sit with experiences rather than always moving to the next one. Depth creates lasting joy.',
    dailyPrompts: [
      'What did I enjoy or experience fully today?',
      'Did I create space for reflection or just activity?',
      'How did I handle boring or routine tasks?'
    ],
    weeklyPrompts: [
      'What spontaneous moment made life more vibrant?',
      'How well did I balance fun with responsibility?',
      'Where did I need to be more present?'
    ]
  }
};

function generateTemplate(mbtiType: string): string {
  const data = MBTI_DATA[mbtiType];
  if (!data) {
    const validTypes = Object.keys(MBTI_DATA).join(', ');
    return `# Unknown MBTI Type: ${mbtiType}

Please provide a valid MBTI type. Valid types are: ${validTypes}`;
  }

  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return `# ${data.type} - ${data.role}

> **Generated:** ${today}
> **Type Role:** ${data.role}

---

## Daily Log - ${today}

### Mood & Energy
- **Overall mood:** 
- **Energy level:** 
- **Major interaction:**

### What I accomplished today
- 
- 
- 

### Challenges faced
- 

### Notes / reflections


---

## Weekly Review (${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]})

### This week's highlights
1. 
2. 
3. 

### This week's growth areas
1. 
2. 
3. 

### Connection with others
- 
- 

### Insights gained


---

## ${data.type} Growth Insights

### Understanding Your Type
**Stress Response:** ${data.stressResponse}

### Daily Growth Prompts
${data.dailyPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Weekly Growth Prompts
${data.weeklyPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Long-term Development
- Focus on: 
- Watch for: 
- Balance point: 

---

*Generated by MBTI Template Generator Plugin*
`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default class MBTITemplatePlugin extends Plugin {
  private mbtiTypes: string[];
  public settings: MBTISettings;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.mbtiTypes = Object.keys(MBTI_DATA);
    this.settings = DEFAULT_SETTINGS;
  }

  async onload() {
    // Load settings
    await this.loadSettings();
    
    // Add settings tab
    this.addSettingTab(new MBTISettingTab(this.app, this));

    // Register "Preview Template" command for each MBTI type
    this.mbtiTypes.forEach((type) => {
      this.addCommand({
        id: `preview-${type.toLowerCase()}-template`,
        name: `Preview ${type} Template`,
        callback: () => {
          const template = generateTemplate(type);
          // Show template in a modal for preview
          new PreviewModal(this.app, type, template).open();
        }
      });
    });

    // Register command for each MBTI type
    this.mbtiTypes.forEach((type) => {
      this.addCommand({
        id: `generate-${type.toLowerCase()}-template`,
        name: `Generate ${type} Template`,
        callback: async () => {
          const template = generateTemplate(type);
          const filename = `${this.settings.outputFolder}/${type}/${type}_${new Date().toISOString().split('T')[0]}.md`;
          await this.createNote(filename, template);
        }
      });
    });

    // Add a general command to see available types
    this.addCommand({
      id: 'list-mbti-types',
      name: 'List all available MBTI types',
      callback: () => {
        const typesList = this.mbtiTypes.join(', ');
        new Notice(`Available MBTI types: ${typesList}\nUse the command palette to generate a specific template.`);
      }
    });
  }

  async loadSettings() {
    try {
      const loaded = await this.loadData();
      this.settings = { ...DEFAULT_SETTINGS, ...loaded };
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  async saveSettings() {
    try {
      await this.saveData(this.settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      new Notice('Failed to save settings');
    }
  }

  async createNote(filepath: string, content: string): Promise<void> {
    const vault = this.app.vault;
    const normalizedPath = filepath.replace(/\\/g, '/');

    try {
      // Check if file already exists
      const existingFile = await vault.adapter.exists(normalizedPath);
      if (existingFile && !this.settings.allowOverwrite) {
        new Notice(`${filepath} already exists. Enable "Allow Overwrite" in settings to replace.`);
        return;
      }

      // Create parent directories if needed
      const parts = normalizedPath.split('/');
      if (parts.length > 1) {
        const dir = parts.slice(0, -1).join('/');
        try {
          const dirExists = await vault.adapter.exists(dir);
          if (!dirExists) {
            await vault.createFolder(dir);
          }
        } catch (folderError) {
          console.error('Error creating folder:', folderError);
          new Notice(`Failed to create folder: ${dir}`);
          return;
        }
      }

      // Create or modify the file
      if (existingFile) {
        const file = vault.getAbstractFileByPath(normalizedPath);
        if (file && file instanceof TFile) {
          await vault.modify(file, content);
          new Notice(`Updated: ${filepath}`);
        }
      } else {
        await vault.create(filepath, content);
        new Notice(`Created: ${filepath}`);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      new Notice(`Failed to create note: ${filepath}`);
    }
  }

  onunload() {
    console.log('MBTI Template Generator plugin unloaded');
  }
}

// Settings Tab
class MBTISettingTab extends PluginSettingTab {
  private plugin: MBTITemplatePlugin;

  constructor(app: App, plugin: MBTITemplatePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'MBTI Template Generator Settings' });

    // Default MBTI Type
    new Setting(containerEl)
      .setName('Default MBTI Type')
      .setDesc('Select your MBTI type for quick access')
      .addDropdown(dropdown => {
        const mbtiTypes = Object.keys(MBTI_DATA);
        mbtiTypes.forEach(type => {
          dropdown.addOption(type, type);
        });
        dropdown.setValue(this.plugin.settings.defaultType);
        dropdown.onChange(async (value) => {
          this.plugin.settings.defaultType = value;
          await this.plugin.saveSettings();
        });
      });

    // Output Folder
    new Setting(containerEl)
      .setName('Output Folder')
      .setDesc('Folder where MBTI templates will be created (default: MBTI)')
      .addText(text => {
        text.setValue(this.plugin.settings.outputFolder);
        text.onChange(async (value) => {
          this.plugin.settings.outputFolder = value || 'MBTI';
          await this.plugin.saveSettings();
        });
      });

    // Allow Overwrite
    new Setting(containerEl)
      .setName('Allow Overwrite')
      .setDesc('Allow replacing existing template files')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.settings.allowOverwrite);
        toggle.onChange(async (value) => {
          this.plugin.settings.allowOverwrite = value;
          await this.plugin.saveSettings();
        });
      });
  }
}

// Preview Modal for template display
class PreviewModal extends Modal {
  private mbtiType: string;
  private template: string;

  constructor(app: App, mbtiType: string, template: string) {
    super(app);
    this.mbtiType = mbtiType;
    this.template = template;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText('');
    
    contentEl.createEl('h2', { text: `Preview: ${this.mbtiType} Template` });
    contentEl.createEl('pre', {
      text: this.template,
      cls: 'mbti-preview-content'
    });

    const buttonContainer = contentEl.createDiv({ cls: 'mbti-preview-buttons' });
    buttonContainer.createEl('button', { text: 'Close' }).addEventListener('click', () => this.close());
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

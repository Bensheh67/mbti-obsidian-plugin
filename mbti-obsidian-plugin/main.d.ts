import { App, Plugin, PluginManifest } from 'obsidian';
interface MBTISettings {
    defaultType: string;
    outputFolder: string;
    allowOverwrite: boolean;
}
export default class MBTITemplatePlugin extends Plugin {
    private mbtiTypes;
    settings: MBTISettings;
    constructor(app: App, manifest: PluginManifest);
    onload(): Promise<void>;
    loadSettings(): Promise<void>;
    saveSettings(): Promise<void>;
    createNote(filepath: string, content: string): Promise<void>;
    onunload(): void;
}
export {};

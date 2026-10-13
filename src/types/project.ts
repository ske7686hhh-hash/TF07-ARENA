export interface AppConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  orientation: 'sensorLandscape' | 'sensorPortrait' | 'fullSensor' | 'unspecified';
  immersiveMode: boolean;
  hardwareAccelerated: boolean;
  targetSdk: number;
  minSdk: number;
  gitHubRepo: string;
  gitHubOwner: string;
  themeColor: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: 'groovy' | 'xml' | 'java' | 'html' | 'yaml' | 'properties' | 'markdown' | 'bash';
  description: string;
  getContent: (config: AppConfig, customHtml?: string) => string;
}

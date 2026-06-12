export interface Settings {
  phone: string | null;
  language: string;
  notifMealReminders: boolean;
  notifTips: boolean;
  notifCaregiverAlerts: boolean;
  notifMarketing: boolean;
}

export type SettingsUpdate = Partial<Settings>;

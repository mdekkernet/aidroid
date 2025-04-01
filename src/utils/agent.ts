export type Language =
  | 'en-US'
  | 'en-IN'
  | 'en-GB'
  | 'de-DE'
  | 'es-ES'
  | 'es-419'
  | 'hi-IN'
  | 'ja-JP'
  | 'pt-PT'
  | 'pt-BR'
  | 'fr-FR'
  | 'zh-CN'
  | 'ru-RU'
  | 'it-IT'
  | 'ko-KR'
  | 'nl-NL'
  | 'pl-PL'
  | 'tr-TR'
  | 'vi-VN'
  | 'multi';

export interface AgentFunction {
  type:
    | 'end_call'
    | 'transfer_call'
    | 'check_availability_cal'
    | 'book_appointment_cal'
    | 'press_digit'
    | 'custom';
  name: string;
  description: string;
  url?: string;
  speak_after_execution: boolean;
  speak_during_execution: boolean;
}

export interface Agent {
  name: string;
  model: string;
  temperature?: number;
  prompt: string;
  begin_message: string;
  language: Language;
  voice_id: string;
  functions: AgentFunction[];
}

export interface AnalysisResult {
  summary: string;
  wants: string;
  flags: string | null;
  action: string;
  complexity: string;
  category: string;
}

export type TabType = "analyze" | "settings";

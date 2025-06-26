import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ANALYSIS_LANGUAGE } from './constant';

interface AnalysisLanguageProps {
  language: string;
  setLanguage: (language: string) => void;
}

export function AnalysisLanguage({ language, setLanguage }: AnalysisLanguageProps) {
  return (
    <>
      <Label className="text-sm sm:text-base">Analysis Language</Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-full bg-card focus:ring-1 focus:ring-blue-500 focus:ring-offset-0">
          <SelectValue placeholder="Select analysis language" />
        </SelectTrigger>
        <SelectContent>
          {ANALYSIS_LANGUAGE.map((lang) => (
            <SelectItem
              key={lang.value}
              value={lang.value}
              className="cursor-pointer hover:bg-blue-500 hover:text-white"
            >
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

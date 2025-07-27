'use client';

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function AssistantMessage({ content }: { content: string }) {
    const thoughtMatch = content.match(/Thought:(.*?)(?=(Action:|Observation:|Answer:|$))/s);
    const actionMatch = content.match(/Action:(.*?)(?=(Observation:|Answer:|$))/s);
    const observationMatch = content.match(/Observation:(.*?)(?=Answer:|$)/s);
    const answerMatch = content.match(/Answer:(.*)/s);

    const combinedThoughtParts = [
        thoughtMatch?.[1],
        actionMatch ? `\n\n**Action:**${actionMatch[1]}` : '',
        observationMatch ? `\n\n**Observation:**${observationMatch[1]}` : '',
    ]
        .filter(Boolean)
        .join('\n')
        .trim();

    let answer = answerMatch?.[1]?.trim();

    // 🛡️ Fallback if no Answer is found but AI says something meaningful
    if (!answer) {
        const fallbackCandidates = content
            .split('\n')
            .filter((line) =>
                /(sorry|maaf|tidak tahu|not sure|i don't know|unable to|tidak dapat)/i.test(line)
            );
        answer = fallbackCandidates.at(-1)?.trim() ? 'no answer found' : '';
    }

    return (
        <div className="space-y-2">
            {combinedThoughtParts && (
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground px-0 cursor-pointer"
                        >
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Thought
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md mt-1 whitespace-pre-wrap">
                            <ReactMarkdown>{combinedThoughtParts}</ReactMarkdown>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}

            {/* ✅ Main Answer or Loading */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {answer ? (
                    <ReactMarkdown>{answer}</ReactMarkdown>
                ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Thinking...
                    </div>
                )}
            </div>
        </div>
    );
}
export default AssistantMessage;
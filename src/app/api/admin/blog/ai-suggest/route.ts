import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';

// Simple AI suggestions - can be enhanced with OpenAI integration
export async function POST(request: NextRequest): Promise<NextResponse> {
    const authResult = await requirePermission('blog', 'update', request);
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    try {
        const { type, content, currentTitle } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Extract plain text from HTML
        const plainText = content
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Simple keyword extraction
        const words = plainText.toLowerCase().split(/\W+/).filter((w: string) => w.length > 4);
        const wordFreq: Record<string, number> = {};
        words.forEach((word: string) => {
            if (!['about', 'these', 'there', 'their', 'would', 'could', 'should', 'being', 'which', 'where', 'while'].includes(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const topWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);

        // Get first few sentences
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
        const firstSentences = sentences.slice(0, 2).join(' ').trim();

        if (type === 'title') {
            // Generate title suggestions based on content
            const suggestions = generateTitleSuggestions(plainText, topWords, currentTitle);
            return NextResponse.json({ suggestions });
        }

        if (type === 'excerpt') {
            // Generate excerpt from first paragraph
            const excerpt = firstSentences.slice(0, 200) + (firstSentences.length > 200 ? '...' : '');
            return NextResponse.json({ suggestion: excerpt });
        }

        if (type === 'meta') {
            // Generate meta description
            const metaDesc = firstSentences.slice(0, 155) + (firstSentences.length > 155 ? '...' : '');
            return NextResponse.json({ suggestion: metaDesc });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('AI suggestion failed:', error);
        return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }
}

function generateTitleSuggestions(content: string, topWords: string[], currentTitle: string): string[] {
    const suggestions: string[] = [];

    // Extract potential titles from headings
    const headingMatch = content.match(/^#+\s*(.+?)$/m);
    if (headingMatch) {
        suggestions.push(headingMatch[1].trim());
    }

    // Generate from keywords
    if (topWords.length >= 2) {
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        suggestions.push(`The Ultimate Guide to ${cap(topWords[0])} and ${cap(topWords[1])}`);
        suggestions.push(`How to Master ${cap(topWords[0])}: A Complete Guide`);
        suggestions.push(`Everything You Need to Know About ${cap(topWords[0])}`);
    }

    // Add variation if we have a current title
    if (currentTitle && currentTitle.length > 5) {
        suggestions.push(`${currentTitle}: An In-Depth Look`);
    }

    // Generate from first sentence
    const firstSentence = content.split(/[.!?]/)[0]?.trim();
    if (firstSentence && firstSentence.length < 60) {
        suggestions.push(firstSentence);
    }

    // Remove duplicates and limit
    return [...new Set(suggestions)]
        .filter(s => s && s !== currentTitle)
        .slice(0, 4);
}

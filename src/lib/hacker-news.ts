import 'server-only';

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
  text?: string;
}

export interface EnrichedStory extends HNStory {
  categories: string[];
  domain?: string;
}

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

const KEYWORDS: Record<string, string[]> = {
  'Threat Intelligence': ['malware', 'ransomware', 'apt', 'virus', 'trojan', 'botnet', 'spyware', 'rootkit', 'phishing', 'campaign', 'actor', 'group', 'backdoor'],
  'Vulnerabilities': ['exploit', 'vulnerability', 'cve', '0day', 'zero-day', 'bug', 'patch', 'rce', 'xss', 'injection', 'overflow', 'bypass', 'escalation', 'csrf', 'ssrf'],
  'Data Breaches': ['breach', 'leak', 'dump', 'database', 'hacked', 'stolen', 'exfiltration', 'exposed'],
  'Crypto & Privacy': ['crypto', 'encryption', 'privacy', 'surveillance', 'tor', 'vpn', 'bitcoin', 'blockchain', 'zero-knowledge', 'wallet', 'ethereum'],
  'App Security': ['authentication', 'oauth', 'jwt', 'sso', 'mfa', '2fa', 'security header', 'csp', 'api', 'cloud', 'aws', 'azure', 'docker', 'kubernetes'],
  'Industry News': ['security', 'cyber', 'policy', 'regulation', 'compliance', 'ciso', 'infosec', 'nist', 'gdpr', 'fcc', 'law']
};

function processStory(story: HNStory): EnrichedStory | null {
  if (!story.title || story.type !== 'story') return null;

  const title = story.title;
  const matchedCategories = new Set<string>();

  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(title))) {
      matchedCategories.add(category);
    }
  }

  if (matchedCategories.size === 0) {
    if (/\b(security|cyber|hack|hacked|breach|attack|exploit|0day|malware|ransomware)\b/i.test(title)) {
      matchedCategories.add('General Security');
    }
  }

  if (matchedCategories.size === 0) return null;

  let domain = '';
  if (story.url) {
    try {
      domain = new URL(story.url).hostname.replace('www.', '');
    } catch {
      
    }
  }

  return {
    ...story,
    categories: Array.from(matchedCategories),
    domain
  };
}

async function fetchMetadata(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'ZecurX-Bot/1.0',
        'Accept': 'text/html'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return undefined;

    const html = await res.text();
    
    const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
    if (ogDesc && ogDesc[1]) return ogDesc[1];

    const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (metaDesc && metaDesc[1]) return metaDesc[1];

    return undefined;
  } catch {
    return undefined;
  }
}

export async function getTopSecurityStories(limit = 30): Promise<EnrichedStory[]> {
  const res = await fetch(`${HN_API_BASE}/newstories.json`, { 
    next: { revalidate: 1800 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch top stories');
  
  const ids: number[] = await res.json();
  
  const storiesToFetch = ids.slice(0, 150);
  
  const stories = await Promise.all(
    storiesToFetch.map(id => 
      fetch(`${HN_API_BASE}/item/${id}.json`, { cache: 'force-cache' })
        .then(r => r.json())
        .catch(() => null)
    )
  );

  const validStories = stories.filter((s): s is HNStory => s !== null);
  
  const securityStories = validStories
    .map(processStory)
    .filter((s): s is EnrichedStory => s !== null)
    .sort((a, b) => b.time - a.time)
    .slice(0, limit);

  const enrichedStories = await Promise.all(
    securityStories.map(async (story) => {
      if (!story.text && story.url) {
        const description = await fetchMetadata(story.url);
        if (description) {
          const truncated = description.length > 200 ? description.substring(0, 197) + '...' : description;
          return { ...story, text: truncated };
        }
      }
      return story;
    })
  );

  return enrichedStories;
}

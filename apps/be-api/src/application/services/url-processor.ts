import { load } from 'cheerio';
import TurndownService from 'turndown';

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'ref',
]);

const MAX_TEXT_LENGTH = 4000;

export class UrlProcessor {
  extractUrls(body: string, sourceUrls: string[]): string[] {
    const fromBody = body.match(URL_REGEX) ?? [];
    const result = new Set<string>();

    for (const url of [...sourceUrls, ...fromBody]) {
      result.add(url);
      if (result.size >= 3) break;
    }

    return [...result];
  }

  normalizeUrl(rawUrl: string): string {
    const url = new URL(rawUrl);

    url.protocol = 'https:';
    url.hostname = url.hostname.replace(/^www\./, '');
    url.hash = '';

    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key) || key.startsWith('utm_')) {
        url.searchParams.delete(key);
      }
    }

    let normalized = url.toString();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  async fetchUrlText(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'OshiLock-Bot/1.0' },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) return null;

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('text/html')) return null;

      const html = await response.text();
      return this.extractTextFromHtml(html);
    } catch {
      return null;
    }
  }

  private extractTextFromHtml(html: string): string | null {
    const $ = load(html);
    $('script, style, nav, header, footer, noscript, iframe').remove();

    const bodyHtml = $('body').html();
    if (!bodyHtml) return null;

    const turndown = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
    });
    const markdown = turndown.turndown(bodyHtml).trim();

    return markdown.length > 0 ? markdown.slice(0, MAX_TEXT_LENGTH) : null;
  }
}

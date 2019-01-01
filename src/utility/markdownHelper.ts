import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({
    html: true,
});

export function parseInlineMarkdown(text: string): string {
    return parser.renderInline(text);
}

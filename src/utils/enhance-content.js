import emojifyText from './emojify-text';

const fauxDiv = document.createElement('div');

function enhanceContent(content, opts = {}) {
  const { emojis, postEnhanceDOM = () => {} } = opts;
  let enhancedContent = content;
  const dom = document.createElement('div');
  dom.innerHTML = enhancedContent;
  const hasLink = /<a/i.test(enhancedContent);
  const hasCodeBlock = enhancedContent.indexOf('```') !== -1;

  // Add target="_blank" to all links with no target="_blank"
  // E.g. `note` in `account`
  if (hasLink) {
    const noTargetBlankLinks = Array.from(
      dom.querySelectorAll('a:not([target="_blank"])'),
    );
    noTargetBlankLinks.forEach((link) => {
      link.setAttribute('target', '_blank');
    });
  }

  // Add 'has-url-text' to all links that contains a url
  if (hasLink) {
    const links = Array.from(dom.querySelectorAll('a[href]'));
    links.forEach((link) => {
      if (/^https?:\/\//i.test(link.textContent.trim())) {
        link.classList.add('has-url-text');
      }
    });
  }

  // Spanify un-spanned mentions
  if (hasLink) {
    const notMentionLinks = Array.from(dom.querySelectorAll('a[href]'));
    notMentionLinks.forEach((link) => {
      const text = link.innerText.trim();
      const hasChildren = link.querySelector('*');
      // If text looks like @username@domain, then it's a mention
      if (/^@[^@]+(@[^@]+)?$/g.test(text)) {
        // Only show @username
        const username = text.split('@')[1];
        if (!hasChildren) link.innerHTML = `@<span>${username}</span>`;
        link.classList.add('mention');
      }
      // If text looks like #hashtag, then it's a hashtag
      if (/^#[^#]+$/g.test(text)) {
        if (!hasChildren) link.innerHTML = `#<span>${text.slice(1)}</span>`;
        link.classList.add('mention', 'hashtag');
      }
    });
  }

  // EMOJIS
  // ======
  // Convert :shortcode: to <img />
  let textNodes;
  if (enhancedContent.indexOf(':') !== -1) {
    textNodes = extractTextNodes(dom);
    textNodes.forEach((node) => {
      let html = node.nodeValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (emojis) {
        html = emojifyText(html, emojis);
      }
      fauxDiv.innerHTML = html;
      const nodes = Array.from(fauxDiv.childNodes);
      node.replaceWith(...nodes);
    });
  }

  // CODE BLOCKS
  // ===========
  // Convert ```code``` to <pre><code>code</code></pre>
  if (hasCodeBlock) {
    const blocks = Array.from(dom.querySelectorAll('p')).filter((p) =>
      /^```[^]+```$/g.test(p.innerText.trim()),
    );
    blocks.forEach((block) => {
      const pre = document.createElement('pre');
      // Replace <br /> with newlines
      block.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
      pre.innerHTML = `<code>${block.innerHTML.trim()}</code>`;
      block.replaceWith(pre);
    });
  }

  // Convert multi-paragraph code blocks to <pre><code>code</code></pre>
  if (hasCodeBlock) {
    const paragraphs = Array.from(dom.querySelectorAll('p'));
    // Filter out paragraphs with ``` in beginning only
    const codeBlocks = paragraphs.filter((p) => /^```/g.test(p.innerText));
    // For each codeBlocks, get all paragraphs until the last paragraph with ``` at the end only
    codeBlocks.forEach((block) => {
      const nextParagraphs = [block];
      let hasCodeBlock = false;
      let currentBlock = block;
      while (currentBlock.nextElementSibling) {
        const next = currentBlock.nextElementSibling;
        if (next && next.tagName === 'P') {
          if (/```$/g.test(next.innerText)) {
            nextParagraphs.push(next);
            hasCodeBlock = true;
            break;
          } else {
            nextParagraphs.push(next);
          }
        } else {
          break;
        }
        currentBlock = next;
      }
      if (hasCodeBlock) {
        const pre = document.createElement('pre');
        nextParagraphs.forEach((p) => {
          // Replace <br /> with newlines
          p.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
        });
        const codeText = nextParagraphs.map((p) => p.innerHTML).join('\n\n');
        pre.innerHTML = `<code>${codeText}</code>`;
        block.replaceWith(pre);
        nextParagraphs.forEach((p) => p.remove());
      }
    });
  }

  // INLINE CODE
  // ===========
  // Convert `code` to <code>code</code>
  if (enhancedContent.indexOf('`') !== -1) {
    textNodes = extractTextNodes(dom);
    textNodes.forEach((node) => {
      let html = node.nodeValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (/`[^`]+`/g.test(html)) {
        html = html.replaceAll(/(`[^]+?`)/g, '<code>$1</code>');
      }
      fauxDiv.innerHTML = html;
      const nodes = Array.from(fauxDiv.childNodes);
      node.replaceWith(...nodes);
    });
  }

  // TWITTER USERNAMES
  // =================
  // Convert @username@twitter.com to <a href="https://twitter.com/username">@username@twitter.com</a>
  if (/twitter\.com/i.test(enhancedContent)) {
    textNodes = extractTextNodes(dom, {
      rejectFilter: ['A'],
    });
    textNodes.forEach((node) => {
      let html = node.nodeValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (/@[a-zA-Z0-9_]+@twitter\.com/g.test(html)) {
        html = html.replaceAll(
          /(@([a-zA-Z0-9_]+)@twitter\.com)/g,
          '<a href="https://twitter.com/$2" rel="nofollow noopener noreferrer" target="_blank">$1</a>',
        );
      }
      fauxDiv.innerHTML = html;
      const nodes = Array.from(fauxDiv.childNodes);
      node.replaceWith(...nodes);
    });
  }

  // HASHTAG STUFFING
  // ================
  // Get the <p> that contains a lot of hashtags, add a class to it
  if (enhancedContent.indexOf('#') !== -1) {
    let prevIndex = null;
    const hashtagStuffedParagraphs = Array.from(
      dom.querySelectorAll('p'),
    ).filter((p, index) => {
      let hashtagCount = 0;
      for (let i = 0; i < p.childNodes.length; i++) {
        const node = p.childNodes[i];

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text !== '') {
            return false;
          }
        } else if (node.tagName === 'BR') {
          // Ignore <br />
        } else if (node.tagName === 'A') {
          const linkText = node.textContent.trim();
          if (!linkText || !linkText.startsWith('#')) {
            return false;
          } else {
            hashtagCount++;
          }
        } else {
          return false;
        }
      }
      // Only consider "stuffing" if:
      // - there are more than 3 hashtags
      // - there are more than 1 hashtag in adjacent paragraphs
      if (hashtagCount > 3) {
        prevIndex = index;
        return true;
      }
      if (hashtagCount > 1 && prevIndex && index === prevIndex + 1) {
        prevIndex = index;
        return true;
      }
    });
    if (hashtagStuffedParagraphs?.length) {
      hashtagStuffedParagraphs.forEach((p) => {
        p.classList.add('hashtag-stuffing');
        p.title = p.innerText;
      });
    }
  }

  if (postEnhanceDOM) {
    postEnhanceDOM(dom); // mutate dom
  }

  enhancedContent = dom.innerHTML;

  return enhancedContent;
}

const defaultRejectFilter = [
  // Document metadata
  'STYLE',
  // Image and multimedia
  'IMG',
  'VIDEO',
  'AUDIO',
  'AREA',
  'MAP',
  'TRACK',
  // Embedded content
  'EMBED',
  'IFRAME',
  'OBJECT',
  'PICTURE',
  'PORTAL',
  'SOURCE',
  // SVG and MathML
  'SVG',
  'MATH',
  // Scripting
  'CANVAS',
  'NOSCRIPT',
  'SCRIPT',
  // Forms
  'INPUT',
  'OPTION',
  'TEXTAREA',
  // Web Components
  'SLOT',
  'TEMPLATE',
];
const defaultRejectFilterMap = Object.fromEntries(
  defaultRejectFilter.map((nodeName) => [nodeName, true]),
);
function extractTextNodes(dom, opts = {}) {
  const textNodes = [];
  const walk = document.createTreeWalker(
    dom,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (defaultRejectFilterMap[node.parentNode.nodeName]) {
          return NodeFilter.FILTER_REJECT;
        }
        if (
          opts.rejectFilter &&
          opts.rejectFilter.includes(node.parentNode.nodeName)
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
    false,
  );
  let node;
  while ((node = walk.nextNode())) {
    textNodes.push(node);
  }
  return textNodes;
}

export default enhanceContent;

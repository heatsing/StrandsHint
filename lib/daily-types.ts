/** Blog post JSON in /content/YYYY-MM-DD.json */

export type ConnectionsGroup = {
  title: string;
  words: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type DailyPostJson = {
  /** SEO intro paragraph (shown under H1) */
  intro: string;
  wordle: {
    hints: [string, string, string];
    answer: string;
  };
  strands: {
    theme: string;
    hints: string[];
    spangramHint: string;
    spangram: string;
    themeWords: string[];
  };
  connections: {
    groups: [ConnectionsGroup, ConnectionsGroup, ConnectionsGroup, ConnectionsGroup];
  };
  /** 2–3 entries recommended for FAQ schema */
  faq: FaqItem[];
};

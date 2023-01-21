export interface OneSideResult {
  watchTimePerImpression: string;
  clickThroughRate: string;
  impressions: string;

  totalViews: string;
  avgViewDuration: string;
  totalWatchMin: string;

  youtubeSearch: string;
  suggestedVideo: string;
  browseFeatures: string;
}

export interface Result {
  original: OneSideResult;
  variation: OneSideResult;
  dailyImpressions: string[]; // array start from start date, 0 index => original
  dailyClicks: string[];

  dailyViews: string;
}

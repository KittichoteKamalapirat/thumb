export interface StatsResponse {
  videoId: string;
  views: number;
  annotationClickThroughRate: number;
  annotationCloseRate: number;
  annotationClickableImpressions: number;
  averageViewDuration: number;
  comments: number;
  dislikes: number;
  estimatedMinutesWatched: number;
  likes: number;
  shares: number;
  subscribersGained: number;
  subscribersLost: number;
}

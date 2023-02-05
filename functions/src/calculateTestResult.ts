// interface Input {
//   subject: string;
//   // metrics
//   ctr: number;
//   avd: number;
//   impression: number;
//   views: number;
//   subsGained: number;
// }

export interface SummaryItem {
  subject: string;
  videoId: string;
  // metrics
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

// Calculate the sums and group data (while tracking count)
// group by subject

// {"title1": {
//   likes: 10,
//   count: 10
// }}
const reduceData = (data: SummaryItem[]) =>
  data.reduce((m, d) => {
    if (!m[d.subject]) {
      m[d.subject] = { ...d, count: 1 };
      return m;
    }
    m[d.subject].views += d.views;
    m[d.subject].annotationClickThroughRate += d.annotationClickThroughRate;
    m[d.subject].annotationCloseRate += d.annotationCloseRate;
    m[d.subject].annotationClickableImpressions +=
      d.annotationClickableImpressions;
    m[d.subject].averageViewDuration += d.averageViewDuration;

    m[d.subject].comments += d.comments;
    m[d.subject].dislikes += d.dislikes;
    m[d.subject].estimatedMinutesWatched += d.estimatedMinutesWatched;
    m[d.subject].likes += d.likes;
    m[d.subject].shares += d.shares;

    m[d.subject].subscribersGained += d.subscribersGained;
    m[d.subject].subscribersLost += d.subscribersLost;

    m[d.subject].count += 1;
    m[d.subject].videoId = d.videoId;
    return m;
  }, {});

// Create new array from grouped data and compute the average

export const calculateTestResult = (data: SummaryItem[]): SummaryItem[] => {
  const reduced = reduceData(data);
  const result = Object.keys(reduced).map((k) => {
    const item = reduced[k];

    console.log("item", item);

    return {
      videoId: item.videoId,
      subject: item.subject,

      views: item.views / item.count,
      annotationClickThroughRate: item.annotationClickThroughRate / item.count,
      annotationCloseRate: item.annotationCloseRate / item.count,
      annotationClickableImpressions:
        item.annotationClickableImpressions / item.count,
      averageViewDuration: item.averageViewDuration / item.count,

      comments: item.comments / item.count,
      dislikes: item.dislikes / item.count,
      estimatedMinutesWatched: item.estimatedMinutesWatched / item.count,
      likes: item.likes / item.count,
      shares: item.shares / item.count,

      subscribersGained: item.subscribersGained / item.count,
      subscribersLost: item.subscribersLost / item.count,
    };
  });

  return result;
};

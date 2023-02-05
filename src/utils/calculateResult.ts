// import { ResultForEachThumbnail, SummaryItem } from "../pages/testing";

// // firstly
// // urlxxx => [{resultForEach},{}]
// // summaryItem could b
// // { thumbUrl: "aaa", result: {}}
// // or
// // { thumbUrl: "aaa", result: null}
// export const calculateResult = (summary: SummaryItem[]) => {
//   //   const result: SummaryItem[] = [];
//   const dayResultsByThumbnail: Record<string, ResultForEachThumbnail[]> = {};

//   summary.forEach((summaryItem) => {
//     const { thumbUrl } = summaryItem;
//     dayResultsByThumbnail[thumbUrl] = [];
//   });
//   // dayResultsByThumbnail should be like =>  {url1: [], url2: []}

//   summary.forEach((summaryItem) => {
//     const { thumbUrl, result } = summaryItem;
//     if (!result) return;
//     dayResultsByThumbnail[thumbUrl].push(result);
//   });
//   // dayResultsByThumbnail = {url1: [item, item, item], url2: [item, item]}

//   console.log("dayResultsByThumbnail", dayResultsByThumbnail);
//   const result: SummaryItem[] = Object.keys(dayResultsByThumbnail).map(
//     (key) => {
//       const items = dayResultsByThumbnail[key];
//       console.log("items", items);
//       const daysNum = items.length;

//       const annotationCloseRateSum = items.reduce(
//         (acc, curr) => acc + curr.annotationCloseRate,
//         0
//       );
//       const annotationCloseRateAvg = annotationCloseRateSum / daysNum;

//       const viewsSum = items.reduce((acc, curr) => acc + curr.views, 0);
//       const viewsAvg = viewsSum / daysNum;

//       const commentsSum = items.reduce((acc, curr) => {
//         console.log("acc", acc);
//         console.log("curr", curr);
//         return acc + curr.comments;
//       }, 0);
//       const commentsAvg = commentsSum / daysNum;

//       const dislikesSum = items.reduce((acc, curr) => acc + curr.dislikes, 0);
//       const dislikesAvg = dislikesSum / daysNum;

//       const estimatedMinutesWatchedSum = items.reduce(
//         (acc, curr) => acc + curr.estimatedMinutesWatched,
//         0
//       );
//       const estimatedMinutesWatchedAvg = estimatedMinutesWatchedSum / daysNum;

//       const likesSum = items.reduce((acc, curr) => acc + curr.likes, 0);
//       const likesAvg = likesSum / daysNum;

//       const subscribersLostSum = items.reduce(
//         (acc, curr) => acc + curr.subscribersLost,
//         0
//       );
//       const subscribersLostAvg = subscribersLostSum / daysNum;

//       const sharesSum = items.reduce((acc, curr) => acc + curr.shares, 0);
//       const sharesAvg = sharesSum / daysNum;

//       const ctrSum = items.reduce(
//         (acc, curr) => acc + curr.annotationClickThroughRate,
//         0
//       );
//       const ctrAvg = ctrSum / daysNum;

//       const avdSum = items.reduce(
//         (acc, curr) => acc + curr.averageViewDuration,
//         0
//       );
//       const avdAvg = avdSum / daysNum;

//       const impressionSum = items.reduce(
//         (acc, curr) => acc + curr.annotationClickableImpressions,
//         0
//       );
//       const annotationClickableImpressionsAvg = impressionSum / daysNum;

//       const subsGainedSum = items.reduce(
//         (acc, curr) => acc + curr.subscribersGained,
//         0
//       );
//       const subsGainedAvg = subsGainedSum / daysNum;

//       return {
//         thumbUrl: key,
//         result: {
//           views: viewsAvg,
//           annotationClickThroughRate: ctrAvg,
//           annotationCloseRate: annotationCloseRateAvg,
//           annotationClickableImpressions: annotationClickableImpressionsAvg,
//           averageViewDuration: avdAvg,
//           comments: commentsAvg,
//           dislikes: dislikesAvg,
//           estimatedMinutesWatched: estimatedMinutesWatchedAvg,
//           likes: likesAvg,
//           shares: sharesAvg,
//           subscribersGained: subsGainedAvg,
//           subscribersLost: subscribersLostAvg,
//         },
//       };
//     }
//   );
//   return result;
// };

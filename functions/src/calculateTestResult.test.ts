import { calculateTestResult } from "./calculateTestResult";

const data1 = [
  {
    subject: "URL1",
    videoId: "video 1",
    // metrics
    views: 100,
    annotationClickThroughRate: 100,
    annotationCloseRate: 100,
    annotationClickableImpressions: 100,
    averageViewDuration: 100,
    comments: 100,
    dislikes: 100,
    estimatedMinutesWatched: 100,
    likes: 100,
    shares: 100,
    subscribersGained: 100,
    subscribersLost: 100,
  },
  {
    subject: "URL2",
    videoId: "video 1",
    // metrics
    views: 200,
    annotationClickThroughRate: 200,
    annotationCloseRate: 200,
    annotationClickableImpressions: 200,
    averageViewDuration: 200,
    comments: 200,
    dislikes: 200,
    estimatedMinutesWatched: 200,
    likes: 200,
    shares: 200,
    subscribersGained: 200,
    subscribersLost: 200,
  },
  {
    subject: "URL3",
    videoId: "video 1",
    // metrics
    views: 300,
    annotationClickThroughRate: 300,
    annotationCloseRate: 300,
    annotationClickableImpressions: 300,
    averageViewDuration: 300,
    comments: 300,
    dislikes: 300,
    estimatedMinutesWatched: 300,
    likes: 300,
    shares: 300,
    subscribersGained: 300,
    subscribersLost: 300,
  },
  {
    subject: "URL4",
    videoId: "video 1",
    // metrics
    views: 400,
    annotationClickThroughRate: 400,
    annotationCloseRate: 400,
    annotationClickableImpressions: 400,
    averageViewDuration: 400,
    comments: 400,
    dislikes: 400,
    estimatedMinutesWatched: 400,
    likes: 400,
    shares: 400,
    subscribersGained: 400,
    subscribersLost: 400,
  },
  {
    subject: "URL1",
    videoId: "video 1",
    // metrics
    views: 100,
    annotationClickThroughRate: 100,
    annotationCloseRate: 100,
    annotationClickableImpressions: 100,
    averageViewDuration: 100,
    comments: 100,
    dislikes: 100,
    estimatedMinutesWatched: 100,
    likes: 100,
    shares: 100,
    subscribersGained: 100,
    subscribersLost: 100,
  },
  {
    subject: "URL2",
    videoId: "video 1",
    // metrics
    views: 200,
    annotationClickThroughRate: 200,
    annotationCloseRate: 200,
    annotationClickableImpressions: 200,
    averageViewDuration: 200,
    comments: 200,
    dislikes: 200,
    estimatedMinutesWatched: 200,
    likes: 200,
    shares: 200,
    subscribersGained: 200,
    subscribersLost: 200,
  },
  {
    subject: "URL3",
    videoId: "video 1",
    // metrics
    views: 300,
    annotationClickThroughRate: 300,
    annotationCloseRate: 300,
    annotationClickableImpressions: 300,
    averageViewDuration: 300,
    comments: 300,
    dislikes: 300,
    estimatedMinutesWatched: 300,
    likes: 300,
    shares: 300,
    subscribersGained: 300,
    subscribersLost: 300,
  },
  {
    subject: "URL4",
    videoId: "video 1",
    // metrics
    views: 400,
    annotationClickThroughRate: 400,
    annotationCloseRate: 400,
    annotationClickableImpressions: 400,
    averageViewDuration: 400,
    comments: 400,
    dislikes: 400,
    estimatedMinutesWatched: 400,
    likes: 400,
    shares: 400,
    subscribersGained: 400,
    subscribersLost: 400,
  },
];

describe("calculateTestResult", () => {
  test("should return a correct calculation", () => {
    const result1 = calculateTestResult(data1);

    const expect1 = [
      {
        subject: "URL1",
        videoId: "video 1",
        // metrics
        views: 100,
        annotationClickThroughRate: 100,
        annotationCloseRate: 100,
        annotationClickableImpressions: 100,
        averageViewDuration: 100,
        comments: 100,
        dislikes: 100,
        estimatedMinutesWatched: 100,
        likes: 100,
        shares: 100,
        subscribersGained: 100,
        subscribersLost: 100,
      },
      {
        subject: "URL2",
        videoId: "video 1",
        // metrics
        views: 200,
        annotationClickThroughRate: 200,
        annotationCloseRate: 200,
        annotationClickableImpressions: 200,
        averageViewDuration: 200,
        comments: 200,
        dislikes: 200,
        estimatedMinutesWatched: 200,
        likes: 200,
        shares: 200,
        subscribersGained: 200,
        subscribersLost: 200,
      },
      {
        subject: "URL3",
        videoId: "video 1",
        // metrics
        views: 300,
        annotationClickThroughRate: 300,
        annotationCloseRate: 300,
        annotationClickableImpressions: 300,
        averageViewDuration: 300,
        comments: 300,
        dislikes: 300,
        estimatedMinutesWatched: 300,
        likes: 300,
        shares: 300,
        subscribersGained: 300,
        subscribersLost: 300,
      },
      {
        subject: "URL4",
        videoId: "video 1",
        // metrics
        views: 400,
        annotationClickThroughRate: 400,
        annotationCloseRate: 400,
        annotationClickableImpressions: 400,
        averageViewDuration: 400,
        comments: 400,
        dislikes: 400,
        estimatedMinutesWatched: 400,
        likes: 400,
        shares: 400,
        subscribersGained: 400,
        subscribersLost: 400,
      },
    ];

    expect(result1).toEqual(expect1);
  });
});
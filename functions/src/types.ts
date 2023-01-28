const DurationTypes = ["specific", "stats_significant"] as const;
export type DurationType = typeof DurationTypes[number];

const TestingTypes = ["thumbnail", "title"] as const;
export type TestingType = typeof TestingTypes[number];

const TestingStatuses = ["ongoing", "complete"] as const;
export type TestingStatus = typeof TestingStatuses[number];

export interface thunbmailUploadHistory {
  date: string; // see YOUTUBE_DATA_API_DATE_FORMAT
  url: string;
}
export interface Testing {
  id: string;
  channelId: string; // as userId
  videoId: string;
  durationType: DurationType;
  duration?: number; // days
  type: TestingType;
  status: TestingStatus; // if complete => has result
  startDate: string;
  createdAt: string; // timezone in utc and format in iso
  history: thunbmailUploadHistory[];
}

export interface ThumbnailTesting extends Testing {
  originalThumbUrl: string;
  variationThumbUrl: string;
}

export interface TitleTesting extends Testing {
  originalTitle: string;
  variationTitle: string;
}

const DurationTypes = ["specific", "stats_significant"] as const;
export type DurationType = typeof DurationTypes[number];

const TestingTypes = ["thumb", "title"] as const;
export type TestingType = typeof TestingTypes[number];

const TestingStatuses = ["ongoing", "complete"] as const;
export type TestingStatus = typeof TestingStatuses[number];

export interface History {
  date: string; // see YOUTUBE_DATA_API_DATE_FORMAT
  value: string; // url
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
  history: History[];
}

export interface ThumbnailTesting extends Testing {
  originalThumbUrl: string;
  variationThumbUrls: { value: string }[];
}

export interface TitleTesting extends Testing {
  originalTitle: string;
  variationTitles: { value: string }[];
}

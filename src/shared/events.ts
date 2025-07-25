export type DemoEvent =
  | { type: "join"; userId: string }
  | { type: "speech"; userId: string; text?: string }
  | { type: "quizReply"; userId: string; good: boolean }
  | { type: "finish" };

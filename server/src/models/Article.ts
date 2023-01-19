import mongoose, { Schema, model, Types } from "mongoose";

export interface Article {
  url: string;
  heading: string;
  companyName: string;
  ticker: string;
  contentBody: [
    {
      _id?: Schema.Types.ObjectId;
      section: string;
      isSelected: boolean;
    }
  ];
  _id?: Schema.Types.ObjectId;
}

export interface IRawArticles extends mongoose.Document {
  articles: Article[];
  //   dataFromURLs: string | string[];
  description: string;
  createdBy: { type: Types.ObjectId; ref: "User" };
}

const ArticleSchema = new Schema<Article>({
  url: { type: String },
  heading: { type: String },
  companyName: { type: String },
  ticker: { type: String },
  contentBody: {
    type: [
      {
        section: String,
        isSelected: { type: Boolean, default: false },
      },
    ],
  },
});

const RawArticlesSchema = new Schema<IRawArticles>(
  {
    articles: [ArticleSchema],
    description: { type: String, minlength: 4 },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model<IRawArticles>("RawArticles", RawArticlesSchema);

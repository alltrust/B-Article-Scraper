import mongoose, { Schema, model, Types } from "mongoose";

export interface Article {
  url: string;
  heading: string;
  contentBody: string[];
  _id?: Schema.Types.ObjectId
}

export interface IRawArticles extends mongoose.Document {
  articles: Article[];
  //   dataFromURLs: string | string[];
  description: string;
  createdBy: { type: Types.ObjectId; ref: "User" };
}

const ArticleSchema = new Schema<Article>({
  url: { type: String},
  heading: { type: String},
  contentBody: { type: [String]},
});

const RawArticlesSchema = new Schema<IRawArticles>(
  {
    articles: { type: [ArticleSchema], required:true },
    description: { type: String, minlength: 4 },
    // dataFromURLs: { type: String },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      // required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default model<IRawArticles>("RawArticles", RawArticlesSchema);

export interface ForumPostModel {
  _id: String;
  _title: String;
  _content: String;
  _images: String;
  _status: Number;
  _inspectId: String | null;
  _reason: String | null;
  createdAt: String;
  updatedAt: String;
  _isLiked: Boolean;
  _authorId: String;
  _authorName: String;
  _authorAvatar: String;
  _authorEmail: String;
  _authorPhone: String;
  _postingDateLocal: String;
}

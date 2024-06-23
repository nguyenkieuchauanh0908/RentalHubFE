export interface ForumPostModel {
  _id: string;
  _title: string;
  _content: string;
  _images: string;
  _status: number;
  _inspectId: string | null;
  _reason: string | null;
  createdAt: string;
  updatedAt: string;
  _uIdLike: string[] | [];
  _totalComment: number;
  _totalLike: number;
  _isLiked: Boolean;
  _authorId: string;
  _authorName: string;
  _authorAvatar: string;
  _authorEmail: string;
  _authorPhone: string;
  _postingDateLocal: string;
}

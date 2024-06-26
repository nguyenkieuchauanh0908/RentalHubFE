export interface PostCommentModel {
  _id: string;
  _uId: string;
  _postId: string;
  _parentId: string;
  _rootId: string;
  _content: string;
  _images: string[];
  _status: number;
  createdAt: string;
  updatedAt: string;
  totalReplies: number;
  _name: string;
  _avatar: string;
  _nameParent: string;
}

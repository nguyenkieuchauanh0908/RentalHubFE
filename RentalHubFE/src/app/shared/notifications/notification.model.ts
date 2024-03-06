export class Notification {
  constructor(
    public _id: string,
    public _uId: string,
    public _postId: string,
    public _title: string,
    public _message: string,
    public _read: boolean,
    public _type: string
  ) {}
}

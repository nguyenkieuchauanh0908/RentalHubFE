export class PostItem {
  constructor(
    public _id: string,
    public _content: string,
    public _postingDate: Date,
    public _tags: string[],
    public _videos: string[],
    public _images: string[],
    public _title: string,
    public _desc: string,
    public authorId: string,
    public authorFName: string,
    public authorLName: string,
    public phoneNumber: string,
    public addressAuthor: string,
    public _inspectId: string,
    public roomId: string,
    public roomAddress: string,
    public roomServices: string[],
    public roomUtilities: string[],
    public roomArea: number,
    public roomPrice: number,
    public roomElectricPrice: number,
    public roomWaterPrice: number,
    public roomIsRented: boolean,
    public _status: number
  ) {}
}

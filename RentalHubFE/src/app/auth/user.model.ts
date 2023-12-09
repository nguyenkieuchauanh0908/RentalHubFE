export class User {
  constructor(
    public _id: string,
    public _fname: string,
    public _lname: string,
    public _phone: string,
    public _dob: Date,
    public _active: boolean,
    public _rating: number,
    public _email: string,
    public _address: string,
    public _avatar: string,
    public _role: number,
    public _isHost: boolean,
    private _RFToken: string,
    public _RFExpiredTime: number,
    private _ACToken: string,
    public _ACExpiredTime: number
  ) {}

  get ACToken() {
    if (!this._ACExpiredTime || Date.now() > this._ACExpiredTime) {
      return null;
    }
    return this._ACToken;
  }

  get RFToken() {
    if (!this._RFToken || Date.now() > this._RFExpiredTime) {
      return null;
    }
    return this._RFToken;
  }
}

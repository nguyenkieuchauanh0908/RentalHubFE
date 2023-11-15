export class User {
  constructor(
    public _fname: string,
    public _lname: string,
    public _dob: Date,
    public _phone: string,
    public _address: string,
    public _avatar: string,
    public _email: string,
    public _active: boolean,
    public _rating: number,
    public _role: number,
    public _isHost: boolean,
    private _ACtoken: string,
    private _ACtokenExpiryDate: Date,
    private _RFtoken: string,
    private _RFtokenExpiryDate: Date
  ) {}

  get ACtoken() {
    if (!this._ACtokenExpiryDate || new Date() > this._ACtokenExpiryDate) {
      return null;
    }
    return this._ACtoken;
  }

  get RFtoken() {
    if (!this._RFtokenExpiryDate || new Date() > this._RFtokenExpiryDate) {
      return null;
    }
    return this._RFtoken;
  }
}

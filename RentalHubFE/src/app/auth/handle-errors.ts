import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(errorRes: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred!';

  switch (errorRes.error.error.code) {
    case 'DUPLICATED':
      errorMessage = 'This email exists already!';
      break;
    case 'EMAIL_INVALID':
      errorMessage = 'This email is invalid!';
      break;
    case 'EMAIL_NOTFOUND':
      errorMessage = 'This email is not found!';
      break;
    case 'PASSWORD_NOTFOUND':
      errorMessage = 'This password is not found!';
      break;
    case 'PASSWORD_INVALID':
      errorMessage = 'This password is invalid!';
      break;
    case 'PASSWORD_CONFIRM_NOTFOUND':
      errorMessage = 'Password confirmation is not provided!';
      break;
    case 'PASSWORD_CONFIRM_INVALID':
      errorMessage = 'Password confirmation is invalid!';
      break;
  }
  return throwError(errorMessage);
}

import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(errorRes: HttpErrorResponse) {
  let errorMessage = 'Đã xảy ra lỗi! Chúng tôi sẽ sớm khắc phục!';

  switch (errorRes.error.error.code) {
    case 'DUPLICATED':
      errorMessage = 'Email đã tồn tại!';
      break;
    case 'EMAIL_INVALID':
      errorMessage = 'Email không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'EMAIL_NOTFOUND':
      errorMessage = 'Không tìm thấy email, vui lòng thử lại!';
      break;
    case 'PASSWORD_NOTFOUND':
      errorMessage = 'Mật khẩu không đúng, vui lòng nhập lại!';
      break;
    case 'PASSWORD_INVALID':
      errorMessage =
        'Mật khẩu vui lòng dài ít nhất 8 ký tự, chứa kỹ tự in hoa, in thường, ký tự đặc biệt và số!';
      break;
    case 'PASSWORD_CONFIRM_NOTFOUND':
      errorMessage = 'Vui lòng nhập đủ xác nhận mật khẩu!';
      break;
    case 'PASSWORD_CONFIRM_INVALID':
      errorMessage = 'Xác nhận mật khẩu không đúng!';
      break;
    case 'FILE_SIZE_EXCEED_LIMIT':
      errorMessage =
        'Bạn đã vượt quá dung lượng ảnh cho phép. Dung lượng ảnh tối đa: 1MB';
      break;
    case 'FILE_COUNT_EXCEED_LIMIT':
      errorMessage = 'Vui lòng chọn tối đa 10 ảnh!';
      break;

    case 'FILE_IS_NOT_IMAGE':
      errorMessage = 'Vui lòng chọn file định dạng ảnh!';
      break;

    case 'UPLOAD_IMAGES_FAIL':
      errorMessage = 'Có lỗi xảy ra trong quá trình tải ảnh, vui lòng thử lại!';
      break;
    case 'FILE_NOTFOUND':
      errorMessage = 'Không tìm thấy file!';
      break;
    case 'FNAME_NOTFOUND':
      errorMessage = 'Không tìm thấy tên người dùng!';
      break;
    case 'FNAME_INVALID':
      errorMessage = 'Tên người dùng không hợp lệ! Vui lòng kiểm tra lại!';
      break;

    case 'LNAME_NOTFOUND':
      errorMessage = 'Không tìm thấy tên người dùng!';
      break;
    case 'LNAME_INVALID':
      errorMessage = 'Tên người dùng không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'NAME_NOTFOUND':
      errorMessage = 'Không tìm thấy tên người dùng!';
      break;
    case 'NAME_INVALID':
      errorMessage = 'Tên người dùng không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'EMAIL_NOTFOUND':
      errorMessage = 'Không tìm thấy email!';
      break;
    case 'EMAIL_INVALID':
      errorMessage = 'Email không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'GENDER_INVALID':
      errorMessage = 'Giới tính không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'PHONENUMBER_INVALID':
      errorMessage = 'Số điện thoại không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'PHONENUMBER_DUPLICATE':
      errorMessage = 'Số điện thoại này đã được dùng để đăng ký!';
      break;
    case 'DOB_INVALID':
      errorMessage = 'Ngày sinh không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'ADDRESS_INVALID':
      errorMessage = 'Địa chỉ không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'PROFILEURL_INVALID':
      errorMessage = 'URL ảnh không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'EMAIL_DUPLICATED':
      errorMessage = 'Email đã được dùng để đăng ký!';
      break;
    case 'USER_ISHOSTED':
      errorMessage = 'Người dùng đã được kích hoạt chức năng đăng bài!';
      break;
    case 'PAGE_NOTFOUND':
      errorMessage = 'Không tìm thấy trang!';
      break;
    case 'UNAUTHORIZED':
      errorMessage = 'Vui lòng đăng nhập để thực hiện chức năng này!';
      break;
    case 'ERROR_TOKEN':
      errorMessage = 'Mã xác thực không hợp lệ, vui lòng đăng nhập lại!';
      break;
    case 'EXPIRED_TOKEN':
      errorMessage = 'Mã xác thực hết hạn, vui lòng đăng nhập lại!';
      break;
    case 'FAIL_SEND_EMAIL':
      errorMessage = 'Gửi mail không thành công! Vui lòng thử lại!';
      break;
    case 'OTP_DUPLICATED':
      errorMessage = 'Đã gửi OTP! Vui lòng kiểm tra email!';
      break;
    case 'RESET_PASSWORD_FAIL':
      errorMessage = 'Đổi mật khẩu không thành công! Vui lòng thử lại!';
      break;
    case 'EXPIRED_OTP':
      errorMessage = 'Mã OTP đã hết hạn!';
      break;
    case 'POST_NOTFOUND':
      errorMessage = 'Không tìm thấy bài viết!';
      break;
    case 'TITLE_NOTFOUND':
      errorMessage = 'Vui lòng nhập tiêu đề của bài viết';
      break;
    case 'TITLE_INVALID':
      errorMessage = 'Tiêu đề bài viết không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'IMAGE_NOTFOUND':
      errorMessage = 'Vui lòng chọn ảnh mô tả phòng trợ!';
      break;
    case 'IMAGE_INVALID':
      errorMessage = 'Ảnh không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'CONTENT_NOTFOUND':
      errorMessage = 'Vui lòng điền nội dung bài viết!';
      break;
    case 'CONTENT_INVALID':
      errorMessage = 'Nội dung không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'DESCRIPTION_NOTFOUND':
      errorMessage = 'Vui lòng nhập mô tả bài viết!';
      break;
    case 'DESCRIPTION_INVALID':
      errorMessage = 'Mô tả bài viết không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'STREET_NOTFOUND':
      errorMessage = 'Vui lòng nhập tên đường';
      break;

    case 'STREET_INVALID':
      errorMessage = 'Tên đường không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'DISTRICT_NOTFOUND':
      errorMessage = 'Vui lòng điền tên quận!';
      break;
    case 'DISTRICT_INVALID':
      errorMessage = 'Tên quận không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'AREA_NOTFOUND':
      errorMessage = 'Vui lòng điền diện tích phòng trọ';
      break;
    case 'AREA_INVALID':
      errorMessage = 'Diện tích phòng trọ không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'PRICE_NOTFOUND':
      errorMessage = 'Vui lòng nhập giá thuê phòng trợ!';
      break;
    case 'PRICE_INVALID':
      errorMessage = 'Gía tiền không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'ELECTRICPRICE_NOTFOUND':
      errorMessage = 'Vui lòng điền giá điện!';
      break;
    case 'ELECTRICPRICE_INVALID':
      errorMessage = 'Gía điện không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'WATERPRICE_NOTFOUND':
      errorMessage = 'Vui lòng điền giá nước!';
      break;
    case 'WATERPRICE_INVALID':
      errorMessage = 'Gía nước không hộp lệ! Vui lòng đimẻ tra lại!';
      break;
    case 'TAGS_INVALID':
      errorMessage = 'Tag bài viết không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'TAG_INVALID':
      errorMessage = 'Tag bài viết không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'CITY_INVALID':
      errorMessage = 'Tên thành phố không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'SERVICES_INVALID':
      errorMessage = 'Dịch vụ không hợp lệ! Vui lòng kiểm tra lại!';
      break;

    case 'UTILITIES_INVALID':
      errorMessage = 'Tiện ích không hợp lệ! Vui lòng nhập lại!';
      break;

    case 'STATUS_INVALID':
      errorMessage = 'Trạng thái không hợp lệ! Vui lòng kiểm tra lại!';
      break;
    case 'TAG_NOTFOUND':
      errorMessage =
        'Vui lòng gắn tag cho bài viết! Gắn tags giúp người thuê trọ dễ dàng tìm thấy bạn hơn!';
      break;
    case 'TAG_DUPLICATED':
      errorMessage = 'Tag đã tồn tại!';
      break;
    case 'TYPE_INVALID':
      errorMessage = 'Kiểu dữ liệu không hợp lệ!';
      break;
  }
  return throwError(errorMessage);
}

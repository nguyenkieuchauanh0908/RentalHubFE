import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { handleError } from './handle-errors';
import { NotifierService } from 'angular-notifier';
import { resDataDTO } from './resDataDTO';
import { ResPublicAPIDataDTO } from './resPublicAPIDataDTO';
export const mockDistrictDataOfHanoi = [
  {
    id: '001',
    name: 'Ba Đình',
    name_en: 'Ba Dinh',
    full_name: 'Quận Ba Đình',
    full_name_en: 'Ba Dinh District',
  },
  {
    id: '002',
    name: 'Hoàn Kiếm',
    name_en: 'Hoan Kiem',
    full_name: 'Quận Hoàn Kiếm',
    full_name_en: 'Hoan Kiem District',
  },
  {
    id: '003',
    name: 'Tây Hồ',
    name_en: 'Tay Ho',
    full_name: 'Quận Tây Hồ',
    full_name_en: 'Tay Ho District',
  },
  {
    id: '004',
    name: 'Long Biên',
    name_en: 'Long Bien',
    full_name: 'Quận Long Biên',
    full_name_en: 'Long Bien District',
  },
  {
    id: '005',
    name: 'Cầu Giấy',
    name_en: 'Cau Giay',
    full_name: 'Quận Cầu Giấy',
    full_name_en: 'Cau Giay District',
  },
  {
    id: '006',
    name: 'Đống Đa',
    name_en: 'Dong Da',
    full_name: 'Quận Đống Đa',
    full_name_en: 'Dong Da District',
  },
  {
    id: '007',
    name: 'Hai Bà Trưng',
    name_en: 'Hai Ba Trung',
    full_name: 'Quận Hai Bà Trưng',
    full_name_en: 'Hai Ba Trung District',
  },
  {
    id: '008',
    name: 'Hoàng Mai',
    name_en: 'Hoang Mai',
    full_name: 'Quận Hoàng Mai',
    full_name_en: 'Hoang Mai District',
  },
  {
    id: '009',
    name: 'Thanh Xuân',
    name_en: 'Thanh Xuan',
    full_name: 'Quận Thanh Xuân',
    full_name_en: 'Thanh Xuan District',
  },
  {
    id: '016',
    name: 'Sóc Sơn',
    name_en: 'Soc Son',
    full_name: 'Huyện Sóc Sơn',
    full_name_en: 'Soc Son District',
  },
  {
    id: '017',
    name: 'Đông Anh',
    name_en: 'Dong Anh',
    full_name: 'Huyện Đông Anh',
    full_name_en: 'Dong Anh District',
  },
  {
    id: '018',
    name: 'Gia Lâm',
    name_en: 'Gia Lam',
    full_name: 'Huyện Gia Lâm',
    full_name_en: 'Gia Lam District',
  },
  {
    id: '019',
    name: 'Nam Từ Liêm',
    name_en: 'Nam Tu Liem',
    full_name: 'Quận Nam Từ Liêm',
    full_name_en: 'Nam Tu Liem District',
  },
  {
    id: '020',
    name: 'Thanh Trì',
    name_en: 'Thanh Tri',
    full_name: 'Huyện Thanh Trì',
    full_name_en: 'Thanh Tri District',
  },
  {
    id: '021',
    name: 'Bắc Từ Liêm',
    name_en: 'Bac Tu Liem',
    full_name: 'Quận Bắc Từ Liêm',
    full_name_en: 'Bac Tu Liem District',
  },
  {
    id: '250',
    name: 'Mê Linh',
    name_en: 'Me Linh',
    full_name: 'Huyện Mê Linh',
    full_name_en: 'Me Linh District',
  },
  {
    id: '268',
    name: 'Hà Đông',
    name_en: 'Ha Dong',
    full_name: 'Quận Hà Đông',
    full_name_en: 'Ha Dong District',
  },
  {
    id: '269',
    name: 'Sơn Tây',
    name_en: 'Son Tay',
    full_name: 'Thị xã Sơn Tây',
    full_name_en: 'Son Tay Town',
  },
  {
    id: '271',
    name: 'Ba Vì',
    name_en: 'Ba Vi',
    full_name: 'Huyện Ba Vì',
    full_name_en: 'Ba Vi District',
  },
  {
    id: '272',
    name: 'Phúc Thọ',
    name_en: 'Phuc Tho',
    full_name: 'Huyện Phúc Thọ',
    full_name_en: 'Phuc Tho District',
  },
  {
    id: '273',
    name: 'Đan Phượng',
    name_en: 'Dan Phuong',
    full_name: 'Huyện Đan Phượng',
    full_name_en: 'Dan Phuong District',
  },
  {
    id: '274',
    name: 'Hoài Đức',
    name_en: 'Hoai Duc',
    full_name: 'Huyện Hoài Đức',
    full_name_en: 'Hoai Duc District',
  },
  {
    id: '275',
    name: 'Quốc Oai',
    name_en: 'Quoc Oai',
    full_name: 'Huyện Quốc Oai',
    full_name_en: 'Quoc Oai District',
  },
  {
    id: '276',
    name: 'Thạch Thất',
    name_en: 'Thach That',
    full_name: 'Huyện Thạch Thất',
    full_name_en: 'Thach That District',
  },
  {
    id: '277',
    name: 'Chương Mỹ',
    name_en: 'Chuong My',
    full_name: 'Huyện Chương Mỹ',
    full_name_en: 'Chuong My District',
  },
  {
    id: '278',
    name: 'Thanh Oai',
    name_en: 'Thanh Oai',
    full_name: 'Huyện Thanh Oai',
    full_name_en: 'Thanh Oai District',
  },
  {
    id: '279',
    name: 'Thường Tín',
    name_en: 'Thuong Tin',
    full_name: 'Huyện Thường Tín',
    full_name_en: 'Thuong Tin District',
  },
  {
    id: '280',
    name: 'Phú Xuyên',
    name_en: 'Phu Xuyen',
    full_name: 'Huyện Phú Xuyên',
    full_name_en: 'Phu Xuyen District',
  },
  {
    id: '281',
    name: 'Ứng Hòa',
    name_en: 'Ung Hoa',
    full_name: 'Huyện Ứng Hòa',
    full_name_en: 'Ung Hoa District',
  },
  {
    id: '282',
    name: 'Mỹ Đức',
    name_en: 'My Duc',
    full_name: 'Huyện Mỹ Đức',
    full_name_en: 'My Duc District',
  },
];
export const mockDistrictDataOfHaGiang = [
  {
    id: '024',
    name: 'Hà Giang',
    name_en: 'Ha Giang',
    full_name: 'Thành phố Hà Giang',
    full_name_en: 'Ha Giang City',
  },
  {
    id: '026',
    name: 'Đồng Văn',
    name_en: 'Dong Van',
    full_name: 'Huyện Đồng Văn',
    full_name_en: 'Dong Van District',
  },
  {
    id: '027',
    name: 'Mèo Vạc',
    name_en: 'Meo Vac',
    full_name: 'Huyện Mèo Vạc',
    full_name_en: 'Meo Vac District',
  },
  {
    id: '028',
    name: 'Yên Minh',
    name_en: 'Yen Minh',
    full_name: 'Huyện Yên Minh',
    full_name_en: 'Yen Minh District',
  },
  {
    id: '029',
    name: 'Quản Bạ',
    name_en: 'Quan Ba',
    full_name: 'Huyện Quản Bạ',
    full_name_en: 'Quan Ba District',
  },
  {
    id: '030',
    name: 'Vị Xuyên',
    name_en: 'Vi Xuyen',
    full_name: 'Huyện Vị Xuyên',
    full_name_en: 'Vi Xuyen District',
  },
  {
    id: '031',
    name: 'Bắc Mê',
    name_en: 'Bac Me',
    full_name: 'Huyện Bắc Mê',
    full_name_en: 'Bac Me District',
  },
  {
    id: '032',
    name: 'Hoàng Su Phì',
    name_en: 'Hoang Su Phi',
    full_name: 'Huyện Hoàng Su Phì',
    full_name_en: 'Hoang Su Phi District',
  },
  {
    id: '033',
    name: 'Xín Mần',
    name_en: 'Xin Man',
    full_name: 'Huyện Xín Mần',
    full_name_en: 'Xin Man District',
  },
  {
    id: '034',
    name: 'Bắc Quang',
    name_en: 'Bac Quang',
    full_name: 'Huyện Bắc Quang',
    full_name_en: 'Bac Quang District',
  },
  {
    id: '035',
    name: 'Quang Bình',
    name_en: 'Quang Binh',
    full_name: 'Huyện Quang Bình',
    full_name_en: 'Quang Binh District',
  },
];
export const mockCityData = [
  {
    id: '01',
    name: 'Hà Nội',
    name_en: 'Ha Noi',
    full_name: 'Thành phố Hà Nội',
    full_name_en: 'Ha Noi City',
  },
  {
    id: '02',
    name: 'Hà Giang',
    name_en: 'Ha Giang',
    full_name: 'Tỉnh Hà Giang',
    full_name_en: 'Ha Giang Province',
  },
  {
    id: '04',
    name: 'Cao Bằng',
    name_en: 'Cao Bang',
    full_name: 'Tỉnh Cao Bằng',
    full_name_en: 'Cao Bang Province',
  },
  {
    id: '06',
    name: 'Bắc Kạn',
    name_en: 'Bac Kan',
    full_name: 'Tỉnh Bắc Kạn',
    full_name_en: 'Bac Kan Province',
  },
  {
    id: '08',
    name: 'Tuyên Quang',
    name_en: 'Tuyen Quang',
    full_name: 'Tỉnh Tuyên Quang',
    full_name_en: 'Tuyen Quang Province',
  },
  {
    id: '10',
    name: 'Lào Cai',
    name_en: 'Lao Cai',
    full_name: 'Tỉnh Lào Cai',
    full_name_en: 'Lao Cai Province',
  },
  {
    id: '11',
    name: 'Điện Biên',
    name_en: 'Dien Bien',
    full_name: 'Tỉnh Điện Biên',
    full_name_en: 'Dien Bien Province',
  },
  {
    id: '12',
    name: 'Lai Châu',
    name_en: 'Lai Chau',
    full_name: 'Tỉnh Lai Châu',
    full_name_en: 'Lai Chau Province',
  },
  {
    id: '14',
    name: 'Sơn La',
    name_en: 'Son La',
    full_name: 'Tỉnh Sơn La',
    full_name_en: 'Son La Province',
  },
  {
    id: '15',
    name: 'Yên Bái',
    name_en: 'Yen Bai',
    full_name: 'Tỉnh Yên Bái',
    full_name_en: 'Yen Bai Province',
  },
  {
    id: '17',
    name: 'Hoà Bình',
    name_en: 'Hoa Binh',
    full_name: 'Tỉnh Hoà Bình',
    full_name_en: 'Hoa Binh Province',
  },
  {
    id: '19',
    name: 'Thái Nguyên',
    name_en: 'Thai Nguyen',
    full_name: 'Tỉnh Thái Nguyên',
    full_name_en: 'Thai Nguyen Province',
  },
  {
    id: '20',
    name: 'Lạng Sơn',
    name_en: 'Lang Son',
    full_name: 'Tỉnh Lạng Sơn',
    full_name_en: 'Lang Son Province',
  },
  {
    id: '22',
    name: 'Quảng Ninh',
    name_en: 'Quang Ninh',
    full_name: 'Tỉnh Quảng Ninh',
    full_name_en: 'Quang Ninh Province',
  },
  {
    id: '24',
    name: 'Bắc Giang',
    name_en: 'Bac Giang',
    full_name: 'Tỉnh Bắc Giang',
    full_name_en: 'Bac Giang Province',
  },
  {
    id: '25',
    name: 'Phú Thọ',
    name_en: 'Phu Tho',
    full_name: 'Tỉnh Phú Thọ',
    full_name_en: 'Phu Tho Province',
  },
  {
    id: '26',
    name: 'Vĩnh Phúc',
    name_en: 'Vinh Phuc',
    full_name: 'Tỉnh Vĩnh Phúc',
    full_name_en: 'Vinh Phuc Province',
  },
  {
    id: '27',
    name: 'Bắc Ninh',
    name_en: 'Bac Ninh',
    full_name: 'Tỉnh Bắc Ninh',
    full_name_en: 'Bac Ninh Province',
  },
  {
    id: '30',
    name: 'Hải Dương',
    name_en: 'Hai Duong',
    full_name: 'Tỉnh Hải Dương',
    full_name_en: 'Hai Duong Province',
  },
  {
    id: '31',
    name: 'Hải Phòng',
    name_en: 'Hai Phong',
    full_name: 'Thành phố Hải Phòng',
    full_name_en: 'Hai Phong City',
  },
  {
    id: '33',
    name: 'Hưng Yên',
    name_en: 'Hung Yen',
    full_name: 'Tỉnh Hưng Yên',
    full_name_en: 'Hung Yen Province',
  },
  {
    id: '34',
    name: 'Thái Bình',
    name_en: 'Thai Binh',
    full_name: 'Tỉnh Thái Bình',
    full_name_en: 'Thai Binh Province',
  },
  {
    id: '35',
    name: 'Hà Nam',
    name_en: 'Ha Nam',
    full_name: 'Tỉnh Hà Nam',
    full_name_en: 'Ha Nam Province',
  },
  {
    id: '36',
    name: 'Nam Định',
    name_en: 'Nam Dinh',
    full_name: 'Tỉnh Nam Định',
    full_name_en: 'Nam Dinh Province',
  },
  {
    id: '37',
    name: 'Ninh Bình',
    name_en: 'Ninh Binh',
    full_name: 'Tỉnh Ninh Bình',
    full_name_en: 'Ninh Binh Province',
  },
  {
    id: '38',
    name: 'Thanh Hóa',
    name_en: 'Thanh Hoa',
    full_name: 'Tỉnh Thanh Hóa',
    full_name_en: 'Thanh Hoa Province',
  },
  {
    id: '40',
    name: 'Nghệ An',
    name_en: 'Nghe An',
    full_name: 'Tỉnh Nghệ An',
    full_name_en: 'Nghe An Province',
  },
  {
    id: '42',
    name: 'Hà Tĩnh',
    name_en: 'Ha Tinh',
    full_name: 'Tỉnh Hà Tĩnh',
    full_name_en: 'Ha Tinh Province',
  },
  {
    id: '44',
    name: 'Quảng Bình',
    name_en: 'Quang Binh',
    full_name: 'Tỉnh Quảng Bình',
    full_name_en: 'Quang Binh Province',
  },
  {
    id: '45',
    name: 'Quảng Trị',
    name_en: 'Quang Tri',
    full_name: 'Tỉnh Quảng Trị',
    full_name_en: 'Quang Tri Province',
  },
  {
    id: '46',
    name: 'Thừa Thiên Huế',
    name_en: 'Thua Thien Hue',
    full_name: 'Tỉnh Thừa Thiên Huế',
    full_name_en: 'Thua Thien Hue Province',
  },
  {
    id: '48',
    name: 'Đà Nẵng',
    name_en: 'Da Nang',
    full_name: 'Thành phố Đà Nẵng',
    full_name_en: 'Da Nang City',
  },
  {
    id: '49',
    name: 'Quảng Nam',
    name_en: 'Quang Nam',
    full_name: 'Tỉnh Quảng Nam',
    full_name_en: 'Quang Nam Province',
  },
  {
    id: '51',
    name: 'Quảng Ngãi',
    name_en: 'Quang Ngai',
    full_name: 'Tỉnh Quảng Ngãi',
    full_name_en: 'Quang Ngai Province',
  },
  {
    id: '52',
    name: 'Bình Định',
    name_en: 'Binh Dinh',
    full_name: 'Tỉnh Bình Định',
    full_name_en: 'Binh Dinh Province',
  },
  {
    id: '54',
    name: 'Phú Yên',
    name_en: 'Phu Yen',
    full_name: 'Tỉnh Phú Yên',
    full_name_en: 'Phu Yen Province',
  },
  {
    id: '56',
    name: 'Khánh Hòa',
    name_en: 'Khanh Hoa',
    full_name: 'Tỉnh Khánh Hòa',
    full_name_en: 'Khanh Hoa Province',
  },
  {
    id: '58',
    name: 'Ninh Thuận',
    name_en: 'Ninh Thuan',
    full_name: 'Tỉnh Ninh Thuận',
    full_name_en: 'Ninh Thuan Province',
  },
  {
    id: '60',
    name: 'Bình Thuận',
    name_en: 'Binh Thuan',
    full_name: 'Tỉnh Bình Thuận',
    full_name_en: 'Binh Thuan Province',
  },
  {
    id: '62',
    name: 'Kon Tum',
    name_en: 'Kon Tum',
    full_name: 'Tỉnh Kon Tum',
    full_name_en: 'Kon Tum Province',
  },
  {
    id: '64',
    name: 'Gia Lai',
    name_en: 'Gia Lai',
    full_name: 'Tỉnh Gia Lai',
    full_name_en: 'Gia Lai Province',
  },
  {
    id: '66',
    name: 'Đắk Lắk',
    name_en: 'Dak Lak',
    full_name: 'Tỉnh Đắk Lắk',
    full_name_en: 'Dak Lak Province',
  },
  {
    id: '67',
    name: 'Đắk Nông',
    name_en: 'Dak Nong',
    full_name: 'Tỉnh Đắk Nông',
    full_name_en: 'Dak Nong Province',
  },
  {
    id: '68',
    name: 'Lâm Đồng',
    name_en: 'Lam Dong',
    full_name: 'Tỉnh Lâm Đồng',
    full_name_en: 'Lam Dong Province',
  },
  {
    id: '70',
    name: 'Bình Phước',
    name_en: 'Binh Phuoc',
    full_name: 'Tỉnh Bình Phước',
    full_name_en: 'Binh Phuoc Province',
  },
  {
    id: '72',
    name: 'Tây Ninh',
    name_en: 'Tay Ninh',
    full_name: 'Tỉnh Tây Ninh',
    full_name_en: 'Tay Ninh Province',
  },
  {
    id: '74',
    name: 'Bình Dương',
    name_en: 'Binh Duong',
    full_name: 'Tỉnh Bình Dương',
    full_name_en: 'Binh Duong Province',
  },
  {
    id: '75',
    name: 'Đồng Nai',
    name_en: 'Dong Nai',
    full_name: 'Tỉnh Đồng Nai',
    full_name_en: 'Dong Nai Province',
  },
  {
    id: '77',
    name: 'Bà Rịa - Vũng Tàu',
    name_en: 'Ba Ria - Vung Tau',
    full_name: 'Tỉnh Bà Rịa - Vũng Tàu',
    full_name_en: 'Ba Ria - Vung Tau Province',
  },
  {
    id: '79',
    name: 'Hồ Chí Minh',
    name_en: 'Ho Chi Minh',
    full_name: 'Thành phố Hồ Chí Minh',
    full_name_en: 'Ho Chi Minh City',
  },
  {
    id: '80',
    name: 'Long An',
    name_en: 'Long An',
    full_name: 'Tỉnh Long An',
    full_name_en: 'Long An Province',
  },
  {
    id: '82',
    name: 'Tiền Giang',
    name_en: 'Tien Giang',
    full_name: 'Tỉnh Tiền Giang',
    full_name_en: 'Tien Giang Province',
  },
  {
    id: '83',
    name: 'Bến Tre',
    name_en: 'Ben Tre',
    full_name: 'Tỉnh Bến Tre',
    full_name_en: 'Ben Tre Province',
  },
  {
    id: '84',
    name: 'Trà Vinh',
    name_en: 'Tra Vinh',
    full_name: 'Tỉnh Trà Vinh',
    full_name_en: 'Tra Vinh Province',
  },
  {
    id: '86',
    name: 'Vĩnh Long',
    name_en: 'Vinh Long',
    full_name: 'Tỉnh Vĩnh Long',
    full_name_en: 'Vinh Long Province',
  },
  {
    id: '87',
    name: 'Đồng Tháp',
    name_en: 'Dong Thap',
    full_name: 'Tỉnh Đồng Tháp',
    full_name_en: 'Dong Thap Province',
  },
  {
    id: '89',
    name: 'An Giang',
    name_en: 'An Giang',
    full_name: 'Tỉnh An Giang',
    full_name_en: 'An Giang Province',
  },
  {
    id: '91',
    name: 'Kiên Giang',
    name_en: 'Kien Giang',
    full_name: 'Tỉnh Kiên Giang',
    full_name_en: 'Kien Giang Province',
  },
  {
    id: '92',
    name: 'Cần Thơ',
    name_en: 'Can Tho',
    full_name: 'Thành phố Cần Thơ',
    full_name_en: 'Can Tho City',
  },
  {
    id: '93',
    name: 'Hậu Giang',
    name_en: 'Hau Giang',
    full_name: 'Tỉnh Hậu Giang',
    full_name_en: 'Hau Giang Province',
  },
  {
    id: '94',
    name: 'Sóc Trăng',
    name_en: 'Soc Trang',
    full_name: 'Tỉnh Sóc Trăng',
    full_name_en: 'Soc Trang Province',
  },
  {
    id: '95',
    name: 'Bạc Liêu',
    name_en: 'Bac Lieu',
    full_name: 'Tỉnh Bạc Liêu',
    full_name_en: 'Bac Lieu Province',
  },
  {
    id: '96',
    name: 'Cà Mau',
    name_en: 'Ca Mau',
    full_name: 'Tỉnh Cà Mau',
    full_name_en: 'Ca Mau Province',
  },
];

export const mockWardDataOfHoanKiemHaNoi = [
  {
    id: '00001',
    name: 'Phúc Xá',
    name_en: 'Phuc Xa',
    full_name: 'Phường Phúc Xá',
    full_name_en: 'Phuc Xa Ward',
  },
  {
    id: '00004',
    name: 'Trúc Bạch',
    name_en: 'Truc Bach',
    full_name: 'Phường Trúc Bạch',
    full_name_en: 'Truc Bach Ward',
  },
  {
    id: '00006',
    name: 'Vĩnh Phúc',
    name_en: 'Vinh Phuc',
    full_name: 'Phường Vĩnh Phúc',
    full_name_en: 'Vinh Phuc Ward',
  },
  {
    id: '00007',
    name: 'Cống Vị',
    name_en: 'Cong Vi',
    full_name: 'Phường Cống Vị',
    full_name_en: 'Cong Vi Ward',
  },
  {
    id: '00008',
    name: 'Liễu Giai',
    name_en: 'Lieu Giai',
    full_name: 'Phường Liễu Giai',
    full_name_en: 'Lieu Giai Ward',
  },
  {
    id: '00010',
    name: 'Nguyễn Trung Trực',
    name_en: 'Nguyen Trung Truc',
    full_name: 'Phường Nguyễn Trung Trực',
    full_name_en: 'Nguyen Trung Truc Ward',
  },
  {
    id: '00013',
    name: 'Quán Thánh',
    name_en: 'Quan Thanh',
    full_name: 'Phường Quán Thánh',
    full_name_en: 'Quan Thanh Ward',
  },
  {
    id: '00016',
    name: 'Ngọc Hà',
    name_en: 'Ngoc Ha',
    full_name: 'Phường Ngọc Hà',
    full_name_en: 'Ngoc Ha Ward',
  },
  {
    id: '00019',
    name: 'Điện Biên',
    name_en: 'Dien Bien',
    full_name: 'Phường Điện Biên',
    full_name_en: 'Dien Bien Ward',
  },
  {
    id: '00022',
    name: 'Đội Cấn',
    name_en: 'Doi Can',
    full_name: 'Phường Đội Cấn',
    full_name_en: 'Doi Can Ward',
  },
  {
    id: '00025',
    name: 'Ngọc Khánh',
    name_en: 'Ngoc Khanh',
    full_name: 'Phường Ngọc Khánh',
    full_name_en: 'Ngoc Khanh Ward',
  },
  {
    id: '00028',
    name: 'Kim Mã',
    name_en: 'Kim Ma',
    full_name: 'Phường Kim Mã',
    full_name_en: 'Kim Ma Ward',
  },
  {
    id: '00031',
    name: 'Giảng Võ',
    name_en: 'Giang Vo',
    full_name: 'Phường Giảng Võ',
    full_name_en: 'Giang Vo Ward',
  },
  {
    id: '00034',
    name: 'Thành Công',
    name_en: 'Thanh Cong',
    full_name: 'Phường Thành Công',
    full_name_en: 'Thanh Cong Ward',
  },
];

export const mockWardDataOfDongVanHaGiang = [
  {
    id: '00712',
    name: 'Phó Bảng',
    name_en: 'Pho Bang',
    full_name: 'Thị trấn Phó Bảng',
    full_name_en: 'Pho Bang Township',
  },
  {
    id: '00715',
    name: 'Lũng Cú',
    name_en: 'Lung Cu',
    full_name: 'Xã Lũng Cú',
    full_name_en: 'Lung Cu Commune',
  },
  {
    id: '00718',
    name: 'Má Lé',
    name_en: 'Ma Le',
    full_name: 'Xã Má Lé',
    full_name_en: 'Ma Le Commune',
  },
  {
    id: '00721',
    name: 'Đồng Văn',
    name_en: 'Dong Van',
    full_name: 'Thị trấn Đồng Văn',
    full_name_en: 'Dong Van Township',
  },
  {
    id: '00724',
    name: 'Lũng Táo',
    name_en: 'Lung Tao',
    full_name: 'Xã Lũng Táo',
    full_name_en: 'Lung Tao Commune',
  },
  {
    id: '00727',
    name: 'Phố Là',
    name_en: 'Pho La',
    full_name: 'Xã Phố Là',
    full_name_en: 'Pho La Commune',
  },
  {
    id: '00730',
    name: 'Thài Phìn Tủng',
    name_en: 'Thai Phin Tung',
    full_name: 'Xã Thài Phìn Tủng',
    full_name_en: 'Thai Phin Tung Commune',
  },
  {
    id: '00733',
    name: 'Sủng Là',
    name_en: 'Sung La',
    full_name: 'Xã Sủng Là',
    full_name_en: 'Sung La Commune',
  },
  {
    id: '00736',
    name: 'Xà Phìn',
    name_en: 'Xa Phin',
    full_name: 'Xã Xà Phìn',
    full_name_en: 'Xa Phin Commune',
  },
  {
    id: '00739',
    name: 'Tả Phìn',
    name_en: 'Ta Phin',
    full_name: 'Xã Tả Phìn',
    full_name_en: 'Ta Phin Commune',
  },
  {
    id: '00742',
    name: 'Tả Lủng',
    name_en: 'Ta Lung',
    full_name: 'Xã Tả Lủng',
    full_name_en: 'Ta Lung Commune',
  },
  {
    id: '00745',
    name: 'Phố Cáo',
    name_en: 'Pho Cao',
    full_name: 'Xã Phố Cáo',
    full_name_en: 'Pho Cao Commune',
  },
  {
    id: '00748',
    name: 'Sính Lủng',
    name_en: 'Sinh Lung',
    full_name: 'Xã Sính Lủng',
    full_name_en: 'Sinh Lung Commune',
  },
  {
    id: '00751',
    name: 'Sảng Tủng',
    name_en: 'Sang Tung',
    full_name: 'Xã Sảng Tủng',
    full_name_en: 'Sang Tung Commune',
  },
  {
    id: '00754',
    name: 'Lũng Thầu',
    name_en: 'Lung Thau',
    full_name: 'Xã Lũng Thầu',
    full_name_en: 'Lung Thau Commune',
  },
  {
    id: '00757',
    name: 'Hố Quáng Phìn',
    name_en: 'Ho Quang Phin',
    full_name: 'Xã Hố Quáng Phìn',
    full_name_en: 'Ho Quang Phin Commune',
  },
  {
    id: '00760',
    name: 'Vần Chải',
    name_en: 'Van Chai',
    full_name: 'Xã Vần Chải',
    full_name_en: 'Van Chai Commune',
  },
  {
    id: '00763',
    name: 'Lũng Phìn',
    name_en: 'Lung Phin',
    full_name: 'Xã Lũng Phìn',
    full_name_en: 'Lung Phin Commune',
  },
  {
    id: '00766',
    name: 'Sủng Trái',
    name_en: 'Sung Trai',
    full_name: 'Xã Sủng Trái',
    full_name_en: 'Sung Trai Commune',
  },
];

@Injectable({
  providedIn: 'root',
})
export class PublicApiServiceService {
  constructor(
    private http: HttpClient,
    private notifierService: NotifierService
  ) {}

  getCity(type: number, code: number) {
    console.log('Getting city list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + code + '/.htm'
      )
      .pipe(
        tap(
          (res) => {
            console.log(
              '🚀 ~ PublicApiServiceService ~ getCity ~ res.data:',
              res.data
            );
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }
  getDistrictOfACity(type: '2', cityId: string) {
    console.log('Getting district list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + cityId + '.htm'
      )
      .pipe(
        tap(
          (res) => {
            console.log(
              '🚀 ~ PublicApiServiceService ~ getDistrictOfACity ~ res.data:',
              res.data
            );
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }

  getWardsOfADistrict(type: '3', wardId: string) {
    console.log('Getting ward list...');
    return this.http
      .get<ResPublicAPIDataDTO>(
        'https://esgoo.net/api-tinhthanh/' + type + '/' + wardId + '.htm'
      )
      .pipe(
        tap(
          (res) => {
            console.log(
              '🚀 ~ PublicApiServiceService ~ getWardsOfADistrict ~ res.data:',
              res.data
            );
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      );
  }
}

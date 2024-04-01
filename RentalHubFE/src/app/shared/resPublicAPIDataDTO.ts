export interface PublicAPIData {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
}

export interface ResPublicAPIDataDTO {
  error: any;
  error_text: string;
  data: PublicAPIData[];

  data_name: string;
}

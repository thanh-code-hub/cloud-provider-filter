export interface CloudProvider {
  cloud_name: string;
  cloud_description: string;
  provider: string;
  provider_description: string;
  [key: string]: string;
}

export interface Location {
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  [key: string]: string;
}

export interface ErrorResponse {
  detail: string;
  [key: string]: string;
}

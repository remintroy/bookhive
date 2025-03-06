import axios from "axios";

export function generateGoogleMapEmbedUrl(lat: string, lng: string) {
  if (!lat || !lng) return "";
  const baseURL = "https://www.google.com/maps/embed";
  const encodedLocation = btoa(`${lat}, ${lng}`).replace(/=+$/, "");
  return `${baseURL}?pb=!1m13!1m8!1m3!1d200000!2d${lng}!3d${lat}!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${encodedLocation}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
}

export type PincodeDataResponse = {
  location?: {
    lat: string;
    lon: string;
  };
  address?: string;
  addressResponse?: string;
  boundingBox?: string[];
  placeId?: string;
  dataOrigin?: "OpenStreetMap";
  googleMapUrl?: string;
  pincode?: string;
};

const catchForPincodeDataResponse: { [key: string]: PincodeDataResponse } = {};

export async function getPlaceDataFromPincode(pincode: string) {
  if (!pincode || pincode?.length < 6) return {};

  // Get the data from the Pincode catch
  if (catchForPincodeDataResponse[pincode]) return catchForPincodeDataResponse[pincode];

  const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`;

  const { data } = await axios.get(url);

  const placeData = data?.[0];
  const dataToSave: PincodeDataResponse = {
    location: {
      lat: placeData?.lat || "",
      lon: placeData?.lon || "",
    },
    address: placeData?.display_name || "",
    addressResponse: placeData || {},
    boundingBox: placeData?.boundingbox || [],
    placeId: placeData?.place_id || "",
    dataOrigin: "OpenStreetMap",
    googleMapUrl: generateGoogleMapEmbedUrl(placeData?.lat, placeData?.lon),
    pincode: pincode,
  };

  catchForPincodeDataResponse[pincode] = dataToSave;

  return dataToSave;
}

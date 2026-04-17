export interface VietnamProvince {
  code: number;
  name: string;
}

export interface VietnamDistrict {
  code: number;
  name: string;
  province_code: number;
}

export interface VietnamWard {
  code: number;
  name: string;
  district_code: number;
}

export const vietnamProvincesApi = {
  getProvinces: async (): Promise<VietnamProvince[]> => {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/');
      if (!res.ok) throw new Error("Failed to fetch provinces");
      const data = await res.json();
      return data.map((item: any) => ({ code: item.code, name: item.name }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getDistricts: async (provinceCode: number): Promise<VietnamDistrict[]> => {
    try {
      if (!provinceCode) return [];
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      if (!res.ok) throw new Error("Failed to fetch districts");
      const data = await res.json();
      if (!data || !data.districts) return [];
      return data.districts.map((item: any) => ({ code: item.code, name: item.name, province_code: provinceCode }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getWards: async (districtCode: number): Promise<VietnamWard[]> => {
    try {
      if (!districtCode) return [];
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      if (!res.ok) throw new Error("Failed to fetch wards");
      const data = await res.json();
      if (!data || !data.wards) return [];
      return data.wards.map((item: any) => ({ code: item.code, name: item.name, district_code: districtCode }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};

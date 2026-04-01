export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault?: boolean;
}

const STORAGE_KEY = "nettech_user_addresses";

const DUMMY_DATA: UserAddress[] = [
  {
    id: "a1",
    fullName: "Nguyễn Văn A",
    phone: "0909123456",
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    addressDetail: "69/68 Đặng Thùy Trâm",
    isDefault: true,
  },
  {
    id: "a2",
    fullName: "Trần Thị B",
    phone: "0988777666",
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 05",
    addressDetail: "Số 15 Lê Lợi",
    isDefault: false,
  }
];

export const addressApi = {
  getSavedAddresses: async (): Promise<UserAddress[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          resolve(JSON.parse(stored));
        } else {
          // Khởi tạo data giả vào local storage lần đầu
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_DATA));
          }
          resolve(DUMMY_DATA);
        }
      }, 300); // 300ms fake delay
    });
  },

  saveAddress: async (address: Omit<UserAddress, "id">): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
          const currentStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
          let current: UserAddress[] = currentStr ? JSON.parse(currentStr) : [...DUMMY_DATA];
          
          const newAddress: UserAddress = {
            ...address,
            id: `addr_${Date.now()}`
          };
          
          const updated = [...current, newAddress];
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
          resolve();
        }, 500); // 500ms fake write delay
    });
  }
};

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
          
          if (address.isDefault) {
            current = current.map((i) => ({ ...i, isDefault: false }));
          }

          const newAddress: UserAddress = {
            ...address,
            id: `addr_${Date.now()}`
          };
          
          let updated = [...current, newAddress];
          // Force sort default to top
          updated.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
          resolve();
        }, 500); // 500ms fake write delay
    });
  },

  updateAddress: async (address: UserAddress): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (!currentStr) return resolve();
        let current: UserAddress[] = JSON.parse(currentStr);
        
        if (address.isDefault) {
          current = current.map((i) => ({ ...i, isDefault: false }));
        }

        let mapRes = current.map((item) => (item.id === address.id ? address : item));
        mapRes.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapRes));
        }
        resolve();
      }, 300);
    });
  },

  deleteAddress: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (!currentStr) return resolve();
        let current: UserAddress[] = JSON.parse(currentStr);
        const filtered = current.filter((item) => item.id !== id);
        
        if (typeof window !== 'undefined') {
          // If deleted node was default and there are remaining items, promote the top one
          if (current.find((i) => i.id === id)?.isDefault && filtered.length > 0) {
            filtered[0].isDefault = true;
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }
        resolve();
      }, 300);
    });
  },

  setDefaultAddress: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (!currentStr) return resolve();
        let current: UserAddress[] = JSON.parse(currentStr);
        const result = current.map((item) => ({
          ...item,
          isDefault: item.id === id,
        }));
        result.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        }
        resolve();
      }, 400);
    });
  }
};

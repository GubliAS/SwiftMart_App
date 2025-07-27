import { BASE_URL } from '@/constants/env';

export type Address = {
  id: string;
  unitNumber?: string;
  streetNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  zipCode?: string; // for compatibility, but use postalCode
  countryId: number;
  countryCode?: string;
  isDefault?: boolean;
};

export async function fetchAddresses(userId: number | string, token: string): Promise<Address[]> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return await res.json();
}

export async function addAddress(address: Partial<Address>, token: string): Promise<Address> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error('Failed to add address');
  return await res.json();
}

export async function updateAddress(address: Partial<Address>, token: string): Promise<Address> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return await res.json();
}

export async function removeUserAddress(userId: number | string, addressId: number | string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses/user/${userId}/address/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to remove user-address link');
  }
}

export async function deleteAddress(addressId: number | string, token: string, userId?: number | string): Promise<void> {
  if (userId !== undefined) {
    await removeUserAddress(userId, addressId, token);
  }
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to delete address');
  }
}

export async function setDefaultAddress(userId: number | string, addressId: number | string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: String(userId),
      addressId: String(addressId),
      isDefault: true,
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to set default address');
  }
}

export async function fetchDefaultAddress(userId: number | string, token: string): Promise<Address | null> {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8085')}/api/addresses/user/${userId}/default`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) {
      return null; // No default address found
    }
    throw new Error('Failed to fetch default address');
  }
  return await res.json();
}

export default {}; 
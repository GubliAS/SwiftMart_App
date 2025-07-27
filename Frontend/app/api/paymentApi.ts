import { BASE_URL } from '@/constants/env';

export async function fetchPaymentMethods(userId: string, token: string) {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8082')}/api/payment-methods/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch payment methods');
  return await res.json();
}

export async function addPaymentMethod(data: any, token: string) {
  const url = `${BASE_URL.replace(':8080', ':8082')}/api/payment-methods`;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const body = JSON.stringify(data);
  console.log('addPaymentMethod - Request:', { url, headers, body });
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  const responseText = await res.text();
  console.log('addPaymentMethod - Response status:', res.status);
  console.log('addPaymentMethod - Response body:', responseText);
  if (!res.ok) throw new Error('Failed to add payment method');
  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function updatePaymentMethod(data: any, token: string) {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8082')}/api/payment-methods`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update payment method');
  return await res.json();
}

export async function deletePaymentMethod(id: string, token: string) {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8082')}/api/payment-methods/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete payment method');
}

export async function fetchDefaultPaymentMethod(userId: string, token: string) {
  const res = await fetch(`${BASE_URL.replace(':8080', ':8082')}/api/payment-methods/user/${userId}/default`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch default payment method');
  return await res.json();
}

export default {}; 
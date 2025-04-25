import { ApiResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let url = process.env.NEXT_PUBLIC_FRONTEND_URL;
  if(!url?.endsWith('/')) {
    url = url + '/';
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    if(Array.from(searchParams.keys()).length === 0) {
      url = url + 'checkout?error=true';
      return NextResponse.redirect(url);
    }
    const queryString = toQueryString(searchParams);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}order/callback?${queryString}`
    );
    const content = (await response.json()) as ApiResponse;
    if (content.success) {
      url = url + 'checkout/confirmation';
    } else {
      console.error('ERROR OCCUR WHEN ORDER:'+ content.message);
      url = url + 'checkout?error=true';
    }
  } catch (err) {
    console.error('ERROR OCCUR WHEN ORDER: ' + (err as Error).message);
    url = url + 'checkout?error=true';
  }
  return NextResponse.redirect(url);
}

function toQueryString(searchParams: URLSearchParams): string {
  const params = Object.fromEntries(searchParams);
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key as keyof object];
      if (value === null || value === undefined || value === '') {
        return '';
      }
      return (
        encodeURIComponent(key) + '=' + encodeURIComponent(value as string)
      );
    })
    .filter((s) => s !== '')
    .join('&');
  return queryString;
}

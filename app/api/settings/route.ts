import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Fungsi untuk MENGAMBIL data dari Database (Untuk semua pengunjung)
export async function GET() {
  try {
    const settings = await kv.get('adnan_settings');
    const creds = await kv.get('adnan_creds');
    return NextResponse.json({ settings, creds });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// Fungsi untuk MENYIMPAN data ke Database (Khusus Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.settings) await kv.set('adnan_settings', body.settings);
    if (body.creds) await kv.set('adnan_creds', body.creds);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}
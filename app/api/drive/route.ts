import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.DRIVE_FOLDER_ID;
    
    // Perbaikan: Hapus filter mimeType di API yang sering diblokir Google, kita ambil semua file di folder tersebut
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, webContentLink, mimeType)',
    });

// Perbaikan URL: Mengubah webContentLink menjadi direct stream menggunakan ID
// Perbaikan URL: Mengubah webContentLink menjadi direct stream menggunakan ID
    const files = response.data.files
      ?.filter(file => file.mimeType?.includes('image/'))
      ?.map(file => ({
        id: file.id,
        name: file.name,
        // Ini adalah trik resmi mem-bypass proxy halaman Google Drive menggunakan googleusercontent
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1080`, 
      })) || [];

    // PELACAKAN TERMINAL: Menampilkan hasil tarikan data langsung ke terminal VS Code Anda
    console.log("JUMLAH FOTO DITEMUKAN:", files.length);
    if (files.length === 0) {
      console.log("ISI MENTAH DARI GOOGLE DRIVE:", response.data.files);
    }

    return NextResponse.json({ files });
  } catch (error) {
    console.error("ERROR DRIVE API:", error);
    return NextResponse.json({ error: 'Gagal sinkronisasi dengan Google Drive' }, { status: 500 });
  }
}
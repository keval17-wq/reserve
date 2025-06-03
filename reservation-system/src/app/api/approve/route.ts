// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';
// import { sendReservationEmail } from '@/lib/email';

// export async function POST(req: Request) {
//   try {
//     const {
//       reservationId,
//       customerEmail,
//       customerName,
//       reservationDateTime,
//       persons,
//     } = await req.json();

//     if (!reservationId || !customerEmail || !customerName || !reservationDateTime || !persons) {
//       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
//     }

//     const { error } = await supabase
//       .from('reservations')
//       .update({ status: 'confirmed' })
//       .eq('id', reservationId);
//     if (error) throw error;

//     await sendReservationEmail({
//       reservationId,
//       toEmail: customerEmail,
//       customerName,
//       reservationDateTime,
//       persons,
//       type: 'confirmation',
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
//   }
// }

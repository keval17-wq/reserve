'use client';
import { useState, useEffect } from 'react';
import { updateReservation } from '@/lib/supabase/tables';
import { getAvailableTables, Reservation } from '@/lib/supabase/calendar'; // reuse existing helper

interface Props {
  reservation: Reservation;          // your typed model
  open: boolean;
  onClose(): void;
  onSaved(): void;                   // parent refresh callback
}

export default function EditReservationModal({ reservation, open, onClose, onSaved }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableId, setTableId] = useState(reservation.table_id);
  const [price, setPrice] = useState(reservation.price);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const list = await getAvailableTables(reservation.date, reservation.time_slot);
      setTables([reservation.table, ...list]); // ensure current table is included
    })();
  }, [open]);

  async function handleSave() {
    try {
      setSaving(true);
      await updateReservation(reservation.id, { table_id: tableId, price });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Edit Reservation</h3>

        <label className="block text-sm mb-1">Table</label>
        <select
          value={tableId}
          onChange={e => setTableId(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-4"
        >
          {tables.map(t => (
            <option key={t.id} value={t.id}>
              {t.number} · {t.capacity} ppl
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1">Revenue ($)</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full border rounded px-2 py-1 mb-6"
        />

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

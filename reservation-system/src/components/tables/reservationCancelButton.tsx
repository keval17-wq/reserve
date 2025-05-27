'use client';

export const ReservationCancelButton = ({
  reservationId,
  customerEmail,
  customerName,
  reservationTime,
  partySize,
  onCancel,
}: {
  reservationId: string;
  customerEmail: string;
  customerName: string;
  reservationTime: string;
  partySize: number;
  onCancel: (
    id: string,
    email: string,
    name: string,
    time: string,
    partySize: number
  ) => void;
}) => {
  return (
    <button
      onClick={() =>
        onCancel(
          reservationId,
          customerEmail,
          customerName,
          reservationTime,
          partySize
        )
      }
      className="text-red-600 hover:underline text-xs"
    >
      Cancel
    </button>
  );
};

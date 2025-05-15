export default function SenderInfoForm() {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Sender Email Info</h2>
      <input
        type="email"
        placeholder="reservations@domain.com"
        className="w-full border p-2 rounded"
      />
      <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}

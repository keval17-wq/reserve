export default function EmailTemplateForm() {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Email Template Configuration</h2>

      <label className="block text-sm font-medium">Confirmation Template</label>
      <textarea className="w-full border p-2 rounded mb-4 h-32" defaultValue={`Hi {name}, your reservation for {partySize} on {dateTime} is confirmed.`} />

      <label className="block text-sm font-medium">Cancellation Template</label>
      <textarea className="w-full border p-2 rounded mb-4 h-32" defaultValue={`Hi {name}, your reservation on {dateTime} has been cancelled.`} />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save Templates</button>
    </div>
  );
}

type Customer = {
  id: string;
  name: string;
  email: string;
};

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <table className="w-full text-left border">
      <thead className="bg-gray-100 text-sm font-semibold">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-3">{c.name}</td>
            <td className="p-3">{c.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

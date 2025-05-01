export const AvailableTablesDropdown = ({ partySize }: { partySize: number }) => {
    return (
      <select className="border rounded w-full px-2 py-1">
        <option>Loading available tables for {partySize}...</option>
      </select>
    );
  };
  
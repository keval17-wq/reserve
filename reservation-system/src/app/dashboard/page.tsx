import Button from '@/components/button';

const Dashboard = () => {
    const handleClick = () => {
        alert('Button clicked!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <Button label="Click Me" onClick={handleClick} />
        </div>
    );
}

export default Dashboard;

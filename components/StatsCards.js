export default function StatsCards({ totalArticles, diesel, startTime }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Boxes" value={totalArticles} bgColor="bg-blue-100" textColor="text-blue-800" />
        <StatCard title="Diesel Expense" value={diesel} bgColor="bg-green-100" textColor="text-green-800" />
        <StatCard title="Vehicle Start Time" value={startTime} bgColor="bg-yellow-100" textColor="text-yellow-800" />
      </div>
    );
  }
  
  function StatCard({ title, value, bgColor, textColor }) {
    return (
      <div className={`${bgColor} ${textColor} rounded-lg shadow-md p-6`}>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    );
  }
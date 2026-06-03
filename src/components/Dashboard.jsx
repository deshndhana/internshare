import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0d6efd', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = ({ reviews }) => {
  // Aggregate data
  const companyCounts = {};
  const departmentCounts = {};
  const locationCounts = {};

  reviews.forEach(r => {
    companyCounts[r.companyName] = (companyCounts[r.companyName] || 0) + 1;
    departmentCounts[r.department] = (departmentCounts[r.department] || 0) + 1;
    locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
  });

  const companyData = Object.keys(companyCounts).map(name => ({ name, value: companyCounts[name] }));
  const departmentData = Object.keys(departmentCounts).map(name => ({ name, value: departmentCounts[name] }));
  
  // Format location data for BarChart
  const locationData = Object.keys(locationCounts).map(name => ({
    name: name.substring(0, 15) + (name.length > 15 ? '...' : ''), // truncate long names
    Interns: locationCounts[name]
  }));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Analytics Dashboard</h2>
        <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)', margin: 0 }}>{reviews.length}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Total Experiences Shared</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Pie Chart - Companies */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Top Companies</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Departments */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Experiences by Department</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name.substring(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart - Locations */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Internships by Location</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={locationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="Interns" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

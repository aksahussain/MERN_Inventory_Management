import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

const Reports = () => {
    const { user } = useAuth();
    const [chartData, setChartData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch chart data and summary stats for analysis
                const [chartRes, statsRes] = await Promise.all([
                    API.get('/reports/chart'),
                    API.get('/reports/stats')
                ]);
                setChartData(chartRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error loading reports data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading Report...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Analysis Report</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Official record of sales performance (Last 7 Days)</p>
                <p className="text-sm text-gray-400 mt-2">Generated for: {user.name} ({user.role})</p>
            </div>

            {/* Chart Section - Formal View */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-3">Sales Trend Visualization</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={true} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={true} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={25} name="Completed Sales" />
                            <Bar dataKey="pendingAmount" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={25} name="Pending Sales" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Analytical Overview Section */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Financial Overview - Donut Chart */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-l-4 border-purple-500 pl-3">Financial Overview</h3>
                        <div className="h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Total Sales', value: stats.sales },
                                            { name: 'Total Purchases', value: stats.purchases }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell key="sales" fill="#10b981" />
                                        <Cell key="purchases" fill="#3b82f6" />
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            Comparing incoming revenue vs outgoing procurement costs.
                        </div>
                    </div>

                    {/* Inventory Health - Pie Chart */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-l-4 border-red-500 pl-3">Inventory Health Distribution</h3>
                        <div className="h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Healthy Stock', value: stats.products - stats.lowStock },
                                            { name: 'Low Stock Alert', value: stats.lowStock }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Cell key="healthy" fill="#10b981" />
                                        <Cell key="low" fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            Proportion of products requiring immediate restocking attention.
                        </div>
                    </div>
                </div>
            )}

            {/* Data Table Section - Read Only */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <h3 className="text-lg font-semibold p-6 pb-4 text-gray-800 dark:text-gray-200 border-l-4 border-green-500 ml-6 mt-6 pl-3">Daily Revenue Breakdown</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Revenue Recorded</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.length > 0 ? (
                                chartData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{item._id}</td>
                                        <td className="p-4 text-gray-900 dark:text-white font-mono font-medium">₹{(item.amount + item.pendingAmount).toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col space-y-1">
                                                {item.amount > 0 && (
                                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 w-fit">
                                                        {item.amount > 0 && item.pendingAmount > 0 ? `Verified: ₹${item.amount.toLocaleString()}` : 'Verified'}
                                                    </span>
                                                )}
                                                {item.pendingAmount > 0 && (
                                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-700 w-fit">
                                                        {item.amount > 0 && item.pendingAmount > 0 ? `Pending: ₹${item.pendingAmount.toLocaleString()}` : 'Pending'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">No data available for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;

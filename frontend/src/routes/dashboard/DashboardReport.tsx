import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from "react"

export default function JobStatisticsDashboard() {
    const [stats, setStats] = useState({
        jobs: 0,
        accepted: 0,
        rejected: 0,
        pending: 0
    })

    useEffect(() => {
        (async () => {
            const response =  await fetch(`http://localhost:8080/job/stats`, {
                credentials: "include",
            })

            if(response.ok){
                const body = await response.json()
                setStats(body)
            }
        })()
    })

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Job Statistics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Applications Accepted" value={stats.accepted} color="bg-green-500" />
                <StatCard title="Applications Rejected" value={stats.rejected} color="bg-red-500" />
                <StatCard title="Applications Pending" value={stats.pending} color="bg-blue-500" />
                <StatCard title="Total Jobs" value={stats.jobs} color="bg-purple-500" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Statistics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            {
                                name: "Applications Accepted",
                                value: stats.accepted
                            },
                            {
                                name: "Applications Rejected",
                                value: stats.rejected
                            },
                            {
                                name: "Applications Pending",
                                value: stats.pending
                            },
                            {
                                name: "Jobs",
                                value: stats.jobs
                            }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Application Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={stats.accepted/stats.jobs * 100} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">{stats.accepted/stats.jobs * 100}% of applications are accepted</p>
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`w-4 h-4 rounded-full ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}
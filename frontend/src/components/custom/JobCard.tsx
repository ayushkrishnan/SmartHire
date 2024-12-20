import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface JobCardProps {
    title: string
    description: string
    experience: string
    department: string
}

export function JobCard({ title, description, experience, department }: JobCardProps) {
    return (
        <Card className="w-[350px] m-2">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{department}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{description}</p>
                <p className="text-sm font-semibold">Experience: {experience}</p>
            </CardContent>
        </Card>
    )
}

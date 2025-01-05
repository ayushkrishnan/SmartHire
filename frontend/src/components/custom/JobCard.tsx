import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import { Link } from "react-router"

interface JobCardProps {
    id: number,
    title: string
    description: string
    experience: string
    department: string,
    skills: string[],
    onDelete: (id: number) => void
}

export function JobCard({ id, title, description, experience, department, onDelete }: JobCardProps) {

    return (
        <Card className="w-[350px] m-2 flex flex-col h-fit">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{department}</CardDescription>
            
            </CardHeader>
            <CardContent className="flex flex-col">
                <p className="text-sm text-muted-foreground mb-2 max-h-96 overflow-hidden text-ellipsis">{description}</p>
                <p className="text-sm font-semibold mt-auto">Experience: {experience}</p>
            </CardContent>
            <CardFooter className="flex flex-row gap-2">
                <Link to={`/dashboard/job/${id}`}>
                    <Button>View Job</Button>
                </Link>
                <Button variant="outline" onClick={() => onDelete(id)}>
                    <Trash/>
                </Button>
            </CardFooter>
        </Card>
    )
}

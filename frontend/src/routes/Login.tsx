import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Link, useNavigate } from "react-router"

import { FormEvent, useEffect } from "react"

export default function Login() {
    const navigate = useNavigate();

    //If user count is 0, we can assume there are no admin users. Navigate to onboarding section.
    useEffect(() => {
        (async () => {

            const userCountResponse = await fetch(`http://localhost:8080/user/count`);

            if(userCountResponse.ok){
                const userCount = await userCountResponse.json();
                if(userCount.count === 0){
                    navigate("/onboard");
                }
            }
        })();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if(response.ok){
            const user = await response.json();

            switch(user.type){
                case "admin":
                    navigate("/admin");
                    break;
                case "hr":
                    navigate("/dashboard");
                    break;
                case "applicant":
                    navigate("/apply");
                    break;
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login to SmartHire</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                            />
                        </div>
                        {/*{error && <p className="text-red-500 text-sm">{error}</p>} */}
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
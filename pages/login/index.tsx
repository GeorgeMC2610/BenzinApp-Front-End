import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function DocsPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Assuming the response contains a token
        // Save the token in cookies
        Cookies.set('authToken', data.auth_token, { expires: 7 }); // Expires in 7 days

        // Redirect to /car/
        router.push("/car/");
      } else if (response.status === 401) {
        // If login fails, display error message
        setError("Error: Wrong username or password, please try again.");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Error: " + error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Login</h1>
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex w-64 flex-wrap flex-col md:flex-nowrap gap-4 mt-8">
            <Input
              type="text"
              label="Username"
              placeholder="supra_jonathan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? "🙈" : "👁️"}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" className="bg-green-800">
              Login
            </Button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}

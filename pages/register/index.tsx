import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

// Helper function to generate a random number within a range
const getRandomYear = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// List of car manufacturers and models
const carData = [
  { manufacturer: "Toyota", models: ["Supra", "Corolla", "AE86", "Yaris", "Camry", "Prius"] },
  { manufacturer: "Volkswagen", models: ["Golf", "Polo", "T-Roc", "Passat", "Tiguan"] },
  { manufacturer: "Tesla", models: ["Model S", "Model 3", "Model X", "Model Y"] },
  { manufacturer: "Aston Martin", models: ["DB9", "DB11", "Vantage", "Rapide"] },
  { manufacturer: "Ferrari", models: ["488", "F8 Tributo", "Roma", "SF90"] },
  { manufacturer: "Ford", models: ["Mustang", "Fiesta", "Focus", "F-150", "Explorer"] },
  { manufacturer: "BMW", models: ["M3", "X5", "X3", "i8", "Z4"] },
  { manufacturer: "Honda", models: ["Civic", "Accord", "CR-V", "Fit", "S2000"] },
  { manufacturer: "Mercedes-Benz", models: ["C-Class", "E-Class", "S-Class", "GLA", "GLE"] },
  { manufacturer: "Audi", models: ["A4", "Q5", "R8", "A6", "TT"] },
  { manufacturer: "Lamborghini", models: ["Huracan", "Aventador", "Urus", "Gallardo"] }
];

export default function RegisterPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [manufacturer, setManufacturer] = React.useState("");
  const [model, setModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [error, setError] = React.useState("");
  const [randomManufacturer, setRandomManufacturer] = React.useState("");
  const [randomModel, setRandomModel] = React.useState("");
  const [randomYear, setRandomYear] = React.useState(getRandomYear(1990, 2024));
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ username, password, manufacturer, model, year }),
      });

      if (response.status === 201) {
        const data = await response.json();
        
        // Assuming your token is returned in the response as "data.token"
        const { authToken } = data.auth_token;

        // Store the token as a cookie (with options)
        Cookies.set("authToken", authToken, { expires: 7, path: "/", secure: true }); // expires in 7 days, adjust as needed

        // After setting the cookie, navigate to the desired page
        router.push("/car");
      } else if (response.status === 422) {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || "Invalid input, please try again."}`);
      } else {
        setError("Error: Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Registration request failed:", error);
      setError("Error: " + error);
    }
  };

  // Client-side randomization using useEffect to trigger on mount
  useEffect(() => {
    // Randomize manufacturer and model on component mount (page load or refresh)
    const randomCar = carData[Math.floor(Math.random() * carData.length)];
    const randomModel = randomCar.models[Math.floor(Math.random() * randomCar.models.length)];
    const randomYear = getRandomYear(1990, 2024);

    // Set the placeholders
    setRandomManufacturer(randomCar.manufacturer);
    setRandomModel(randomModel);
    setRandomYear(randomYear);
  }, []); // Empty dependency array to trigger only on initial render

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Register</h1>
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex w-64 flex-wrap flex-col md:flex-nowrap gap-4 mt-8">
            
            {/* Tell us about you */}
            <h2 className="text-lg font-semibold">Tell us about you</h2>
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
            <Input
              label="Confirm Password"
              variant="bordered"
              placeholder="Confirm your password"
              type={isVisible ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="max-w-xs"
            />

            {/* Tell us about your car */}
            <h2 className="text-lg font-semibold">Tell us about your car</h2>
            <Input
              type="text"
              label="Manufacturer"
              placeholder={randomManufacturer}
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
            <Input
              type="text"
              label="Model"
              placeholder={randomModel}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <Input
              type="number"
              label="Year"
              placeholder={randomYear.toString()}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <Button type="submit" className="bg-green-800">
              Register
            </Button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
}

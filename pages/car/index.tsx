import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";

export default function MyCarPage() {
  const [carInfo, setCarInfo] = useState<{ manufacturer: string; model: string; year: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarInfo = async () => {
      try {
        const token = Cookies.get('authToken'); // Retrieve the token from cookies

        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch('/api/car', {
          headers: {
            'Authorization': `Bearer ${token}`, // Use the token in the authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch car information');
        }

        const data = await response.json();
        setCarInfo(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    fetchCarInfo();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title()}>My Car</h1>
          <h4 className={subtitle({ class: "mt-4" })}>
            View the details of your car.
          </h4>
        </div>

        {error ? (
          <div className="text-red-500 text-center">
            <p>Error: {error}</p>
          </div>
        ) : carInfo ? (
          <div className="text-center">
            <p><strong>Manufacturer:</strong> {carInfo.manufacturer}</p>
            <p><strong>Model:</strong> {carInfo.model}</p>
            <p><strong>Year:</strong> {carInfo.year}</p>
          </div>
        ) : (
          <div className="text-center">Loading...</div>
        )}

        <div className="flex gap-3 mt-4">
          <Link
            href="/"
            className={buttonStyles({ variant: "bordered", radius: "full" })}
          >
            Go Home
          </Link>
          <Link
            href="/about"
            className={buttonStyles({ variant: "bordered", radius: "full" })}
          >
            About Us
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="max-w-xl text-center justify-center">
          <h1 className={title()}>About BenzinApp</h1>
          <Divider className="my-6" />
          
            <p className="text-justify leading-relaxed">
              In 2022, Giorgos set out to solve a problem every driver faces: tracking car efficiency without a trip computer. 
              With an older car and no easy way to log data, he wanted a solution that wasn’t clunky or time-consuming. That’s when 
              <b> BenzinApp</b> was born—a free, open-source app that simplifies car management without the hassle of manual input.
            </p>
            <br />
            <p className="text-justify leading-relaxed">
              As the app grew, Giorgos teamed up with his brother Aimilios to enhance the front-end and user experience. 
              Together, they transformed <b>BenzinApp</b> into a family project that helps drivers everywhere stay on top of their car’s performance effortlessly.
            </p>

          <Divider className="my-6" />
          
          <Button color="default" className="mt-6">
            Get Started with BenzinApp
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

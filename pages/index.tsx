import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 animate-fade-down md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title()}>Fuel statistics, </h1>
          <h1 className={title({ color: ("green") })}>simplified.&nbsp;</h1>
          <br />
          <h4 className={subtitle({ class: "mt-4" })}>
          Record fuel, maintenance, and trips effortlessly.<br /><br /> Get insights into your car’s performance and expenses—all from your phone.
          </h4>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "success",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.github}
          >
            Get started
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            Learn more
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}

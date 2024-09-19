"use client";
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  HeartFilledIcon,
} from "@/components/icons";

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const [hydrated, setHydrated] = useState(false);

  // Ensure the component only renders after it's hydrated on the client
  useEffect(() => {
    setHydrated(true);
  }, []);

  // If the component is not yet hydrated, do not render the dynamic content
  if (!hydrated) {
    return null; // You could also return a loading spinner here if needed
  }

  const isLoggedIn = auth?.isLoggedIn || false;
  const carInfo = auth?.carInfo || null;
  const logout = auth?.logout || (() => {});

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image src="/benzinapp.png" alt="BenzinApp Logo" width="26" height="26" />
            <p className="font-bold text-inherit">BenzinApp</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem>
            <NextLink
              className={clsx(
                "text-foreground",
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              href="/"
            >
              Home
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={clsx(
                "text-foreground",
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              href="/about"
            >
              About
            </NextLink>
          </NavbarItem>

          {isLoggedIn ? (
            <>
              <NavbarItem>
                <Button
                  className="text-sm font-normal text-default-600 bg-default-100"
                  onClick={logout}
                  variant="flat"
                >
                  Logout
                </Button>
              </NavbarItem>
              <NavbarItem>
                <span className="text-foreground">
                  Logged in as: {carInfo}
                </span>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <NextLink
                  className={clsx(
                    "text-foreground",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href="/login"
                >
                  Login
                </NextLink>
              </NavbarItem>
              <NavbarItem>
                <NextLink
                  className={clsx(
                    "text-foreground",
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  href="/register"
                >
                  Register
                </NextLink>
              </NavbarItem>
            </>
          )}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {isLoggedIn && (
          <NavbarItem className="hidden md:flex">
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            >
              Donate
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

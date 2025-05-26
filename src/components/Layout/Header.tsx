import React from "react";
import { RefreshCw, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

export const Header: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: "Daily Challenge", href: "/" },
    { name: "Changelogs", href: "/changelogs" },
  ];

  return (
    <Disclosure as="header">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link
                to="/"
                className="flex text-[#6b4633] items-center font-instrument gap-2"
              >
                <RefreshCw className="size-4 sm:size-5" />
                <h1 className="text-lg sm:text-xl font-bold">Num Shift</h1>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center">
                <ul className="flex space-x-6">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`text-base font-medium transition-colors hover:text-[#6b4633] ${
                          location.pathname === item.href
                            ? "text-[#6b4633]"
                            : "text-gray-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#6b4633] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6b4633]">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Panel */}
          <DisclosurePanel className="md:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1 bg-white border border-gray-200">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-[#6b4633] bg-gray-50"
                      : "text-gray-600 hover:text-[#6b4633] hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox, Search } from "lucide-react";
import {
  SignedOut,
  SignInButton,
  UserButton,
  SignedIn,
  SignIn,
} from "@clerk/clerk-react";

export default function Header() {
  const [showSignIn, setshowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in")) {
      setshowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target == e.currentTarget) {
      setshowSignIn(false);
      setSearch({});
    }
  };
  return (
    <>
      <nav className="py-4 px-10 flex justify-between items-center">
        <Link>
          <img src="/logo.png" className="h-20" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="outline" onClick={() => setshowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {/* condition for showing button */}
            <Button variant="destructive" className="rounded-full">
              <PenBox size={20} className="mr-1"></PenBox>
              Post a Job
            </Button>
            <Link to="/postjob"></Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/myjob"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/savedjob"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
      {showSignIn && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10"
          onClick={handleOverlayClick}
        >
          <SignIn></SignIn>
        </div>
      )}
    </>
  );
}

import { useUser } from "@clerk/clerk-react";
import React from "react";

export default function Onboarding() {
  const { user } = useUser();
  console.log(user);
  return <div>onboarding</div>;
}

import React from "react";
import { Folder } from "remotion";
import { WaitlistCompositions } from "./videos/waitlist";

export function RemotionRoot() {
  return (
    <Folder name="Waitlist">
      <WaitlistCompositions />
    </Folder>
  );
}


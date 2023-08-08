import { LogInLink } from "./log-in-link";
import { Navigation } from "./navigation";
import { NewPostButton } from "./new-post-button";
import { Profile } from "./profile";

export function Sidebar() {
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <Profile />
        <Navigation />
        <LogInLink />
        <NewPostButton />
      </div>
    </>
  );
}

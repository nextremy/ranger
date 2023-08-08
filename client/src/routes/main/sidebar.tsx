import { Navigation } from "./navigation";
import { NewPostButton } from "./new-post-button";
import { Profile } from "./profile";

export function Sidebar() {
  return (
    <>
      <Profile />
      <Navigation />
      <div className="p-2">
        <NewPostButton />
      </div>
    </>
  );
}

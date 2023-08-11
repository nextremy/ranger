import { Tab } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { Form } from "../../components/form";
import { PostSearchResults } from "./post-search";

export function SearchRoute() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <form
        className="flex gap-2 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSearchQuery(searchInputRef.current?.value ?? "");
        }}
      >
        <Form.TextInput
          className="grow"
          placeholder="Search for posts or users"
          ref={searchInputRef}
          roundedFull
        />
        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-green-700 text-gray-100 duration-150 hover:bg-green-800"
          title="Search"
          type="submit"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>
      <Tab.Group>
        <Tab.List className="grid auto-cols-fr grid-flow-col">
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-gray-700">
              Posts
            </div>
          </Tab>
          <Tab className="grid h-12 place-items-center font-semibold text-gray-600 duration-200 hover:bg-gray-200 hover:text-gray-900 ui-selected:text-gray-900">
            <div className="grid h-12 place-items-center border-b-4 border-transparent px-2 ui-selected:border-gray-700">
              Users
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="border-t border-gray-300">
          <Tab.Panel>
            <PostSearchResults searchQuery={searchQuery} />
          </Tab.Panel>
          <Tab.Panel></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

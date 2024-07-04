import { Spinner } from "flowbite-react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  );
}

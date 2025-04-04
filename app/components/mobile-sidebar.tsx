// // "use client";

// import { MenuIcon } from "lucide-react";
// import { Button } from "./ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// import Sidebar from "./sidebar";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// export const MobileSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   //   close the mobile-sidebar whenever the pathname changes
//   useEffect(
//     function () {
//       setIsOpen(false);
//     },
//     [pathname]
//   );
//   return (
//     <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
//       <SheetTrigger asChild>
//         <Button variant={"secondary"} className="lg:hidden">
//           <MenuIcon className="size-4 text-neutral-500" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent className="p-0" side="left">
//         <Sidebar />
//       </SheetContent>
//     </Sheet>
//   );
// };

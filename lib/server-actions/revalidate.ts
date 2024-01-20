"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidate({
   tags,
   path,
}: {
   tags?: string[];
   path?: string;
}) {
   if (tags) {
      tags?.length > 0 &&
         tags.forEach((tag: string) => {
            console.log("revalidating:", tag);
            revalidateTag(tag);
         });
   }

   if (path) {
      const url = process.env.NEXT_PUBLIC_LUMINARY_URL;
      if (url && path.includes(url)) {
         revalidatePath(path);
      } else {
         path.startsWith("/") && path.replace("/", "");
         console.log("path", path);
         revalidatePath(`${url}/${path} `);
      }
   }
}

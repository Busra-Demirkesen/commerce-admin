import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function SetLayout({
  children
} : {
    children:React.ReactNode;
}) {
  
  const { userId } = await auth(); 

  if(!userId){
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId
    }
  });

  if(store){
    redirect(`/${store.id}`);

  }

  return(
    <>
    {children}
    </>
  )
}
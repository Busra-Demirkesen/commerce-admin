'use client';



import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";


  const SetupPage = () =>{
    const onOpen = useStoreModal ((state) => state.onOpen);
    const isOpen = useStoreModal((state) => state.isOpen);
  
    useEffect(() =>{
      if(!isOpen){
        onOpen();
      }
    }, [isOpen, onOpen]);

   return null;

}
 

export default SetupPage;
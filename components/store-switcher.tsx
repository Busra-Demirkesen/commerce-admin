'use client';

import { Store } from '@prisma/client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from "@/lib/utils";
import { useStoreModal } from '@/hooks/use-store-modal';
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup, CommandSeparator } from './ui/command';
import { Button } from './ui/button';
import { Check,ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId?.toString()
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label ?? "Select store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>

          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className='text-sm'
                >
                  <StoreIcon className='mr-2 h-4 w-4' />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value ?
                      'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

          </CommandList>
              <CommandSeparator/>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                  onSelect={()=>{
                    setOpen(false);
                    storeModal.onOpen();
                  }}
                  >
                    Create Store
                    <PlusCircle className='mr-2 h-5 w-5'/>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import { GeneratedAvatar } from "@/components/generated-avtar";
import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";


interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const [ search, setSearch ] = useState("")

    const trpc = useTRPC();
    const data = useQuery(
        trpc.data.getMany.queryOptions({
            search,
            pageSize: 100,
        })
    );

    return (
        <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
            <CommandInput
            placeholder="Find a meeting or agent..."
            value={search}
            onValueChange={(value) => {
                setSearch(value);
            }}
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No meetings found
                        </span>
                    </CommandEmpty>
                </CommandGroup>
                <CommandGroup heading="Agents">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No agents found
                        </span>
                    </CommandEmpty>
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    );
};
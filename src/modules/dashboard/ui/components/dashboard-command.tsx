import { GeneratedAvatar } from "@/components/generated-avtar";
import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";


interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("")

    // Dummy data
    const dummyMeetings = [
        { id: "1", title: "Weekly Sync" },
        { id: "2", title: "Project Kickoff" },
        { id: "3", title: "Client Review" },
    ];

    const dummyAgents = [
        { id: "1", name: "Support Bot" },
        { id: "2", name: "Sales Assistant" },
    ];

    const filteredMeetings = dummyMeetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    const filteredAgents = dummyAgents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

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
                    {filteredMeetings.length === 0 ? (
                        <CommandEmpty>
                            <span className="text-muted-foreground text-sm">
                                No meetings found
                            </span>
                        </CommandEmpty>
                    ) : (
                        filteredMeetings.map((meeting) => (
                            <CommandItem key={meeting.id} onSelect={() => router.push(`/meetings/${meeting.id}`)}>
                                <span>{meeting.title}</span>
                            </CommandItem>
                        ))
                    )}
                </CommandGroup>
                <CommandGroup heading="Agents">
                    {filteredAgents.length === 0 ? (
                        <CommandEmpty>
                            <span className="text-muted-foreground text-sm">
                                No agents found
                            </span>
                        </CommandEmpty>
                    ) : (
                        filteredAgents.map((agent) => (
                            <CommandItem key={agent.id} onSelect={() => router.push(`/agents/${agent.id}`)}>
                                <span>{agent.name}</span>
                            </CommandItem>
                        ))
                    )}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    );
};
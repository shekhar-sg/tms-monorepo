import { ChevronDownIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleCardProps {
  title: string;
  children: ReactNode;
}

const CollapsibleCard = (props: CollapsibleCardProps) => {
  const { title, children } = props;
  const [open, setOpen] = useState(true);

  return (
    <Card size={"sm"} className={"min-w-fit w-full h-fit"}>
      <CardContent>
        <Collapsible
          className={"space-y-3"}
          open={open}
          onOpenChange={() => setOpen((prev) => !prev)}
        >
          <CollapsibleTrigger
            render={
              <Button variant={"link"} size={"sm"} className={"p-0 capitalize"}>
                <ChevronDownIcon />
                {title}
              </Button>
            }
          />
          <CollapsibleContent className={"space-y-2"}>
            {children}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CollapsibleCard;

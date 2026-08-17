import { SelectOptionRendererProps } from "@/components/dashboard/tasks/new/select-options";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AvatarOption = ({ option }: SelectOptionRendererProps) => {
  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>{option.label.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <span>{option.label}</span>
    </>
  );
};

export default AvatarOption;

// import type { ReactNode } from "react";
// import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
// import {
//   DropdownMenuCheckboxItem,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
// } from "@/components/ui/dropdown-menu";
//
// interface SelectOptionsProps {
//   options: FilterOption[];
//   type: "single-select" | "multi-select";
//   selected: string[];
//   onChange: (values: string[]) => void;
//   renderOption?: (option: FilterOption) => ReactNode;
// }
//
// const SelectOptions = (props: SelectOptionsProps) => {
//   const { options, type, selected, onChange, renderOption } = props;
//
//   const renderOptionContent = (option: FilterOption) => {
//     return renderOption ? renderOption(option) : <OptionRow option={option} />;
//   };
//
//   if (type === "multi-select") {
//     return (
//       <>
//         {options.map((option) => (
//           <DropdownMenuCheckboxItem
//             key={option.value}
//             className={"p-2"}
//             checked={selected.includes(option.value)}
//             onCheckedChange={(checked) => {
//               const next = checked
//                 ? [...selected, option.value]
//                 : selected.filter((value) => value !== option.value);
//
//               onChange(next);
//             }}
//           >
//             {renderOptionContent(option)}
//           </DropdownMenuCheckboxItem>
//         ))}
//       </>
//     );
//   }
//
//   return (
//     <DropdownMenuRadioGroup
//       value={selected[0] ?? ""}
//       onValueChange={(value) => onChange([value])}
//     >
//       {options.map((option) => (
//         <DropdownMenuRadioItem
//           key={option.value}
//           value={option.value}
//           className="p-2"
//         >
//           {renderOptionContent(option)}
//         </DropdownMenuRadioItem>
//       ))}
//     </DropdownMenuRadioGroup>
//   );
// };
//
// export default SelectOptions;
//
// function OptionRow({ option }: { option: FilterOption }) {
//   const Icon = option.icon;
//   return (
//     <>
//       {Icon && <Icon className={option.color} />}
//       <span className={option.color}>{option.label}</span>
//     </>
//   );
// }

import type { ComponentType, ReactNode } from "react";
import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export interface SelectOptionRendererProps {
  option: FilterOption;
}

interface SelectOptionsProps {
  options: FilterOption[];
  type: "single-select" | "multi-select";
  selected: string[];
  onChange: (values: string[]) => void;
  renderOption?: ComponentType<SelectOptionRendererProps>;
}

const SelectOptions = (props: SelectOptionsProps) => {
  const {
    options,
    type,
    selected,
    onChange,
    renderOption: OptionRenderer,
  } = props;

  const renderOptionContent = (option: FilterOption): ReactNode => {
    if (OptionRenderer) {
      return <OptionRenderer option={option} />;
    }

    return <OptionRow option={option} />;
  };

  if (type === "multi-select") {
    return (
      <>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            className="p-2"
            checked={selected.includes(option.value)}
            onCheckedChange={(checked) => {
              const next = checked
                ? [...selected, option.value]
                : selected.filter((value) => value !== option.value);

              onChange(next);
            }}
          >
            {renderOptionContent(option)}
          </DropdownMenuCheckboxItem>
        ))}
      </>
    );
  }

  return (
    <DropdownMenuRadioGroup
      value={selected[0] ?? ""}
      onValueChange={(value) => onChange([value])}
    >
      {options.map((option) => (
        <DropdownMenuRadioItem
          key={option.value}
          value={option.value}
          className="p-2"
        >
          {renderOptionContent(option)}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
};

export default SelectOptions;

const OptionRow = ({ option }: SelectOptionRendererProps) => {
  const Icon = option.icon;

  return (
    <>
      {Icon && <Icon className={option.color} />}
      <span className={option.color}>{option.label}</span>
    </>
  );
};

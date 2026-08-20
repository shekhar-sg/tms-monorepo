"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/providers/breadcrumb-context";

const getBreadcrumbLabel = (segment: string) => {
  if (segment === "new") {
    return "Create Task";
  }

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const DashboardBreadcrumb = () => {
  const pathname = usePathname();
  const { dynamicLabel,setDynamicLabel } = useBreadcrumb();
  const segments = pathname.split("/").filter(Boolean);
  useEffect(() => {
    setDynamicLabel(null);
  }, [pathname, setDynamicLabel])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const label =
            index === segments.length - 1 && dynamicLabel
              ? dynamicLabel
              : getBreadcrumbLabel(segment);

          return (
            <Fragment key={href}>
              <BreadcrumbItem className="min-w-0">
                {isLast ? (
                  <BreadcrumbPage className="truncate">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href}>{label}</Link>} />
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;

"use client"

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function CurrentDate({className} : {className?: string}) {
  return (
    <p className={className}>
      {format(new Date(), "EEEE, d MMMM yyyy", { locale: idLocale })}
    </p>
  );
}

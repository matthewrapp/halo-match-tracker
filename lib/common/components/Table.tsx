import React from "react";
import { twMerge } from "tailwind-merge";

type Props = { children: React.ReactNode };
const Table = ({ children }: Props) => {
   return <table className="w-full min-w-max table-auto text-left">{children}</table>;
};

export default Table;

export const TableHead = ({
   data,
   children,
}: {
   data: Array<any>;
   children: (props: { item: any; index: number }) => React.ReactNode;
}) => {
   return (
      <thead>
         <tr>
            {data?.map((head, i) => {
               return children({ item: head, index: i });
            })}
         </tr>
      </thead>
   );
};

export const TableRow = ({ children }: { children: React.ReactNode }) => {
   return <tr>{children}</tr>;
};

export const TableBody = ({
   data,
   children,
   loading = false,
}: {
   data: Array<any>;
   children: (item: any, index: number) => React.ReactNode;
   loading?: boolean;
}) => {
   return (
      <tbody>
         {!loading ? (
            data?.map((item, i) => {
               return children(item, i);
            })
         ) : (
            <>LOADING</>
         )}
      </tbody>
   );
};

export const TableHeadCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
   return <th className={twMerge(`${className || ""}`)}>{children}</th>;
};

export const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
   return <td className={twMerge(`${className || ""}`)}>{children}</td>;
};

import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(request: Request) {
   return Response.json({ data: `No no no... Hehe` });
   // try {
   //    const filePath = path.resolve(process.cwd(), "lib/csvs/bekah.csv");
   //    const filePath2 = path.resolve(
   //       process.cwd(),
   //       "lib/csvs/bekah-customers.csv"
   //    );
   //    const fileData = await fs.readFile(filePath, "utf-8");
   //    const fileData2 = await fs.readFile(filePath2, "utf-8");
   //    const bekahsRecords = parse(fileData, { columns: true, delimiter: "," });
   //    const records2 = parse(fileData2, { columns: true, delimiter: "," });

   //    type CustomerName = string;
   //    type LeaseNumber = number | string;
   //    const customerNameMap: Record<CustomerName, LeaseNumber> = {};
   //    for (const obj of records2) {
   //       customerNameMap[obj["Customer Name"]] = obj["Lease Number"];
   //    }

   //    const finalData: Array<{
   //       "Customer Name": CustomerName;
   //       "Lease Number": LeaseNumber;
   //    }> = [];
   //    for (const obj of bekahsRecords) {
   //       const leaseNum = customerNameMap[obj["Customer Name"]] || "";
   //       console.log("leaseNum:", leaseNum);
   //       finalData.push({
   //          "Customer Name": obj["Customer Name"]?.split(", ").join(" | "),
   //          "Lease Number": leaseNum,
   //       });
   //    }

   //    const headers = ["Customer Name", "Lease Number"];
   //    const csvData = [
   //       headers.join(","),
   //       ...finalData.map(
   //          (row) => `${row["Customer Name"]},${row["Lease Number"]}`
   //       ),
   //    ].join("\n");
   //    const outputFilePath = path.resolve(
   //       process.cwd(),
   //       "lib/csvs/bekah-customers-results.csv"
   //    );
   //    await fs.writeFile(outputFilePath, csvData, "utf-8");

   //    return Response.json({ data: finalData }, { status: 200 });
   // } catch (err: any) {
   //    console.log("err:", err);
   //    return Response.json({ error: err }, { status: 500 });
   // }
}

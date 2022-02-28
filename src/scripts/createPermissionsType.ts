import fs from "fs";

const permissions = fs.readFileSync("./src/resources/permissions.txt").toString().split("\n");

let compiledPermissions = "";
for (let i = 0; i < permissions.length; i++) {
  const permission = permissions[i].trim();
  compiledPermissions += `"${permission}"`;

  if (i < permissions.length - 1) {
    compiledPermissions += " |";
  }
}

const template = `
/**
 * THIS FILE WAS GENERATED AUTOMATICALLY DO NOT EDIT
 * Last Gen. ${new Date().toDateString()}
 */


export type ExistingPermissions = ${compiledPermissions};
`;

fs.writeFileSync("./src/types/ExistingPermissions.ts", template);

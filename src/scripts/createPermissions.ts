import "reflect-metadata";
import { config } from "dotenv";
config();
import { PermissionDb, PermissionGroupDb } from "../models/Permission";
import { connectDb } from "../database/Database";

async function createPermissions(): Promise<void> {
  await connectDb();
  const permissionDb = new PermissionDb();
  const permissionGroupDb = new PermissionGroupDb();
  // const permissionService = new PermissionService(permissionDb, permissionGroupDb);

  await permissionDb.deleteAll();
  await permissionGroupDb.deleteAll();

  const changeName = await permissionDb.save({ name: "Change name", shortName: "changeName" });

  await permissionGroupDb.save({
    name: "Update Campaign",
    description: "Updating campaign information",
    shortName: "updateCampaign",
    permissions: [changeName.id],
  });

  console.log("created items");
  process.exit(0);
}

createPermissions();

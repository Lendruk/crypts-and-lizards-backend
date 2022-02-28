import "reflect-metadata";
import { config } from "dotenv";
config();
import { PermissionDb, PermissionGroupDb } from "../models/Permission";
import { connectDb } from "../database/Database";
import { CampaignDb } from "../models/Campaign";
import { RoleDb } from "../models/Role";

async function createPermissions(): Promise<void> {
  await connectDb();
  const permissionDb = new PermissionDb();
  const campaignDb = new CampaignDb();
  const roleDb = new RoleDb();
  const permissionGroupDb = new PermissionGroupDb();
  // const permissionService = new PermissionService(permissionDb, permissionGroupDb);

  await campaignDb.deleteAll();
  await roleDb.deleteAll();
  await permissionDb.deleteAll();
  await permissionGroupDb.deleteAll();

  const campaignTitle = await permissionDb.save({ name: "Change name", shortName: "campaign::changeTitle" });
  const campaignDescription = await permissionDb.save({
    name: "Change Description",
    shortName: "campaign::changeDescription",
  });
  const campaignDelete = await permissionDb.save({ name: "Delete campaign", shortName: "campaign::delete" });
  const campaignAddTag = await permissionDb.save({ name: "Add Tag", shortName: "campaign::addTag" });
  const campaignRemoveTag = await permissionDb.save({ name: "Remove Tag", shortName: "campaign::removeTag" });

  await permissionGroupDb.save({
    name: "Manage Campaign",
    description: "Contains the permissions needed to manage a campaign",
    shortName: "campaignOwner",
    permissions: [campaignTitle.id, campaignDescription.id, campaignDelete.id, campaignAddTag.id, campaignRemoveTag.id],
    global: true,
  });

  console.log("created items");
  process.exit(0);
}

createPermissions();
